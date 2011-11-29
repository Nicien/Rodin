<?php

define('TRY_TO_RE_USE_VERTICES', true);

define('MESH_MODE_VERTEX', 0);
define('MESH_MODE_VERTEX_UV', 1);
define('MESH_MODE_VERTEX_UV_NORMAL', 2);
define('MESH_MODE_VERTEX_NORMAL', 3);

class Object3d {
	
	public $name = '';
	public $mesh_groups = array();
}

class MeshGroup {

	public $name;
	
	// once mesh per material
	public $meshes = array();
}

class Mesh {

	public $vertex_mode = null;
	public $map_objindex_meshindex = array();
	
	public $material_name = '';
	
	public $indices = array();
	public $vertices = array();
	public $normals	= array();
	public $uvs	= array();
}

class WavefrontObjLoader {
	
	public $object3d = null;
	
	private $current_group = null;
	private $current_mesh = null;
	
	// obj informations:
	private $obj_vertices = array();
	private $obj_normals = array();
	private $obj_uvs = array();
	
	// for error message
	private $line_number = 0;
	private $obj_filename = 0;
	private $current_line = '';
	private $stat_vertex_re_use_count = 0;
	
	public function save_js($js_filepath) {
	
		$js = array();
		
		$js[] = 'var object3d = {';
		$js[] = "  name:'".addslashes($this->object3d->name)."',";
		$js[] = "  mesh_groups:";
		$js[] = "  [";
		foreach ($this->object3d->mesh_groups as $each_group) {
			
			$js[] = "    {";
			
			$js[] = "      name:'".addslashes($each_group->name)."',";
			$js[] = "      meshes:";
			$js[] = "      [";
			foreach ($each_group->meshes as $each_mesh) {
			
				$js[] = "        {";
				$js[] = "          material_name : '".addslashes($each_mesh->material_name)."',";
				$js[] = "          indices:";
				$js[] = "          [";
				$js[] = implode(',', $each_mesh->indices);
				$js[] = "          ],";
				$js[] = "          vertices:";
				$js[] = "          [";
				$js[] = implode(',', $each_mesh->vertices);
				$js[] = "          ],";
				$js[] = "          normals:";
				$js[] = "          [";
				$js[] = implode(',', $each_mesh->normals);
				$js[] = "          ],";
				$js[] = "          uvs:";
				$js[] = "          [";
				$js[] = implode(',', $each_mesh->uvs);
				$js[] = "          ]";
				$js[] = "        },";
			}
			$js[] = '      ]';
			$js[] = "    },";
			
			//echo "    -  (".count($each_group->meshes)." meshes)</BR>";
			//foreach ($each_group->meshes as $each_mesh) {
			
			//echo "        - {$each_mesh->material_name}<BR/>";
		}
		$js[] = '  ]';
		$js[] = '}';
		
		if (file_put_contents($js_filepath, implode("\n", $js) ) === false) {
		
			error("Can't write file: $js_filepath");
		}
	}
	
	public function parse($obj_filepath, $obj_name) {
	
		$this->object3d = new Object3d();
		$this->object3d->name = $obj_name;
		
		$this->stat_vertex_re_use_count = 0;
		
		$this->current_group = null;
		$this->current_mesh = null;
		
		$this->obj_vertices = array();
		$this->obj_normals = array();
		$this->obj_uvs = array();
		$this->line_number = 0;
		$this->obj_filename = $obj_filepath;
		
		$obj_content = file($obj_filepath);
		
		$lines_count = count($obj_content);
		for ($line_index = 0; $line_index != $lines_count; ++$line_index) {

			$this->line_number += 1;
			$this->current_line = $obj_content[$line_index];
			
			$line = $obj_content[$line_index];
			$line = trim($line); // facultatif
			
			if (strlen($line) == 0 || $line[0] == '#') continue;
			
			$line_components = array_filter(explode(' ', $line), 'not_empty_string');
			
			//dump($line_components);
			
			if ($this->failure_test(count($line_components) > 1, 'Not enough parameter')) continue;
			
			// get command:
			$cmd = $line_components[0];
			
			// remove command and reindex array (php ... halala !) 
			unset($line_components[0]);
			$line_components = array_values($line_components);
			
			if ($cmd == 'v') {
				
				if (  ($float_array = $this->floats_array($line_components, 3))  ) {
				
					$this->obj_vertices[] = $float_array;
				}
			}
			else if ($cmd == 'vt') {
			
				if (  ($float_array = $this->floats_array($line_components, 2))  ) {
				
					$this->obj_uvs[] = $float_array;
				}
			}
			else if ($cmd == 'vn') {
			
				if (  ($float_array = $this->floats_array($line_components, 3))  ) {
				
					$this->obj_normals[] = $float_array;
				}
			}
			else if ($cmd == 'f') {
			
				if ($this->failure_test($this->current_mesh != null, 'no current mesh')) continue;
				
				// vertex_count must be 3 or 4
				$vertex_count = count($line_components);
				if ($this->failure_test($vertex_count >= 3, 'not enough vertices for this face')) continue;
				if ($this->failure_test($vertex_count <= 4, 'too much vertices on this face, polygones are not supported')) continue;
				
				$vertex_mode = null;
				
				// search vertex mode of this line:
				if (strpos($line_components[0], '//') !== false) {
				
					$delimiter = '//';
					$vertex_mode = MESH_MODE_VERTEX_NORMAL;
					
				} else {
				
					$delimiter = '/';
					switch (substr_count($line_components[0], '/')) {
					
						case 0:
							$vertex_mode = MESH_MODE_VERTEX;
							break;
						case 1:
							$vertex_mode = MESH_MODE_VERTEX_UV;
							break;
						case 2:
							$vertex_mode = MESH_MODE_VERTEX_UV_NORMAL;
							break;
						default:
							$this->failure();
							continue;
					}
				}
				
				if ($this->current_mesh->vertex_mode == null) {
				
					// assign vertex mode to current mesh:
					$this->current_mesh->vertex_mode = $vertex_mode;
				}
				else {
				
					if ($this->failure_test($vertex_mode == $this->current_mesh->vertex_mode, 'mesh can\'t accept vertex with different vertex mode')) continue;
				}				
				
				// each vertex:
				$mesh_face_indexes = array();
				foreach ($line_components as $vertex_components) {
					
					if ($vertex_mode == MESH_MODE_VERTEX) {
						
						$obj_vertex_index = $vertex_components;
						$this->failure_test(settype($obj_vertex_index, 'integer'), 'not an integer');
						$mesh_face_indexes[] = $this->add_vertex_to_current_mesh($obj_vertex_index, -1, -1);
					}
					else {

						// cur vertex info in vertex[//normal]/[uv]
						$vertex_components = array_filter(explode($delimiter, $vertex_components), 'not_empty_string');

						$components_count = count($vertex_components);
						for ($ii = 0; $ii != count($vertex_components); ++$ii) {
						
							$this->failure_test(settype($vertex_components[$ii], 'integer'), 'not an integer');
						}
						
								
						switch ($vertex_mode) {
						
							case MESH_MODE_VERTEX_NORMAL:
								if ($this->failure_test($components_count == 2, 'vertex//normal should have 2 components')) continue;
								$mesh_face_indexes[] = $this->add_vertex_to_current_mesh($vertex_components[0], $vertex_components[1], -1);
								break;
								
							case MESH_MODE_VERTEX_UV:
								if ($this->failure_test($components_count == 2, 'vertex/uv should have 2 components')) continue;
								$mesh_face_indexes[] = $this->add_vertex_to_current_mesh($vertex_components[0], -1, $vertex_components[1]);
								break;
								
							case MESH_MODE_VERTEX_UV_NORMAL:
								if ($this->failure_test($components_count == 3, 'vertex/uv/normal should have 3 components')) continue;
								$mesh_face_indexes[] = $this->add_vertex_to_current_mesh($vertex_components[0], $vertex_components[2], $vertex_components[1]);
								
								break;
							default:
								$this->failure('format must be vertex, vertex//normal, vertex/uv or vertex/uv/normal');
								continue;
						}
					}
					
				}
				
				if (count($mesh_face_indexes) == 3) {
				
					$this->current_mesh->indices[] = $mesh_face_indexes[0];
					$this->current_mesh->indices[] = $mesh_face_indexes[1];
					$this->current_mesh->indices[] = $mesh_face_indexes[2];
				}
				else if (count($mesh_face_indexes) == 4) {
				
					$this->current_mesh->indices[] = $mesh_face_indexes[0];
					$this->current_mesh->indices[] = $mesh_face_indexes[1];
					$this->current_mesh->indices[] = $mesh_face_indexes[2];
					
					$this->current_mesh->indices[] = $mesh_face_indexes[2];
					$this->current_mesh->indices[] = $mesh_face_indexes[3];
					$this->current_mesh->indices[] = $mesh_face_indexes[0];
				}
				else {
				
					if ($this->failure('polygones are not supported')) continue;
				}
				
			}
			else if ($cmd == 'mtllib') {
			
				//
			}
			else if ($cmd == 'usemtl') {
			
				if ($this->failure_test(count($line_components) == 1, 'material name is missing')) continue;
				
				$material_name = $line_components[0];
				
				// TODO: create an unnamed mesh group
				if ($this->failure_test($this->current_group != null, 'no mesh group declared')) continue;
				
				// find a mesh group with the same material:
				$this->current_mesh = null;
				foreach ($this->current_group->meshes as $each_mesh) {
				
					if ($each_mesh->material_name == $material_name) {
					
						$this->current_mesh = $each_mesh;
						break;
					}
				}
				
				if ($this->current_mesh == null) {
				
					$this->current_mesh = new Mesh();
					$this->current_mesh->material_name = $material_name;
					$this->current_group->meshes[] = $this->current_mesh;
				}
			}
			else if ($cmd == 's') {
				
				// not implemted
			}
			else if ($cmd == 'g' || $cmd == 'o') {
			
				// TODO: is 'o' different of 'g' ??
				
				if ($this->failure_test(count($line_components) != 0, 'group name is missing')) continue;
				$group_name = implode(' ', $line_components);

				$this->current_group = new MeshGroup();
				$this->current_group->name = $group_name;
				
				$this->object3d->mesh_groups[] = $this->current_group;
				
				$this->current_mesh = null;					
			}
			else {
				
				$this->failure("unknown command: '$cmd'");
			}
			
		}
		
		$this->current_group = null;
		$this->current_mesh = null;
	}
	
	public function log() {
	
		echo '<PRE>';
		echo "{$this->obj_filename}:</BR>";
		echo '    - '.count($this->obj_vertices).' vertices</BR>';
		echo '    - '.count($this->obj_normals).' normals</BR>';
		echo '    - '.count($this->obj_uvs).' texture coordinates</BR>';
		echo "Object3d: {$this->object3d->name} (".count($this->object3d->mesh_groups)." mesh groups)<BR/>";
		foreach ($this->object3d->mesh_groups as $each_group) {
			
			echo "    - {$each_group->name} (".count($each_group->meshes)." meshes)</BR>";
			foreach ($each_group->meshes as $each_mesh) {
			
				echo "        - {$each_mesh->material_name}<BR/>";
				echo "        - ".(count($each_mesh->indices)/3)." triangles</BR>";
				echo "        - ".(count($each_mesh->vertices)/3)." vertices</BR>";
				echo "        - ".(count($each_mesh->normals)/3)." normals</BR>";
				echo "        - ".(count($each_mesh->uvs)/2)." uvs</BR>";
			}
			
		}
		echo "{$this->stat_vertex_re_use_count} vertex re-use</BR>";
		echo '</PRE>';
	}
	
	private function add_vertex_to_current_mesh($obj_vertex_index, $obj_normal_index, $obj_uv_index) {
	
		$vertex_index_in_mesh = count($this->current_mesh->vertices) / 3;
		
		// if ($this->failure_test($obj_vertex_index != -1, 'vertex is required')) continue; // obvious
		
		// obj are 'one' indexed:
		$obj_vertex_index -= 1;
		if ($obj_normal_index != -1) $obj_normal_index -= 1;
		if ($obj_uv_index != -1) $obj_uv_index -= 1;
		
		if (TRY_TO_RE_USE_VERTICES) {
			
			$map = & $this->current_mesh->map_objindex_meshindex[$obj_vertex_index];
			
			$v_key = $obj_vertex_index.'_'.$obj_normal_index.'_'.$obj_uv_index;
			
			if ( isset($map[$v_key]) )
			{
				$index_in_mesh = $map[$v_key];
				$this->stat_vertex_re_use_count++;
				return $index_in_mesh;
			}
			else {
			
				$map[$v_key] = $vertex_index_in_mesh;;
			}
		}
		
		
		$this->current_mesh->vertices[] = $this->obj_vertices[$obj_vertex_index][0];
		$this->current_mesh->vertices[] = $this->obj_vertices[$obj_vertex_index][1];
		$this->current_mesh->vertices[] = $this->obj_vertices[$obj_vertex_index][2];
		
		if ($obj_normal_index != -1) {
		
			$this->current_mesh->normals[] = $this->obj_normals[$obj_normal_index][0];
			$this->current_mesh->normals[] = $this->obj_normals[$obj_normal_index][1];
			$this->current_mesh->normals[] = $this->obj_normals[$obj_normal_index][2];
		}
		
		if ($obj_uv_index != -1) {
		
			$this->current_mesh->uvs[] = $this->obj_uvs[$obj_uv_index][0];
			$this->current_mesh->uvs[] = $this->obj_uvs[$obj_uv_index][1];	
		}
		
		return $vertex_index_in_mesh;
	}
	
	private function floats_array($line_components, $float_count) {
		
		if ($this->failure_test($float_count <= count($line_components) , 'not enough floats: ')) return false;
		
		$floats = array();
		for ($ii = 0; $ii != $float_count + 1; ++$ii) {
		
			$this->failure_test(settype($line_components[$ii], 'float'), 'not a float');
			$floats[] = $line_components[$ii];
		}
		
		return $floats;
		
	}
	
	private function failure_test($test, $message) {
		
		$failure = $test == false;
		if ($failure) {
			
			$this->failure($message);
		}
		
		return $failure;
	}
	
	private function failure($message) {
	
		echo "WavefrontLoader: Parse error at line {$this->line_number} in file {$this->obj_filename}<BR/>\n$message</BR>\n<PRE>{$this->current_line}</PRE>";
		die();
	}
	
}

function not_empty_string($param) {

	return strlen($param) != 0;
}

?>