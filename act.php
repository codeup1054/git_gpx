<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

//print_r ($_POST);

$adata = "{data:'test'}";

$data = (isset ($_POST["data"]))? $_POST["data"] : json_decode($adata) ;

print "\n<br />Check data=".isJson($data )." data". print_r(json_decode($data),1) ;


if( isJson($data) )
{
    $myFile = "data/gpx.json";
    $fh = fopen($myFile, 'w') or die("can't open file");
    $stringData = $data;
    fwrite($fh, $stringData);
    fclose($fh);
    
    print ( "\n<br />filesize=".filesize ($myFile));
}
else
{
   print("\nserver not response"); 
} 
     

function isJson($string) {
   
 json_decode($string);
 
 print ("<br />isJson=, "
    .json_decode($string)
    ." json_last_error= "
    .json_last_error()
    ." <br />");
 
 return (json_last_error() == JSON_ERROR_NONE);
}

?>