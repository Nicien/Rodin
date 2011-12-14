<?php
error_reporting(E_ALL | E_STRICT);

define('TEMPLATES_DIR', './templates');
define('WWW', '../www');
define('OBJ_DATABASE_DIRECTORY', WWW.'/obj_database');
define('JS_DATABASE_DIRECTORY', WWW.'/js_database');

require_once('utils.php');

function autoload_fn($classname) {

	/*
    $possibilities = array( 
        APPLICATION_PATH.'beans'.DIRECTORY_SEPARATOR.$className.'.php', 
        APPLICATION_PATH.'controllers'.DIRECTORY_SEPARATOR.$className.'.php', 
        $className.'.php' 
    );
	
	// TODO: mettre en cache le contenu des répertoires (scandir...)
    foreach ($possibilities as $file) { 
        if (file_exists($file)) { 
            require_once($file); 
            return true; 
        } 
    } 
	*/
	
	$source_filepath = "$classname.php";
	if (file_exists($source_filepath)) {
        require_once($source_filepath); 
        return true; 
    } 
	
    return false; 
}

spl_autoload_register('autoload_fn');

function render_json($data) {

	// JSON_FORCE_OBJECT is available since php 5.3
	if (empty($data)) $data = (object) null;
	
    header('Content-Type: text/javascript; charset=utf8');
	
	echo json_encode($data);	
}

function render_html($page_name) {

	readfile(TEMPLATES_DIR.'/'.$page_name.'.html');
}

function main() {

	$parameters = process_query_uri();
	if (empty($parameters) || empty($parameters[0])) {
	
		render_html('main');
	
	} else if ($parameters[0] == 'available_objects') {
		
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
			// TODO: activer la compression au niveau du server apache
			ini_set("zlib.output_compression", "On");
			readfile($obj_filepath);
		}
		
		$js_error_var = ($ajax_error === false) ? 'false' : "'".addslashes($ajax_error)."'";
		echo "\nvar ajax_error = $js_error_var;";
	}
	else if ($parameters[0] == 'phpinfo') {
	
		phpinfo();
	}
	else {
		
		header("HTTP/1.0 404 Not Found");
		// or FastCGI you must use the following for a 404 response:
		header("Status: 404 Not Found");
		render_html('page_404');
	}
	
}
main();

?>