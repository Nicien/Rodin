<?php
error_reporting(E_ALL | E_STRICT);

define('WWW', '../www');
define('OBJ_DATABASE_DIRECTORY', WWW.'/obj_database');
define('JS_DATABASE_DIRECTORY', WWW.'/js_database');

require_once('WavefrontObjLoader.php');

function dump($var) {

	echo '<PRE>';
	var_dump($var);
	echo '</PRE>';
}

function message($msg) {

	echo '<P>'.$msg.'</P>';
}

function error($msg) {

	echo '<P>ERROR: '.$msg.'</P>';
	die();
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

	// remove parameter part:
	if (count($parameters) != 0) {
	
		$last_index = count($parameters) - 1;
		$last = $parameters[$last_index];
		
		$uri_param_index = strpos($last, '?');
		if ($uri_param_index !== false) {
		
			$parameters[$last_index] = substr($last, 0, $uri_param_index);
		}
		
	}
	
	return $parameters;
}

function render_json($data) {

	// JSON_FORCE_OBJECT is available since php 5.3
	if (empty($data)) $data = (object) null;
	
    header('Content-Type: text/javascript; charset=utf8');
	
	echo json_encode($data);	
	die();
}

function main() {

	$parameters = process_query_uri();
	if (empty($parameters) == false) {
	
	
		if ($parameters[0] == 'available_objects') {
			
			$js_object_listing = array();
			
			$js_dir_content = scandir(JS_DATABASE_DIRECTORY);
			foreach ($js_dir_content as $each_js_object) {
			
				if (empty($each_js_object) || $each_js_object[0] == '.') continue;
				$path_infos = pathinfo($each_js_object);
				if ($path_infos['extension'] == 'js') {
				
					$js_object_listing[] = $path_infos['filename'];
				}
			}
			
			render_json($js_object_listing);
		}
		else if ($parameters[0] == 'process_obj') {
		
			// test: http://localhost:8080/process_obj/ahstray
			if (empty($parameters[1])) error("error: missing obj parameter");
			
			$obj_name = $parameters[1];
			$obj_filepath = OBJ_DATABASE_DIRECTORY."/$obj_name.obj";
			
			if (! file_exists($obj_filepath)) {
			
				error("error: can't find $obj_filepath");
			}
			
			$loader = new WavefrontObjLoader();
			$loader->parse($obj_filepath, $obj_name);
			$loader->log();
			$loader->save_js(JS_DATABASE_DIRECTORY."/$obj_name.js");
			
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
    	
    <script type="text/javascript" src="./rodin_js/test_scene/Rodin_TestSceneMaterials.js"></script>
    <script type="text/javascript" src="./rodin_js/test_scene/Rodin_GridGenerator.js"></script>
	
    <script type="text/javascript" src="./rodin_js/Rodin_TestApp.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_Object3dLoader.js"></script>
	
    <script type="text/javascript" src="./rodin_js/Rodin_coding.js"></script>
    <script type="text/javascript" src="./rodin_js/Rodin_MeshManipulator.js"></script>	
	
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
	
    <ul id="available_objects_li"></ul>
	
	<div class="log"></div>
	
    <script>
        $(document).ready(function(){
        
            Rodin.app = new Rodin.TestApp();
			
			$( "div.log" ).ajaxError(function(e, jqxhr, settings, exception) {
			  if (settings.dataType=='script') {
				$(this).text( "Triggered ajaxError handler."+e );
			  }
			});
			
        });
    </script>
</body>

</html>