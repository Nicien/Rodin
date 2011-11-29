
(function() {

    
    Rodin.Object3dLoader = function(shaders) {
    
		this.shaders = shaders;
		this.current_ajax_request = null;
		this.loaded = null;
    }
    
    
    Rodin.Object3dLoader.prototype = {
    
        load_object3d: function(node_3d, object_name) {
            
			if (this.current_ajax_request != null) {
			
				this.current_ajax_request.abort();
				this.current_ajax_request = null;
			}
			
			var loader = this;
			this.current_ajax_request = $.ajax({
				//url: '/obj_name/ahstray2',
				//url: '/obj_name/toyplane',
				//url: '/obj_name/dchair_obj',
				url: '/obj_name/'+object_name,
				context: document.body,
				cache  : false,
				success: function(data, textStatus, jqXHR) { loader._on_mesh_download_success(node_3d, data, textStatus, jqXHR); },
				error  : function(jqXHR, textStatus, errorThrown) { loader._on_mesh_download_error(jqXHR, textStatus, errorThrown); }
			});
			
        },
		
		_on_mesh_download_success: function(node_3d, data, textStatus, jqXHR) {
		
			if (ajax_error !== false) {
			
				$( "div.log" ).text("server return error: "+ajax_error);
				return;
			}
			
			//console.log(data); //data returned
			//console.log(textStatus); //success
			
			var group_count = object3d.mesh_groups.length;
			for (var group_index=0; group_index != group_count; ++group_index) {
				
				var each_group = object3d.mesh_groups[group_index];
				
				var mesh_count = each_group.meshes.length;
				for (var mesh_index = 0; mesh_index != mesh_count; ++mesh_index) {
				
					var mesh = each_group.meshes[mesh_index];
					
					// convert classic array to webgl array:
					var indices = new Uint16Array(mesh.indices);
					var vertices = new Float32Array(mesh.vertices);
					var normals = new Float32Array(mesh.normals);
					var uvs = new Float32Array(mesh.uvs);
					
					mesh = null; // javascript garbage collector can release the mesh...
					
					// scale object
					var c = vertices.length;
					for (var ii = 0; ii != c; ++ii) {
					
						vertices[ii] /= 3.0;
					}
					
					// generate normals if needed:
					if (normals.length == 0) {
					
						// generate normals:
						normals = new Float32Array(vertices.length);
						
						var face_count = indices.length;
						// ASSERT( (face_count % 3) == 0 );
						face_count -= face_count % 3;
						
						for (var face_index = 0; face_index != face_count; face_index += 3) {
						
							vertices[face_index+0];
						}
						
						//Vector3 normal = plane_normal(mesh.vertices[*(each_face+0)], mesh.vertices[*(each_face+1)], mesh.vertices[*(each_face+2)]);
						//mesh.normals[*(each_face+0)] = normal;
						//mesh.normals[*(each_face+1)] = normal;
						//mesh.normals[*(each_face+2)] = normal;
						
						// Vector3 normal = (pt1 - pt0).crossProduct(pt2 - pt0);
						// normal.normalize();
						
						// cross product:
						//Y * p.Z - Z * p.Y, Z * p.X - X * p.Z, X * p.Y - Y * p.X
					}

					/*
					console.log('triangles length = '+indices.length/3);
					console.log('vertices length = '+vertices.length/3);
					console.log('normals normals = '+normals.length/3);
					console.log('textureCoords length = '+uvs.length/2);
					*/

					
					// build a mesh:
					var content3d = new Rodin.Content3d();
					content3d.mesh = new Rodin.Mesh3d();
					
					content3d.mesh.indices = new Rodin.WebGlIndices(indices);
					content3d.mesh.vertices = new Rodin.WebGlVertices(vertices);
					content3d.mesh.normals = new Rodin.WebGlVertices(normals);
					content3d.mesh.uvs = new Rodin.WebGlVertices(uvs);
					
					content3d.shader = this.shaders.soft_directional_lighting;
					content3d.shader_parameters = { r:1.0, g:0.2, b:0.2, a:1.0 };
					
					node_3d.add_content(content3d);
				}
				
			}
			
			if (this.loaded != null) {
			
				this.loaded();
			}
			
		},
		
		_on_mesh_download_error: function(jqXHR, textStatus, errorThrown) {
		
			$( "div.log" ).text("ajax error: "+textStatus+' '+errorThrown);
			
			if (jqXHR == this.current_ajax_request) {
			
				this.current_ajax_request = null;
			}
		}
        
    }
    
})()