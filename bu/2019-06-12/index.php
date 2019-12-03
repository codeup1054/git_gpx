
<head>                                                               
<script type="text/javascript" src="js/jquery.js"></script>
</head>

<style>
.tab {border-collapse:collapse;}
.tab td {border:1px solid gray; font-size: 11px;}

#map_container {position: fixed;
               float:left;  
               display:block;  
               top:0px; 
               left:0px;
               width:70%;
               height:100%;
               border:2px solid green;
               }
#map {width:100%; height:100%;}               
               
</style>



<body>
<?php

$f_xml = file_get_contents('gpx/Markers_2019-06-11.gpx', true);

$s_xml ="<?xml version='1.0' standalone='yes'?>
<movies>
 <movie>
  <title>PHP: Появление Парсера</title>
  <characters>
   <character>
    <name>Ms. Coder</name>
    <actor>Onlivia Actora</actor>
   </character>
   <character>
    <name>Mr. Coder</name>
    <actor>El Act&#211;r</actor>
   </character>
  </characters>
  <plot>
   Таким образом, это язык. Это все равно язык программирования. Или
   это скриптовый язык? Все раскрывается в этом документальном фильме,
   похожем на фильм ужасов.
  </plot>
  <great-lines>
   <line>PHP решает все мои проблемы в вебе</line>
  </great-lines>
  <rating type=\"thumbs\">7</rating>
  <rating type=\"stars\">5</rating>
 </movie>
</movies>";

$xmlstr = <<<XML
$f_xml
XML;


$gpx = new SimpleXMLElement($xmlstr);

//print "<pre>".print_r ($gpx->wpt,1)."</pre>"; 

//print_r ($gpx);
$cols = $rows = $markers = array();

$cnt=1;

foreach ($gpx->wpt as $k=>$v)
{
    unset($cols);
    
    $lat1 = floatval($v->attributes()->lat);
    $lon1 = floatval($v->attributes()->lon);

    $lat2 = 55.6442983;
    $lon2 = 37.4959946;

    $dist = round(distance($lat1, $lon1, $lat2, $lon2, "K"),1);

    $cols[] = $cnt++;


    $cols[] = $v->name." [$dist км]";
    $cols[] = $v->extensions->color;

    $cols[] = $lat1;
    $cols[] = $lon1;
    
     
    $markers[] = array(
            'pos' => array('lat'=>$lat1, 'lon'=>$lon1), 
            'name' => $v->name[0], 
            'color' => $v->extensions->color
            );  
    
    $cols[] = $dist;
    $rows[] = "<tr><td>".implode("</td><td>",$cols)."</td></tr>";
}

print("<div style='position: absolute;
                   top:0; 
                   right:0px;
                   width:400px;
                   border: 2px solid red;
                   '><table class=tab style = 'border:1px solid gray;'>".implode("",$rows)."</table></div>");


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


 

<div id="map_container"><div id="map"></div></div>

    <script>
     
     // Calculat e distаnce by lattitude longitude js 
     
     function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
          var R = 6371; // Radius of the earth in km
          var dLat = deg2rad(lat2-lat1);  // deg2rad below
          var dLon = deg2rad(lon2-lon1); 
          var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km
          return d;
        }
        
        function deg2rad(deg) {
          return deg * (Math.PI/180)
        }
     
        
//     var markers = [{"lat":55.7962599,"lon":37.6780104},{"lat":55.7671228,"lon":37.6596245}]  ;
     var markers = <?php echo json_encode($markers); ?>;
     
     function initMap() {
        var myLatLng = {lat: 55.5, lng: 37.7};

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: myLatLng
        });
        
        
        var infowindow = [];
         
        for (i = 0; i < markers.length; i++) {
            m = markers[i];
            
            t = i + "\n" + m['name'][0]+'\n' + m['color'][0].substring(0, 7) //label text
//            console.log ("@@",m);

            infowindow[i] = new google.maps.InfoWindow({
                content: t
              });
            
            marker[i] = new google.maps.Marker({
                position: new google.maps.LatLng(m['pos']['lat'], m['pos']['lon']),
                _text: t,
//                 icon: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5.5,
                    fillColor: m['color'][0].substring(0, 7),
                    fillOpacity: 0.8,
                    strokeWeight: 0.4
                },
                label: {
                            text: t,
                            color: 'black',
                            fontSize: "8px",
                            background: "#fff"
                          },
                 map: map
            });
            
            markers.push([marker, infowindow]);
            
            marker.addListener('click', function() {
                
                markerClick(marker);
//                alert(t); 
//               infowindow[i].open(map, marker);
              });
         }


      }
     
     
     function markerClick(marker) {
       for (var i = 0; i < markers.length; i++) {
        
                if (markers[i][0]['title'] === marker['title']) {
        
                    markers[i][1].open(map, markers[i][0]);
                }
            }
        }
     
        
    </script>
    
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M&callback=initMap">
    </script>
    
</body>

<script>
$(document).ready(function()
{   
  //alert(1);
   $("td").attr("contenteditable",true);
})

</script>
<style>


</style>
