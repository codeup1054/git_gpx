<?php

print_r ($_GET);

 
$z = (isset($_GET['z']))?$_GET['z']:'10';
$x = (isset($_GET['x']))?$_GET['x']:'538';
$y = (isset($_GET['y']))? $_GET['y'] :'538';

echo "<img src = http://msp.opendatahub.ru/gpx/strava.php?z=$z&x=$x&y=$y />";
?>