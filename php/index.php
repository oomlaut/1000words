<?php
	require_once("init.php");
	require_once("lib/class.LanguageBuilder.php");
	
	$builder = new LanguageBuilder("espanol");

	//$builder->exportToScreen();
	$builder->exportToFile(WWW_PATH . "languages/espanol.json");