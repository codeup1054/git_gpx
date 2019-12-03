<html>
<head>                                                               
<!--    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script> -->

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M&callback=initMap">
    </script>
    <link href="/gpx/gpx.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript" src="../js/jquery.js"></script>
    <script type="text/javascript" src="../js/google_sheets_api.js"></script>
    <script src="https://www.google.com/uds/?file=visualization&amp;v=1&amp;packages=columnchart" type="text/javascript"></script> 
</head>

<body>

<div id="map" style='width:1000px; height:570px; border:1px solid red;'></div>
<div id="elevation-chart" style='width:1000px; height:300px; border:1px solid red;'></div>


<div id="map_container"><div id="map"></div></div>
<div id="table_container">
       <div id="datasetpanel">
           <div class="datasetcheckbox"></div>
           <div class="datasetsbuttons">
<!--                <button class="button sep" onclick="savegpx()">GPX</button> -->
                <button class='sign' id="button signin-button" onclick="handleSignInClick()">Sign in</button>
                <button class='sign' id="button signout-button" onclick="handleSignOutClick()">Sign out</button>
                <button class="button" onclick="makeApiCall('write')">Google</button>
           </div>
       </div>
       <div class="datasets" ></div>
       <div id="current"></div>
       <div id="result"></div>
</div>

</body>
<script>

var elevator;
var map;
var chart;
//var infowindow = new google.maps.InfoWindow();
var polyline;
var mapCenter = new google.maps.LatLng(55.636912, 37.500391);

// Load the Visualization API and the columnchart package.

google.load("visualization", "1", {packages: ["columnchart"]});


function initialize() {
    var mapOptions = {
        center: mapCenter,
        zoom: 13,
        mapTypeId: 'terrain'
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Create an ElevationService.
    elevator = new google.maps.ElevationService();

    // Draw the path, using the Visualization API and the Elevation service.
    
    var path = 
`55.662417	37.481948
55.652660	37.479459
55.647841	37.484480
55.643912	37.493686
55.634296	37.518158
55.621842	37.505744`;

pnt = path.split('\n');

var arr = [];
    arr = $(pnt).map(function (k,v) {
        l = v.split('\t');

        var latLng = new google.maps.LatLng(l[0],l[1]);

        console.log("@@@ el",k,v,l,latLng);

        return latLng; 
    }).get();

    
    populateSheet(arr);
    drawPath(arr);
}


function drawPath(arr) {
    
    console.log("@@@ arr", arr );
    
    var bikeCourseCoordinates = arr;

    // Create a new chart in the elevation_chart DIV.
    chart = new google.visualization.ColumnChart(document.getElementById('elevation-chart'));

    var path = bikeCourseCoordinates;

    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.
    var pathRequest = {
        'path': path,
        'samples': 256
    }

    // Initiate the path request.
    elevator.getElevationAlongPath(pathRequest, plotElevation);
}



function plotElevation(results, status) {
  if (status == google.maps.ElevationStatus.OK) {
    elevations = results;
    
    // Extract the elevation samples from the returned results
    // and store them in an array of LatLngs.
    var elevationPath = [];
    for (var i = 0; i < results.length; i++) {
      elevationPath.push(elevations[i].location);
//      console.log("@@@ lat, lng", elevations[i].location.lat());
    }

    // Display a polyline of the elevation path.
    var pathOptions = {
      path: elevationPath,
      strokeColor: '#0000CC',
      opacity: 0.9,
      map: map
    }
    polyline = new google.maps.Polyline(pathOptions);

    // Extract the data from which to populate the chart.
    // Because the samples are equidistant, the 'Sample'
    // column here does double duty as distance along the
    // X axis.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < results.length; i++) {
      data.addRow(['', elevations[i].elevation]);
    }

    // Draw the chart using the data within its DIV.
    document.getElementById('elevation-chart').style.display = 'block';
    chart.draw(data, {
      width: 960,
      height: 300,
      legend: 'none',
      titleY: 'Elevation (m)'
    });
  }
}


initialize();

</script>

    