<?php

	//define constants
	define("APP_PATH", $_SERVER["DOCUMENT_ROOT"]);
	define("WWW_PATH", APP_PATH . "/../webroot/"); 
	
	//define("WWW_PATH", implode($parts, "/"));
	//update include path
	set_include_path(get_include_path() . PATH_SEPARATOR . APP_PATH);