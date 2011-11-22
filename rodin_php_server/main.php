<?php
error_reporting(E_ALL | E_STRICT);

define('WWW', '../www');
define('OBJ_DATABASE_DIRECTORY', WWW.'/obj_database');
define('JS_DATABASE_DIRECTORY', WWW.'/js_database');

require_once("ObjLoader.php");

function dump($var) {

	echo '<PRE>';
	var_dump($var);
	echo '</PRE>';
}

function message($msg) {

	echo '<P>'.$msg.'</P>';
}

function process_query_uri() {

	$uri = explode('/', $_SERVER['REQUEST_URI']);
	$parameters = array();
	foreach($uri as $uri_component) {
	
		if (! empty($uri_component)) {
		
			$parameters[] = $uri_component;
			
			//explode("?&", $uri_component);
			/*
			foreach(explode("&", $uri_component) as $pair) {
			
				list($k, $v) = array_map("urldecode", explode("=", $pair));
				
				//parse_str($uri_component, $param);
			}
			*/

		}
		
	}
	
	return $parameters;
}

/*
function is_parameter_true($param_name) {

	return empty($_GET[$param_name]) == false && $_GET[$param_name];
}

function get_parameter($param_name,  &$param_out) {

	$param_exists = empty($_GET[$param_name]) == false;
	if ($param_exists) {
		
		$param_out = $_GET[$param_name];
	}
	return $param_exists;
}

if (is_parameter_true('obj_as_json')) {

}

// localhost:8080/?obj_name=ahstray
if (get_parameter('obj_name', $obj_name)) {

}
*/

function obj_as_json() {

	$obj_loader = new ObjLoader();
	//$obj_loader->load(OBJ_DATABASE_DIRECTORY.'/dchair_obj.obj');
	$obj_loader->load(OBJ_DATABASE_DIRECTORY.'/ahstray.obj');
	
	$obj_loader->unpackForGL();
	$obj_loader->writeUnpackedToJson(JS_DATABASE_DIRECTORY.'/ahstray.js');
	
	//message(count($obj_loader->m_verts).' vertices');
	//message(count($obj_loader->m_indices).' indices');
	
	message('Done.');
}

function main() {

	$parameters = process_query_uri();
	if (empty($parameters) == false) {
	
	
		if ($parameters[0] == 'obj_as_json') {
		
			obj_as_json();
		}
		else if ($parameters[0] == 'obj_name' && empty($parameters[1]) == false) {
		
			$obj_name = $parameters[1];
			//dump($obj_name);
		
			header("Content-Type: text/javascript");
			//header("Cache-Control: public");
			header("Cache-Control: no-cache");
			
			$obj_filepath = JS_DATABASE_DIRECTORY."/$obj_name.js";
			
			$ajax_error = false;
			
			if (! file_exists($obj_filepath)) {
			
				$ajax_error = "unknown object $obj_name";
			}
			else {
				ini_set("zlib.output_compression", "On");
				readfile($obj_filepath);
			}
			
			$js_error_var = ($ajax_error === false) ? 'false' : "'".addslashes($ajax_error)."'";
			echo "\nvar ajax_error = $js_error_var;";
			die();
		}
	}
	
}
main();

?>
<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Rodin testing</title>
    
    <link rel="stylesheet" type="text/css" href="rodin_test.css"/>
    <script type="text/javascript" src="./rodin_js/jquery-1.6.4.min.js"></script>
    <!-- <script type="text/javascript" src="./rodin_js/poly2tri.js"></script> -->
    
    <script type="text/javascript" src="./rodin_js/Rodin.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_Vector_And_Matrix.js"></script>
    
    <script type="text/javascript" src="./rodin_js/Rodin_WebGlRenderer.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_WebGlShader.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_WebGlBuffer.js"></script>
	
    <script type="text/javascript" src="./rodin_js/Rodin_Camera3d.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_Scene3d.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_Node3d.js"></script>
    
    <script type="text/javascript" src="./rodin_js/Rodin_Camera2d.js"></script>
    
    <script type="text/javascript" src="./rodin_js/Rodin_ToolManager.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_TraceRectangleTool.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_TraceLineTool.js"></script>
    
    <script type="text/javascript" src="./rodin_js/Rodin_TestApp.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_coding.js"></script>
	
    <script type="text/javascript" src="./rodin_js/test_scene/Rodin_TestSceneMaterials.js"></script>
    <script type="text/javascript" src="./rodin_js/test_scene/Rodin_GridGenerator.js"></script>
	
	<script id="vertex_shader_projection" type="x-shader/x-vertex">
		#ifdef GL_ES
		precision highp float;
		#endif

		uniform mat4 u_transform;

        attribute vec3 a_position;
		  
        void main(void) {
		
            gl_Position = u_transform * vec4(a_position, 1.0);
        }
    </script>
	    
    <script id="frament_shader_plain_color" type="x-shader/x-fragment">  
		#ifdef GL_ES
		precision highp float;
		#endif
		
		uniform vec3 u_plain_color;
		
        void main(void) {
		
            gl_FragColor = vec4(u_plain_color, 1.0);  
        }
    </script>
	
	
	<script id="vertex_shader_vertex_normal" type="x-shader/x-vertex">
		#ifdef GL_ES
		precision highp float;
		#endif
		
		uniform mat4 u_vertex_transform;
		uniform mat3 u_normal_transform;

		attribute vec3 a_position;
		attribute vec3 a_normal;
		//attribute vec2 a_texcoord;

		//varying vec2 v_texcoord;
		varying vec3 v_normal;
		

		void main(void) {
			
			//vec3 v_normal = u_normal_transform * normalize(a_normal);
			v_normal = u_normal_transform * a_normal;
			gl_Position = u_vertex_transform * vec4(a_position, 1.0);
		}
    </script>
	
    <script id="frament_shader_soft_directional_lighting" type="x-shader/x-fragment"> 
		#ifdef GL_ES
		precision mediump float;
		#endif

		uniform vec3 u_plain_color;
		
		//uniform sampler2D u_diffuse_sampler;

		varying vec2 v_texcoord;
		varying vec3 v_normal;

		void main(void) {
			// Simple, soft directional lighting.
			//vec3 fetch = texture2D(u_diffuse_sampler, v_texcoord).rgb;
			vec3 normal = normalize(v_normal);
			vec3 light_vec = normalize(vec3(-0.25, -0.25, 1.0));
			float light = 0.5 + 0.5*dot(normal, light_vec);
			gl_FragData[0] = vec4(u_plain_color*light, 1.0);
		}
    </script>	

</head>

<body>
    <TABLE class="main_table">
    <TR>
        <TH colspan="2">
            <H3>Rodin test</H3>
        </TH>
    </TR>
    <TR>
        <TD class="canvas_td">
            <canvas id="floorplan" class="floorplan">
                <span>&lt;canvas&gt; markup not supported, please use a modern web browser.</span>
            </canvas>
        </TD>
        <TD>
            <canvas id="viewport" class="viewport">
                <span>&lt;canvas&gt; markup not supported, please use a modern web browser.</span>
            </canvas>
        </TD>
    </TR>
    <TR>
        <TD colspan="2">
            <TABLE class="toolbox_table">
            
                <caption id="mouse_position" style="caption-side:bottom;height:20px">0, 0</caption>
                <tbody>
                <TR>
                    <TD> <a href="" id="trace_segment_button" class="trace_button">Trace segment</a>
                    <TD> <a href="" id="trace_line_button" class="trace_button">Trace line</a>
                    <TD> <a href="" id="trace_rectangle_button" class="trace_button">Trace rectangle</a>
					
					<TD> <a href="" id="front_camera" class="trace_button">Front camera</a>
                    <TD ><a href="" id="orbit_camera" class="trace_button">Orbit camera</a>
                <TR>
                    <TD colspan="3"><a href="#" id="stop_current_tool_button" class="trace_button">Stop</a>
					
                    <TD colspan="2"><a href="" id="animate_camera" class="trace_button">Animate camera</a>
					
            </TABLE>
			
        </TD>
		
    </TR>
    </TABLE>
    
	<div class="log"></div>
	
    <script>
        $(document).ready(function(){
        
            Rodin.app = new Rodin.TestApp();
			
			$( "div.log" ).ajaxError(function(e, jqxhr, settings, exception) {
			  if (settings.dataType=='script') {
				$(this).text( "Triggered ajaxError handler."+e );
			  }
			});
			
			var on_mesh_download_success = function(data, textStatus, jqXHR) {
			
				if (ajax_error !== false) {
				
					$( "div.log" ).text("server return error: "+ajax_error);
					return;
				}
				
				//console.log(data); //data returned
				//console.log(textStatus); //success
				
				console.log('vertices length = '+vertices.length);
				console.log('normals normals = '+normals.length);
				console.log('textureCoords length = '+textureCoords.length);
				
				// build a mesh:
				var content3d = new Rodin.Content3d();
				content3d.mesh = new Rodin.Mesh3d();
				//content3d.mesh.vertices_type = Rodin.gl.TRIANGLE_STRIP;
				
				var float32_array_vertices = new Float32Array(vertices);
				var c = vertices.length;
				for (var ii = 0; ii != c; ++ii) {
				
					float32_array_vertices[ii] /= 3.0;
				}
				
				content3d.mesh.vertices = new Rodin.WebGlVertices(float32_array_vertices);
				content3d.mesh.normals = new Rodin.WebGlVertices(new Float32Array(normals));
				content3d.mesh.uv = new Rodin.WebGlVertices(new Float32Array(textureCoords));
				
				content3d.shader = Rodin.app.shaders.soft_directional_lighting;
				content3d.shader_parameters = { r:0.5, g:0.2, b:0.3, a:1.0 };
				
				Rodin.app.scene3d.root.add_content(content3d);
				Rodin.app.refresh_viewport();
			}
			
			var on_mesh_download_error = function(jqXHR, textStatus, errorThrown) {
			
				$( "div.log" ).text("ajax error: "+textStatus+' '+errorThrown);
			}
			
			$.ajax({
				url: '/obj_name/ahstray',
				context: document.body,
				cache  : true,
				success: on_mesh_download_success,
				error  : on_mesh_download_error
			});
			
        });
    </script>
</body>

</html>