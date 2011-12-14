<?php

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

?>