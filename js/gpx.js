var map;
var hmOpacity = 0.5;
var homeGeo = ["55.6442983","37.4959946"] // base
var homeGeo = ["55.7","37.32"]
var zoom = 11;

// Класс для обработки массивов маркеров

class _markers {
  constructor(d)    { this.d = d;  }

  updateMarkerRow() { //console.log(this.d);  
  }

  push(arr) { this.d.push(arr);  }
  
  
  // добавить все маркеры на карту  
  addMarkers() {
     var self = this;
    $(this.d).each(function(k,m) {
        
//        console.log("@@ addMarker", m);
        
        if( isFloat(m.lat*1) && isFloat(m.lng*1) )
        self.placeMarker(m);}) 
    }

  
  //отрисовать маркер на карте
  placeMarker(m) {

     var dist = getDistanceFromLatLonInKm(m.lat, m.lng );

     var dist = m.dist;
    
    //    color = m.color.substring(0, 7);
     var color = ( typeof m.color !== 'undefined')? m.color : "#ffee00";
        
/*     iwCont = '<div idx='+m.idx +' class="baloon idx'+m.idx +'">' 
                    + '<m_idx class="idx">' + m.idx + '</m_idx>'   
                    + '<color class="color"  contenteditable=True >'+ color + '</color>'
                    + '<lat class="lat" contenteditable=True> '+ m.lat + '</lat>'
                    + '<lng class="lng" contenteditable=True> '+ m.lng + '</lng><br />'
                    + '<name contenteditable=True>'+ m.name + '</name> '
                    + '<dist class="dist" contenteditable=True>['+ dist + ']</dist>'
                    + '<time class="time" contenteditable=True><br />'+ m.time+'</time>'
                    + " </div>"; //label text
*/    
    //    console.log("@@@ color", m );
    
     var pos = new google.maps.LatLng(m.lat, m.lng);    
        
     var m_icon = 'data:image/svg+xml,<svg class="mono_icon"  width="15" height="15" xmlns="http://www.w3.org/2000/svg">\
                        <defs>\
                                <radialGradient id="exampleGradient">\
                                  <stop offset="10%" stop-color="gold"/>\
                                  <stop offset="95%" stop-color="green"/>\
                                </radialGradient>\
                        </defs>\
                        <path  fill-opacity=".3" stroke-width="0.5" fill="#f40" stroke="#f40" id="svg_1" d="m14.685496,6.570998c0,3.790972 -7.068536,8.225084 -7.068536,8.225084s-7.302785,-4.433682 -7.302785,-8.282617c0,-3.651441 2.918311,-6.359523 6.88748,-6.359523c3.968235,0 7.483841,2.76561 7.483841,6.417056z" /></svg>';
    
     switch (m.group)
        {
            case "Велобайк":
                   console.log("@@ placeMarker", m.group);
                   icon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 2.5,
                        fillColor: "#ff22dd",
                        fillOpacity: 0.9,
                        strokeWeight: 0.1
                    };
                    break;
            default: 
                    var aRotationVariable = 70;
                    var icon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5,
                        fillColor: m.color,
                        rotation: aRotationVariable,
                        fillOpacity: 1,
                        strokeWeight: 0.4
                    };
                    var icon = {
                        anchor: new google.maps.Point(30, 30.26),
                        size: new google.maps.Size(60,30.26),
                        url: 'data:image/svg+xml,<svg class="mono_icon"  width="15" height="15" xmlns="http://www.w3.org/2000/svg">\
                        <defs>\
                            <radialGradient id="exampleGradient">\
                              <stop offset="10%" stop-color="gold"/>\
                              <stop offset="95%" stop-color="green"/>\
                            </radialGradient>\
                        </defs>\
                            <path  class="mono_icon" fill-opacity=".3"   stroke-width="0.5" fill="#f40" \
                            stroke="#f40" id="svg_1" \
                            d="m14.685496,6.570998c0,3.790972 -7.068536,8.225084 -7.068536,8.225084s-7.302785,-4.433682 -7.302785,-8.282617c0,-3.651441 2.918311,-6.359523 6.88748,-6.359523c3.968235,0 7.483841,2.76561 7.483841,6.417056z"/>\
                             </svg>'
                    };
                    
                    var markerTitle = dist.toFixed(2);
                    var markerTitle = m.name;
                    
                    var icon = {
                        anchor: new google.maps.Point(14, 14),
                        size1: new google.maps.Size(60,30.26),
                        url: 'data:image/svg+xml;utf-8, \
      <svg width="52" height="32" viewBox1="0 0 15 32" xmlns="http://www.w3.org/2000/svg"> \
        <circle fill="%232255aa" stroke="white" stroke-width="1"  cx="14" cy="14" r="4"/> \
        <rect x="16" y="0" width="27" height="11" fill-opacity="0.40" rx="2" ry="2" fill="rgb(255,255,255)" stroke="none" /> \
        <text x="29" y="9" font-family="Arial, sans-serif" fill="%23113388" stroke="none" paint-order="stroke" text-anchor="middle" font-size="9"  >'+markerTitle+'</text>\
      </svg>'

//        <text stroke="null" id="svg_2" x="18" y="17" font-family="Arial, sans-serif" text-anchor="middle" font-size="9" fill="#0f0">нет</text>\
//        <path fill="rgb(255, 180, 0)" stroke="white" stroke-width="1.5" d="M3.5 3.5h25v25h-25z" >ttt</path> \

                    }
                                    
        }

//var anSVGPathString = "M61.2849 48.0244C61.2849 64.3164 48.0769 77.5244 31.7849 77.5244C15.4929 77.5244 2.28491 64.3164 2.28491 48.0244C2.28491 34.9504 22.2469 12.2714 29.6169 3.82141C31.1029 2.11741 33.7479 2.12141 35.2349 3.82441C42.6149 12.2764 61.2849 34.9514 61.2849 48.0244Z"


        
       var marker = new google.maps.Marker({
            name: m.name,
            title: m.name,
            dist:dist,
            position: pos,
            map: map,
            idx: m.idx,
            draggable: true,
            icon: icon,
          });
      
/*                 
      var dist_icon =  {
      path: "M-10,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0", // circle
      path: "M 0 0 L 20 0 L 20 10 L 0 10 z",
      fillColor: '#fefefe',
      strokeOpacity: 0, 
      fillOpacity: .4,
      anchor: new google.maps.Point(-7, 10),
      strokeWeight: 1,
      labelOrigin: new google.maps.Point(10, 6),
      scale: 1,
      text: "57"
    } 
       
        var base_dist  = new google.maps.Marker({
            position: marker.getPosition(),
            map: map,
            icon: dist_icon,
            label: {
              text: ((dist+"").length>4)? dist.toFixed(1)+"":dist+"",
              color: '#034',
              fontSize: '9px',
              fontWeight: 'normal'
            }
          });
        
        
          
        base_dist.bindTo("position", marker);
*/        
       
        google.maps.event.addListener(marker, 'click', function () { markerClick(this);});
        google.maps.event.addListener(marker, 'dblclick', function () { markerDel(this);});
        google.maps.event.addListener(marker, 'dragend', callDrag(marker,1));
        google.maps.event.addListener(marker, 'dragstart', callDrag(marker));
        google.maps.event.addListener(marker, 'drag', callDrag(marker));

        markers.push(marker);
    
        $('.baloon').on('click',function () {
            console.log("@@ baloon click",this,this.idx,$(this).attr('idx'));
            markerClick(this);
            })
    //    map.panTo(pos);
        // geocoding 
    } // end method PlaceMarker
  
  
}


let markersArray = new _markers([]);  


$(document).ready(function()
{   
  // 2019-08-20 изменяемые панели.

var resize= $("#left_panel");
var right_p = $("#right_panel")  
var containerWidth = $("#container").width();  


      
$(resize).resizable({
      handles: 'e',
      maxWidth: '100%',
      minWidth: 120,
      resize: function(event, ui){

//        console.log("@@ containerWidth ", containerWidth , resize);

          var currentWidth = ui.size.width;
          
          // this accounts for padding in the panels + 
          // borders, you could calculate this using jQuery
          var padding = 30; 
          
          // this accounts for some lag in the ui.size value, if you take this away 
          // you'll get some instable behaviour
          $(this).width(currentWidth);
          
          // set the content panel width
          $(right_p).width(containerWidth - currentWidth - padding);            
      }
});
     
  //alert(1);
   $(".tab td:nth-child(4)").attr("contenteditable",true);
   $(".tab td").on('click1', function() {
        idx = $(this).closest('tr').attr('idx');
//        console.log("@@ row", idx, $('.idx'+idx));
        console.log("@@ss ", idx, );
        $('.bselect').toggleClass('bselect');
        $('.idx'+idx).toggleClass('bselect');
        
        var latLng = new google.maps.LatLng(markers[idx][0].position.lat(), markers[idx][0].position.lng()); 
        
//        map.panTo(latLng);
        
   } );


   
   
   $(".save_to_csv").click(function(){
    
       var ms = [];
       console.log(".save_to_csv", markers);

       for (var i = 0; i < markers.length; i++) {
           mm = {}; 
           mm.idx = i;
           ms.push(mm);
       }
       
//      console.log("@@ ms", ms);  
    
      $.post("a.php",
      {
        name: "Donald Duck",
        city: "Duckburg",
        markers: JSON.stringify(ms) 
      },
      
      function(data, status){
//        console.log("Data: " + data + "\nStatus: " + status);
      });
    });

// дожидаемся загрузки и делаем infoWindow стильным  
  
})

// end of ready

function showhideInfoWindow()
{
    
    for (m in markers)
     { m[1].close(); }
}



     
     // Calculat e distаnce by lattitude longitude js 
 function savegpxtoOSMAnd()
 {
var cnt = 0;

$("[type=checkbox]:checked").each(function(){
   
   wpset = $(this).attr('id');
   str = '';
   
   $('.wp_panel table[dataset="' + wpset + '"] tr:not(.header)').each(function (k,v) {

    t = $(v).children().map(function(ek,ev){ return $(ev).text()}); 
//       console.log ("@@@savegpx",k,t);

    str  +=  '<wpt lat="'+t[4]+'" lon="'+t[5]+'">\n\
<time>'+t[8]+'</time>\n'+
'<name>'+t[2]+
//'['+t[6].split('.')[0]+']'+
'</name>\n\
<sym>Scenic Area</sym>\n\
<extensions>\
<color>'+t[7]+'</color>\
</extensions>\n\
</wpt>\n\
';
   });

    str = '<gpx version="1.1" creator="OsmAnd 3.3.7" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\
            <metadata><name>Markers_2019-06-11</name></metadata>' + str + '</gpx>';
$('#gpx_xml').text(str);

const MIME_TYPE = 'text/plain';

var cleanUp = function(a) {
  a.textContent = a.textContent+'+';
  a.dataset.disabled = true;

  // Need a small delay for the revokeObjectURL to work properly.
  setTimeout(function() {
    window.URL.revokeObjectURL(a.href);
  }, 1500);
};

//var downloadFile = function() {
  window.URL = window.webkitURL || window.URL;

  var prevLink = $('a');
  if (prevLink) {
    window.URL.revokeObjectURL(prevLink.href);
    $('output').html('');
  }

//  var bb = new Blob([typer.textContent], {type: MIME_TYPE});
  var bb = new Blob([str], {type: MIME_TYPE});

  var a = document.createElement('a');
//  a.download = container.querySelector('input[type="text"]').value;
  a.download = (cnt++)+ '.'+wpset+'.gpx';
  a.href = window.URL.createObjectURL(bb);
  setName = $("[for='"+wpset+"']").text();
  a.textContent = setName.substring(0,3);

  a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
  a.draggable = true; // Don't really need, but good practice.
  a.classList.add('dragout');
  
//  console.log("@@@ savegpx", setName.substring(3), a);

  $('[for="'+wpset+'"]').html(a); 
  $('[for="'+wpset+'"]').append (setName.substring(3));

  a.onclick = function(e) {
    if ('disabled' in this.dataset) {
      return false;
    }

    cleanUp(this);

  };
//}; // downloadFile = function()

}); // end forech wpsets

}
     

 
function getDistanceFromLatLonInKm(lat1,lon1, lat2=55.6442983, lon2=37.4959946) {
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
      return Math.round(d*100)/100;
    }
    
function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
 
        
        
function callDrag(marker,drag_end=0) {
  return function() {

    lat  = marker.position.lat().toFixed(4); //.toFixed(4);
    lng  = marker.position.lng().toFixed(4)//.toFixed(4);
    dist = getDistanceFromLatLonInKm(lat,lng);

//    console.log("@@ Callback", lat,lng, marker);
    
    markersArray.updateMarkerRow(marker);
    
    if (drag_end) 
        { 
         // map.panTo(marker.position);
//          console.log("@@ updateTotalDist=", marker);
          updateGeoInGlobalGpx(marker,lat,lng);
          
          updateGeoInTable(marker.name,lat,lng);  
          drawPath();
          updateTotalDist(marker);
        }
  };
}


function updateGeoInGlobalGpx(m,lat,lng)
{           
    n = m.idx.split('_');
    
    id = glob_gpx.findIndex(x => x.name === n[0]);

    console.log("@@ updateGeoInGlobalGpx=", id, m.name, m.idx, lat,lng);
    
    glob_gpx[id].points[n[1]].lat = lat;
    glob_gpx[id].points[n[1]].lng = lng;
    
//    $.each(glob_gpx , function( ) {   });   
}

function updateTotalDist(mname)
{
    console.log("@@ updateTotalDist=",mname);
//    show(mname.idx);
//    dist = ((r>0) ? ""+dist_total.toFixed(2)+"<sup>+"+dist_next+"</sup>":"");
}


function selectCallback(infowindow)
{
//    console.log("@@",infowindow)
    $('.bselect').toggleClass('bselect');
    $(this).toggleClass('bselect');
    $(this).setZIndex(Number);

}
     
     
function markerClick(ob) {
    
    console.log("@@markerClik", ob.name);
    tdCont = $('.datasets td:contains("'+ob.name+'")')
    trCont = tdCont.parent("tr");
    trCont.addClass(); 
    $('.rowselect').toggleClass('rowselect');
    trCont.toggleClass('rowselect');
//    $("body").scrollTo(tdgeos);
    
    var $par = $("#left_panel"), // The ".test" parent element
    $el = trCont;               // The clicked "p" element
  
    $par.animate({
        scrollTop: $el.offset().top + $par.scrollTop() -30
      }, 800);
    
//    $([document.documentElement, document.body]).animate({
//        scrollTop: trCont.offset().top -100
//    }, 500);

//    markers[idx][1].setZIndex(100);
//    markers[idx][1].open(map, markers[idx][0]); 
    
//    $('.bselect').toggleClass('bselect');
//    $('.idx'+idx).toggleClass('bselect');
    
    }
 
function markerDel(ob){
    
    console.log("@@@ markerDel=",ob);
    
    tdgeos = $('.datasets td:contains('+ob.name+')').parent("tr");
    tdgeos.addClass(); 
    $('.rowdel').toggleClass('rowdel');
    tdgeos.toggleClass('rowdel');
//    $("body").scrollTo(tdgeos);
    $([document.documentElement, document.body]).animate({
        scrollTop: tdgeos.offset().top -100
    }, 500);   
    
    tdgeos.hide('slow', function(){ tdgeos.remove(); });    
    $(ob).hide('slow', function(){ ob.setMap(null); });    
    
    
    }


var elevator;
var chart;
//var infowindow = new google.maps.InfoWindow();
var polyline;
// Load the Visualization API and the columnchart package.

     
function initMap() {

  var mapOptions = {
    zoom: zoom,
//    mapTypeId: 'satellite',
    center: new google.maps.LatLng(homeGeo[0],homeGeo[1])
  };

    map = new google.maps.Map(document.getElementById('map'), mapOptions );
    
    google.load("visualization", "1", {packages: ["chart"]});
        // Create an ElevationService.
    elevator = new google.maps.ElevationService();
    
    
   map.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(256, 256)));
      
   rect=new google.maps.Rectangle()   

   google.maps.event.addListener(map,'click',function(e){
        var b=MERCATOR.getTileBounds(MERCATOR.getTileAtLatLng({lat:e.latLng.lat(),lng:e.latLng.lng()},this.getZoom()));
        rect.setOptions({bounds:new google.maps.LatLngBounds(new google.maps.LatLng(b.sw.lat,b.sw.lng),new google.maps.LatLng(b.ne.lat,b.ne.lng)),
                      map:map})
      });
      google.maps.event.addListener(map,'zoom_changed',function(){
         rect.setMap(null);
      });
  
   var controlDiv =$("#floating-panel");
   controlDiv.index = 1;
   
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv[0]);
   
//   console.log ("@@ map.controls=", map.controls[google.maps.ControlPosition.TOP_RIGHT]);
    
}

 
var markers = [];


function addMarker(map, item, location) {
  
//  console.log("@@@ Setting marker for " + item.name + " (location: " + location + ")");
  var marker = new google.maps.Marker({ map : map, position : location});
  marker.setTitle(item.title);
  var infowindow = new google.maps.InfoWindow( {
    content : item.body,
    size : new google.maps.Size(100, 300)
  });
  new google.maps.event.addListener(marker, "click", function() {
    infowindow.open(map, marker);
  });
}



function geocode(addr)
    { 
   var today = new Date();
                m = {'name':addr,
                    'color':"#8f8",
                    'time':today  
                    };
                    
    var geocoder = new google.maps.Geocoder();
    var geoOptions = {
      address: addr,
//      bounds: bounds,
      region: "NO"
    };
//    console.log("@@@ addr",geoOptions);
    res = geocoder.geocode(geoOptions, getGeo(addr));
    
//    console.log("@@@ geocode() res", geocoder, addr);
    
    return res;
}


function getGeo(addr) {  // используется при геокодировании
return function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    
    lat = results[0].geometry.location.lat().toFixed(4);
    lng = results[0].geometry.location.lng().toFixed(4);
    
//    tdgeos = $('.datasets td:contains('+addr+')').parent("tr").find("td:eq(4),td:eq(5),td:eq(6)")
   m = { 
         'name':addr,
         'lat':lat,
         'lng':lng,
         'color':"#ff0000"  
         };
    
    markersArray.placeMarker(m);
    
    loc = results[0].geometry.location
    
    map.panTo(loc); // центруем карту
    updateGeoInTable(addr,lat,lng); // обновляем таблицу
    
    return loc;
    
  } else {
    console.log("Geocode failed " + status);
  }
};
}

function updateGeoInTable(addr,lat,lng)
{
    tdgeos = $('.datasets td:contains('+addr+')').parent("tr").find("td").slice(4,7)
    $(tdgeos[0]).text(lat);
    $(tdgeos[0]).toggleClass('modified_geo');
    $(tdgeos[1]).text(lng);
    $(tdgeos[2]).text(getDistanceFromLatLonInKm(lat,lng));
}

function fitMarkers()
{   
    var bounds = new google.maps.LatLngBounds();

    for (var i = 1; i < markers.length; i++) {
//    for (var i = 1; i < 5; i++) {
    lat = markers[i].getPosition().lat().toFixed(4);
    lng = markers[i].getPosition().lng().toFixed(4);
    
    if ( lat == 'NaN' || lng == 'NaN'  ) continue;
    
//    console.log("@@@ fitMarkers markers",markers[i].name,lat, lng);
    var myLatLng = new google.maps.LatLng(lat, lng);
    bounds.extend(myLatLng);
    }

    map.fitBounds(bounds);
    var zoom = map.getZoom();
    console.log("@@@ fit ", zoom, markers.length, bounds);
    map.setZoom(zoom+0)
    
}

// elevation 

function drawPath() {
    
   
    path_points = $('.datasets div:not(.hide) tr')
         .map(function(k,v) {
         
         lat = $(v).find("td:eq(4)").text();
         lng = $(v).find("td:eq(5)").text();   
         
//         console.log("@@@ lat,lng  ", lat,lng);
         
         var latLng = new google.maps.LatLng(lat,lng);
         return latLng ;
      }).get();
    
//    console.log("@@@ draw path", path_points);

    // Create a new chart in the elevation_chart DIV.

//    chart = new google.visualization.ColumnChart(document.getElementById('elevation-chart'));
    chart = new google.visualization.AreaChart(document.getElementById('elevation-chart'));


    var path = path_points.slice(1);
    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.

    samp = Math.floor(($(window).width()-500)/4)
    
//    console.log("@@@ samp ", samp)
    
    var pathRequest = {
        'path': path,
        'samples': samp
    }
    // Initiate the path request.
    elevator.getElevationAlongPath(pathRequest, plotElevation);
}


var el_markers = [];


function plotElevation(results, status) {
  
  if (polyline) 
   {
//    console.log("@@@ polyline",polyline);
    polyline.setMap(null);
   }  
    
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
      strokeColor: '#2255aa',
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
//      console.log ("@@@ chart result", results[i]);  
      data.addRow(['', elevations[i].elevation]);
    }

    // Draw the chart using the data within its DIV.
    document.getElementById('elevation-chart').style.display = 'block';

    options = {
              width: $(window).width()+50,
              height: 150,
              legend: 'none',
              hAxis: { 
                maxValue: 7,
                title: "WP",
                gridlines: { count: 3, color: '#CCC' }, 
                },
              vAxis: { maxValue: 13 },
              titleY: 'Высота (m)',
              lineWidth: 30,
              pointSize: 2,
              pointShape: 'none',
              colors: ['#d3368d', '#e2431e', '#e7711b',
                       '#e49307', '#e49307', '#b9c246']
            };



    options2 = {
      width: $(window).width()-10,
      height: 150,
//      color: '#ccddff',
      legend: 'none',
      titleY: 'Elevation (m)'
    };
    
    chart.draw(data, options);
    
// add bar listner    
    
    

    google.visualization.events.addListener(chart, 'onmouseover', function (e) {
        
//        var selection = chart.getSelection();
        pos = elevationPath[e.row];
        console.log("@@@ pos", pos, e, elevations[e.row]);
        
        while(el_markers.length) { el_markers.pop().setMap(null);  base_dist.setMap(null);   }
        
        var elev = elevations[e.row].elevation.toFixed(0); 
        
        var image = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23808080%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + elev + '%3C%2Ftext%3E%3C%2Fsvg%3E';

        
        el_marker = new google.maps.Marker({ 
                map : map,
                title: ':'+elev,
                icon2: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5.5,
                        fillColor: "#ddeeff",
                        strokeColor: "#4444dd",
                        fillOpacity: 0.95,
                        strokeWeight: 1.3,
                        },
                icon: image,
                position : pos
                });
        el_markers.push(el_marker);
        
//        map.panTo(pos);

        
        
        });

    
    google.visualization.events.addListener(chart, 'select', function (e) {

    
    var selection = chart.getSelection();


    if (selection.length) {
        var row = selection[0].row;

        pos = elevationPath[row];
        map.panTo(pos);
        
        var view = new google.visualization.DataView(data);
        chart.draw(view, options);
        }
    });
    
    google.visualization.events.addListener(chart, 'onmouseover1', function (e) {
        
//        var selection = chart.getSelection();
        
//        console.log ("@@@ selection ", selection);
        
//        var row = selection[0].row;
//        pos = elevationPath[row];

        setTooltipContent(data,e.row);
    }); 
  }
}

function setTooltipContent(data,row) {
    if (row != null) {
        var content = '<div class="custom-tooltip" ><h1>' + data.getValue(row, 0) + '</h1><div>' + data.getValue(row, 1) + '</div></div>'; //generate tooltip content
        var tooltip = document.getElementsByClassName("google-visualization-tooltip")[0];
        console.log("@@@ setTool", content, data);
        
//        pos = elevationPath[row];
        
        var marker = new google.maps.Marker({ map : map, position : pos});
        map.panTo(pos);

//        tooltip.innerHTML = content;
    }
}


function chartOver()
{ 
    var selection = chart.getSelection();
    if (selection.length) {
        var row = selection[0].row;
//        document.querySelector('#myValueHolder').innerHTML = data.getValue(row, 1);
        
        pos = elevationPath[row];
        
        var marker = new google.maps.Marker({ map : map, position : pos});
        map.panTo(pos);
        
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1, {
            type: 'string',
            role: 'style',
            calc: function (dt, i) {
                return (i == row) ? 'color: red' : null;
            }
        }]);

        chart.draw(view, options);
    }
}


function resizeChart () {
    console.log("@@@ resize");
    drawPath();
}

if (document.addEventListener) {
    window.addEventListener('resize', resizeChart);
}
else if (document.attachEvent) {
    window.attachEvent('onresize', resizeChart);
}
else {
    window.resize = resizeChart;
}


// хелперы

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}


// reorder tr

var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    console.log("@@@ fixHelperModified", $originals);
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
    updateIndex = function(e, ui) {
        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i + 1);
        });
    };


MERCATOR={
  
  fromLatLngToPoint:function(latLng){
     var siny =  Math.min(Math.max(Math.sin(latLng.lat* (Math.PI / 180)), 
                                   -.9999),
                          .9999);
     return {
       x: 128 + latLng.lng * (256/360),
       y: 128 + 0.5 * Math.log((1 + siny) / (1 - siny)) * -(256 / (2 * Math.PI))
     };
  },

  fromPointToLatLng: function(point){
  
     return {
      lat: (2 * Math.atan(Math.exp((point.y - 128) / -(256 / (2 * Math.PI)))) -
             Math.PI / 2)/ (Math.PI / 180),
      lng:  (point.x - 128) / (256 / 360)
     };
  
  },

  getTileAtLatLng:function(latLng,zoom){
    var t=Math.pow(2,zoom),
        s=256/t,
        p=this.fromLatLngToPoint(latLng);
        return {x:Math.floor(p.x/s),y:Math.floor(p.y/s),z:zoom};
  },
  
  getTileBounds:function(tile){
    tile=this.normalizeTile(tile);
    var t=Math.pow(2,tile.z),
        s=256/t,
        sw={x:tile.x*s,
            y:(tile.y*s)+s},
        ne={x:tile.x*s+s,
            y:(tile.y*s)};
        return{sw:this.fromPointToLatLng(sw),
               ne:this.fromPointToLatLng(ne)
              }
  },
  normalizeTile:function(tile){
    var t=Math.pow(2,tile.z);
    tile.x=((tile.x%t)+t)%t;
    tile.y=((tile.y%t)+t)%t;
    return tile;
  }

}

/** @constructor Mercator */
function CoordMapType(tileSize) {
  this.tileSize = tileSize;
}

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
var tile=MERCATOR.normalizeTile({x:coord.x,y:coord.y,z:zoom}),
    tileBounds=MERCATOR.getTileBounds(tile);

  var div = ownerDocument.createElement('div');
  
  zoom = (zoom<17)? zoom : 16;
  
  srcImage  = 'https://anygis.ru/api/v1/Tracks_Strava_All/'+tile.x+
  '/'+tile.y+'/'+zoom;
  
//  console.log("@@@ ",srcImage );
/*  
  div.innerHTML = 
'<pre><strong>tile:\n['+tile.x+','+tile.y+']</strong>\
\nbounds:{\nsw:['+tileBounds.sw.lat+','+tileBounds.sw.lng+'],\
\nne:['+tileBounds.ne.lat+','+tileBounds.ne.lng+']\n}</pre>';
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';
  div.style.backgroundImage = "url('"+srcImage+"')";;
*/
  
  div.innerHTML ='';
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.borderWidth = '0px';
  div.className = 'heatmapdiv';
//  div.style.fontSize = '10';
//  div.style.borderStyle = 'solid';
//  div.style.borderWidth = '1px';
//  div.style.borderColor = '#AAAAAA';
  div.style.backgroundImage = "url('"+srcImage+"')";
  div.style.opacity =hmOpacity;

  return div;
};


$( function() {
$( "#slider_transperency" ).slider(
{
  orientation: "horizontal",
  range: "min",
  max: 100,
  value: 50,
  slide: refreshTrans,
  change: refreshTrans
});
} );

function refreshTrans ()
{
        tval = $( "#slider_transperency" ).slider( "value" );
        
        if ($('#toggleHM').val() == "Show HM" ) toggle();
        
        hmOpacity = tval/100;
        $('div.heatmapdiv').css({ opacity: hmOpacity });
//            $("#slider_transperency" ).find(".ui-slider-handle").text(tval);
        $('span.ui-slider-handle').css({'display': 'inline-block'})
                                   .html("<div>"+tval+"</div>");
//           console.log("@@ tval",tval );    
}

toggle = function(s=1) {
    $("div.heatmapdiv").toggle();
    $('#toggleHM').val( $('#toggleHM').val() == "Show HM" ? "Hide HM" : "Show HM");  
//    console.log("@@ toggle v=", $('#toggleHM').val() );
};

