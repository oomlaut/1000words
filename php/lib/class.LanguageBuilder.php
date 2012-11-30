<?php

/**
 * @author	Paul Gueller @oomlaut
 * @version	0.9.0
 * @since	2012-11-20
 */

class LanguageBuilder
{
	private $log = "LauguageBuilder Log:\n\n";
	private $raw = null;
	private $json = array();
	private $path = "src/{1}.html";
	private $regexPatterns = array();

	/**
	 * Object Constructor
	 *
	 * @see		http://www.php.net/manual/en/language.oop5.decon.php#object.construct
	 * @param	lang	currently accepts only "espanol"
	 * @return	void
	 */
	public function __construct(
		$lang = false
	)
	{
		$path = str_replace("{1}", $lang, $this->path);
		if($lang && $this->store($path)) {
			switch($lang){
				case "espanol":
					$this->parseEspanol();
					break;
				default:
					$this->log .= "__construct::switch - Unrecognized language specified.\n";
			}
		} else {
			$this->log .= "__construct::else - Error with `$lang`.\n";
		}

	}

	/**
	 * Use the echo (__toString magic method) to output the object log
	 * @see http://www.php.net/manual/en/language.oop5.magic.php#object.tostring
	 */
	public function __toString(){
		$this->log .= "__toString - displaying log.\n";
		return $this->log;
	}

	/**
	 * store method
	 * @param $filename	string path to file containing language data to be opened and stored
	 * @return boolean
	 */
	private function store($filename){
		if(!file_exists($filename)){
			$this->log .= "store::else - File `$filename` does not exist.\n";
			return false;
		}
		$this->raw = file_get_contents($filename);
		$this->log .= "store - File `$filename` data stored successfully.\n";
		return true;
	}

	/**
	 * Use the exportToScreen method to display the contents of the data array as mime-type:application/json
	 * @param void
	 * @return void
	 */
	public function exportToScreen(){
		header("Content-type:application/json");
		echo json_encode($this->json);
		exit();
	}

	/**
	 * Use the exportToFile method to store the json contents to a specified file
	 * @see http://us3.php.net/manual/en/ref.filesystem.php
	 * @param filename	filesystem path to reference file
	 * @return boolean
	 */
	public function exportToFile($filename){
		header("Content-type:text/plain");
		if(!file_exists($filename)){
			$this->log .= "exportToFile:: else - JSON export failure: file `$filename` does not exist\n";
			echo $this;
			return false;
		}
		$contents = json_encode($this->json);
		$handle = fopen($filename, 'w');
		fwrite($handle, $contents);
		fclose($handle);
		$this->log .= "exportToFile:: if - JSON export `$filename` success.\n";
		echo $this;
		return true;
	}
	
	/**
	 * Deprecated: Formerly used to return specific subsets of a string. Consider using preg_match instead
	 * @param haystack
	 * @param needle_open
	 * @param needle_close
	 * @return string
	 */
	private function string_dissect($haystack, $needle_open, $needle_close){
		$string_start = strpos($haystack, $needle_open) + strlen($needle_open);
		$string_end = strpos($haystack, $needle_close, $string_start);
		return substr($haystack,  $string_start, $string_end - $string_start);
	}

	/**
	 * 
	 * @param void
	 * @return integer
	 */
	private function parseEspanol(){
		$rgx = array(
			"wild" => ".*?",
			"link" => '((http|https)(:\\/{2}[\\w]+)([\\/|\\.]?)(?:[^\\s"]*))',
			"string" => "([a-zA-Z0-9_ \\/&#;,-]*)"
		);
		$pattern = '/\A\\<a href="' . $rgx["link"] . '"\\>' . $rgx["string"] . '\\<\\/a\\>( )*' . $rgx["string"] . '\Z/is';
		$lines = explode('<br>', $this->raw);
		$this->log .= count($lines) . " lines generated from source.\n";
		$c = 0;
		$m = 0;
		foreach ($lines as $line){
			$line = trim($line);
			$matches = array();
			preg_match($pattern, $line, $matches);
			if(count($matches) > 0){
				array_push($this->json, array(
					"untranslated"	=> trim($matches[5]),
					"translated"	=> trim($matches[7]),
					"pronunciation"	=> trim($matches[1])
					)
				);
				$m++;
			} else {
				$this->log .= "Parse issue with line $c: `$line` \n";
			}
			$c++;
		}
		$this->log .= "$m Matches found for pattern: `$pattern`\n";
		return count($this->json);
	}
}