<!--

2019.08.29 сделать сегменты для маршрута. 
 
-->

<html>
<head>                                                               
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
    <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
    <link href="gpx.css" rel="stylesheet" type="text/css" />
<!--    <script type="text/javascript" src="js/jquery.js"></script> -->

    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  
    <script type="text/javascript" src="js/google_sheets_api.js"></script>
    <script src="js/gpx.js"></script> 
<!-- chart and elevation -->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="https://www.google.com/uds/?file=visualization&amp;v=1&amp;packages=columnchart" type="text/javascript"></script> 

</head>

<body>
<?php

header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$content  = array();

function trm($st)
{
    return preg_replace( "/\r|\n|&nbsp| /", "", trim($st ));
}


function getStations()
{

$dom = new DOMDocument();  

$f_html = file_get_contents('data/stations.xml', true);
$f_html = mb_convert_encoding($f_html , 'HTML-ENTITIES', "UTF-8");

$html = $dom->loadHTML($f_html);  
   
$dom->preserveWhiteSpace = false; //discard white space   
$tables = $dom->getElementsByTagName('table');   //the table by its tag name   
$rows = $tables->item(0)->getElementsByTagName('tr');     //get all rows from the table   
$cols = $rows->item(0)->getElementsByTagName('th');   // get each column by tag name   

$row_headers = NULL;
foreach ($cols as $node) {
    $row_headers[] = trm($node->nodeValue);  //print $node->nodeValue."\n";
}   

$table = array();
$rows = $tables->item(0)->getElementsByTagName('tr');   //get all rows from the table   
foreach ($rows as $row)   
{   
   // get each column by tag name  
    $cols = $row->getElementsByTagName('td');   
    $row = array();
    $i=0;
    foreach ($cols as $node) {
        //print $node->nodeValue."\n";   
        if($row_headers==NULL)
            $row[] = $node->nodeValue;
        else
            $row[$row_headers[$i]] = trm($node->nodeValue) ;
        $i++;
    }   
    $table[] = $row;
}   


$fp = fopen('stations.csv', 'w');

foreach ($table as $rows) {
//    print_r ($rows);
//    print ($rows['Станция']);
    
    fputcsv($fp, $rows);
}

fclose($fp);
return $table;
}
    

//$st = getStations();




$f_xml = file_get_contents('data/Markers_2019-06-11.gpx', true);

$xmlstr = <<<XML
$f_xml
XML;


$gpx = new SimpleXMLElement($xmlstr);

//print "<pre>".print_r ($gpx->wpt,1)."</pre>"; 

//print_r ($gpx);
$cols = $rows = $markers = array();

$cnt=0;

foreach ($gpx->wpt as $k=>$v)
{
    unset($cols);
    
    $lat1 = floatval($v->attributes()->lat);
    $lon1 = floatval($v->attributes()->lon);

    $lat2 = 55.6442983;
    $lon2 = 37.4959946;

    $dist = round(distance($lat1, $lon1, $lat2, $lon2, "K"),1);
    
    $cnt++;

    $cols[] = $cnt;

    $cols[] = $v->name;
    $cols[] = $v->extensions->color;

    $cols[] = $lat1;
    $cols[] = $lon1;
    
     
    $markers[] = array(
            'lat' => $lat1, 
            'lng' =>$lon1, 
            'name' => (string) $v->name, 
            'time' => (string) $v->time, 
            'extensions' => $v->extensions
            );  
    
    $cols[] = $dist;
    $rows[] = "<tr class = 'row row$cnt' idx= '".($cnt-1)."' ><td>".implode("</td><td>",$cols)."</td></tr>";
}

//print_r ($markers);
//echo $f_xml;

function distance($lat1, $lon1, $lat2, $lon2, $unit) {
  if (($lat1 == $lat2) && ($lon1 == $lon2)) {
    return 0;
  }
  else {
    $theta = $lon1 - $lon2;
    $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    $miles = $dist * 60 * 1.1515;
    $unit = strtoupper($unit);

    if ($unit == "K") {
      return ($miles * 1.609344);
    } else if ($unit == "N") {
      return ($miles * 0.8684);
    } else {
      return $miles;
    }
  }
}

?>
 



<div id="container">

    <div id="left_panel">
           <div id="datasetpanel">
               <div class="datasetcheckbox"></div>
           </div>
           <div class="datasets" ></div>
           <div id="current"></div>
           <div id="result"></div>
    </div>
    <div id="right_panel">
        <div class="buttons_panel">
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('write')">В Google</button>
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('save_json')">В JSON</button>
            <button id="button  signout-button" class="ui-button ui-widget ui-corner-all"  onclick="fitMarkers()">Все</button>
            <button id="button  signout-button" class="ui-button ui-widget ui-corner-all"  onclick="drawPath()">Профиль</button>
            <button id="button  signin-button" class="sign"  onclick="handleSignInClick()">Sign in</button>
            <button class='sign' id="button signout-button" onclick="handleSignOutClick()">Sign out</button>
        </div>
        <div id="map"></div>  
    </div>
    <div class="clear"></div>
</div>

<div id="elevation-chart" ></div>

<div id="floating-panel">
      <input id='toggleHM' type="button" value="Hide HM" onclick="toggle();"></input>
      <div id="slider_transperency"></div>
</div>


<style>

 
/*style the arrow div div div div div div div div */ 
.gm-style .gm-style-iw{
   font-family: 'Open Sans Condensed', sans-serif;
   top:0px;
   font-size: 10px;
   font-weight: 400;
   padding: 0px;
   background-color: rgba(255,255,255,1) ;
   color: black;
   padding:3px;
   margin: 0px;
   border: 1px solid rgba(72, 181, 233, 0.6) !important;
   border-radius: 5px 5px 5px 5px; /* In accordance with the rounding of the default infowindow corners. */
}


</style>


<script>

// массив маркеров из php
 //var markersArray = <?php echo json_encode($markers); ?>;
//   console.log("@@", markersArray);

</script>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M&callback=initMap">
    </script>
    
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>

    
</body>
</html>