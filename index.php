<html>
<!-- 2019.08.29 сделать сегменты для маршрута. -->
<head>                                                               
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
    <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
    <link href="/gpx/gpx.css" rel="stylesheet" type="text/css" />
    
<!--    <script type="text/javascript" src="js/jquery.js"></script> -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">


    
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="/gpx/js/cookie/jquery.cookie.js"></script>
    <script src="/gpx/js/gpx.js"></script> 
    <script type="text/javascript" src="/gpx/js/google_sheets_api.js"></script>


<!--   bootstrap  -->    
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

<!--   ->    
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<!--   bootstrap  -->


<!-- chart and elevation -->

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    
    <script>
      google.charts.load('current', {packages: ['columnchart']});
      google.charts.load('current', {packages: ['corechart']});
//      google.charts.setOnLoadCallback(drawChart);
    </script>
    
<!--    <script src="https://www.google.com/uds/?file=visualization&amp;v=1&amp;packages=columnchart" type="text/javascript"></script> --> 

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
    return preg_replace( "/\r|\n|&nbsp| /", "", trim($st));
}


function getStations()
{

$dom = new DOMDocument();  

$f_html = file_get_contents('../data/stations.xml', true);
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
           <input type='checkbox'/>
    <div id="left_panel">
           <div>
           <input id='newgpx' value="Новый набор"/> 
                <button class="ui-button ui-widget ui-corner-all small" onclick="makeApiCall('newGpxSet')">Новый набор</button>
           </div> 
           <div id="datasetpanel">
               <div class="datasetcheckbox"></div>
           </div>
           <strong>Наборы точек</strong><br />
           <div id="datasets" ></div>
           <div id="current"></div>
           <div id="result"></div>
    </div>
    <div id="right_panel">
        <div class="buttons_panel">
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('get_gpx_DB')">Из DB</button>
            <button class="ui-button ui-widget ui-corner-all btn btn-success" onclick="makeApiCall('save_sql')">В DB</button>
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('read_google')">Из Google</button>
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('save_google')">В Google</button>
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('read_json')">Из JSON</button>
            <button class="ui-button ui-widget ui-corner-all" onclick="makeApiCall('save_json')">В JSON</button>
            <button id="button  signout-button" class="ui-button ui-widget ui-corner-all"  onclick="fitMarkers()">Все</button>
            <button id="zoom_info" class="ui-button ui-widget ui-corner-all"  onclick="">11</button>
                <button id="button  signin-button" class="sign"  onclick="handleSignInClick()">Sign in</button>
                <button class='sign' id="button signout-button" onclick="handleSignOutClick()">Sign out</button>
                <a href="http://msp.opendatahub.ru/gpx/du.php">Лог</a>
                <a target="_blank" href="https://my.apify.com/actors/9rJZagTpspnLsgeX6#/source">Apify</a>
                
            <fieldset id='onmapOnOff'>
                <legend >На карте:</legend>
                <!-- Заполняется на основе global settings --> 
           </fieldset>
        </div>

        <div id="map"></div>  
    </div>
    <div class="clear"></div>
</div>

<div id="floating-panel">
<!--      <input id='toggleHM' type="button" value="Hide HM" onclick="toggle();"></input> -->
      <div id="slider_transperency"></div>
</div>


<div id="elevation-chart-div" class="ui-widget-content" >
    <div id="elevation-chart"></div>
</div>


<script>
  $( function() {
    $( "#elevation-chart-div" ).draggable();
    $( "#elevation-chart-div" ).resizable(
     {
     resize1 : function(event,ui) { drawPath(); },
     stop : function(event,ui) { drawPath(); }
     }
    );
    
  } );
  </script>


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

/*
// массив маркеров из php
// var markersArray = <?php echo json_encode($markers); ?>;
// console.log("@@", markersArray);
*/

</script>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M&callback=initMap">
    </script>
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){}; handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>

<div id="debug" class="hide"><button onclick='$("#debug").addClass("hide");'>Закрыть</button></div>
    
</body>
</html>