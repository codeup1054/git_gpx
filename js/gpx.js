//document.write('<script type="text/javascript" src="js/cookie/jquery.cookie.js"></script>');

var map;
var homeGeo = ["55.6442983","37.4959946"] // base
var cache_area = {};
var globalSettings = {
               distOnOff:{on:true,  name:'Дистанция', exec:["updateMarkersOnMap"]},
               cacheOnOff:{on:false, name:'Cache', exec:["cacheOnOff"]},
               latlngOnOff:{on:true,name:'LatLng', exec:["updateMarkersOnMap"]},
               pathOnOff:{on:true,  name:'Путь', exec:["updateMarkersOnMap"]}
               };


var elevator;
var chart;
//var infowindow = new google.maps.InfoWindow();
var polyline;
// Load the Visualization API and the columnchart package.


$(document).ready(function()
{   
  // 2019-08-20 изменяемые панели.

var resize= $("#left_panel");
var right_p = $("#right_panel")  
var containerWidth = $("#container").width();  


    show_cache_legend();
    console.log( "@@ ready!" );
    
$('#buttons_panel').html("***");    

$(Object.keys(globalSettings)).each(function(k,v)
            { 
            el = globalSettings[v];    
//            console.log("@@ gl",v,el,el.on,el.name, $('#right_panel'));
            chk = (el.on)?"checked":"";
                
            $('#onmapOnOff').append(`<input type=checkbox  ${chk}
            id= ${v} onchange='globalSettings.${v}.on=this.checked; gpxexec(["${el.exec}"]);'/>
            <label for='on_of_distance'>${el.name}</label>` );
            });

      
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


var clr_r = [
'rgb(200,  0,  0)',
'rgb(255, 90, 20)',
'rgb(250,225, 10)',
'rgb(100,230, 10)',
'rgb( 30,180, 15)',
'rgb( 80,190,155)',
'rgb( 80,180,230)',
'rgb( 100,120,230)',
'rgb( 170,190,210)',
'rgb( 210,220,230)'
];
 

param = document.location.hash || $.cookie('hash') || "55.644,37.495,11,0.90"

var p = param.split(',');

var homeGeo = ( isNaN(parseFloat(p[0].substr(1))) || isNaN(parseFloat(p[1])) )
                ? ["55.7","37.32"] : [p[0].substr(1), p[1]];

//var homeGeo = [hashGeo[0].substr(1),hashGeo[1]]

var zoom = p[2]*1 || 11 ;
var hmOpacity = p[3] || 0.9;
var dinfo = p[4] || 0;


//var zoom = hashGeo[2].substr(0, hashGeo[2].length - 1);

console.log ("@@ hashGeo", $.cookie('hash'), p, homeGeo, zoom, document.location );


var tile_cnt = 0 ;


window.tm = function (s="")
{
    var output = "";

// Remember when we started
   if (s == "")
   {
    lap = start = new Date().getTime();
    
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    console.log("Старт: %s",str);        
    }
    else 
    {
    var end = new Date().getTime();
    console.log("%s %s %s",end - start,end - lap,s);        
    lap = end; 
    }
};

tm();

// Класс для обработки массивов маркеров


var olat, olng;

class _markers {
  
    constructor(d)    {
        this.path_total_dist = 0;
        this.d = d;  
        }
    
    updateMarkerRow() {   } //console.log(this.d);
    push(arr) { this.d.push(arr);  }
    addMarkers() {  // 01. добавить все маркеры на карту

    var self = this;
    this.path_total_dist = 0;
     
    while(markers.length) { markers.pop().setMap(null); }  
     
    $(this.d).each(function(k,m) {
        if( isFloat(m.lat*1) && isFloat(m.lng*1) )
        self.placeMarker(m);}) 
    }

    placeMarker(m,prop={'fill':"%23113388"}) { // 02. отрисовать маркер на карте
    
// console.log("@@ placeMarker", m);
     olat = this.olat || m.lat;
     olng = this.olng || m.lng;
     
     var dist = getDistanceFromLatLonInKm(m.lat, m.lng, olat,olng);
     [this.olat, this.olng] = [m.lat, m.lng];
     
     this.path_total_dist += dist;
     
//     var dist = m.dist;
     var color = ( typeof m.color !== 'undefined')? m.color : "#ffee00";
     var pos = new google.maps.LatLng(m.lat, m.lng);    
        
     switch (m.gpxSet)
        {
            case "Велобайк":
                   console.log("@@ placeMarker", m.gpxSet);
                   icon = {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 2.5,
                        fillColor: "#ff22dd",
                        fillOpacity: 0.9,
                        strokeWeight: 0.1
                    };
                    break;
            default: 

                    var markerTitle = m.name+'\n'+m.lat+','+m.lng;
                    var text_lines = svg_text_to_lines(m.name, 15, 4);
                    var l = 0;
                    
                    text_lines = text_lines.concat([parseFloat(m.lat).toFixed(5)+','+parseFloat(m.lng).toFixed(5)]);
                    
                    
                    var m_text = $( text_lines ).map(function(k,v) {
                        l++; return '<text x="20" y="'+(l*9)+'" font-family="Arial, sans-serif" fill="%23113388" stroke="none" \
                              paint-order="stroke" text-anchor="left" font-size="9"  >'+v+'</text>'; 
                        }).get().join('');
                    
                    if ( globalSettings.distOnOff.on ) 
                    {
//                    text_lines = text_lines.concat([dist]);
                    var dist_info = this.path_total_dist.toFixed(2)+'+'+dist;
                    m_text = m_text + '<rect x="19" y="'+(l*9)+'" width="'+dist_info.length*5.2+'" height="11" fill-opacity="0.80" rx="2" ry="2" fill="rgb(255,255,255)" stroke="none" />';
                    l++;
                    m_text = m_text + '<text x="20" y="'+(l*9)+'" font-family="Arial, sans-serif" fill="%23bb3311" stroke="none" \
                            paint-order="stroke" text-anchor="left" font-size="11"  >'+dist_info+'</text>';
                    }          
                    
                    
//                    console.log("@@ text=", text_lines);
                    
                    var url = m.url || 'data:image/svg+xml;utf-8, \
                    <svg width="132" height="52" viewBox1="0 0 15 32" xmlns="http://www.w3.org/2000/svg"> \
                    <circle fill="'+prop.fill+'" stroke="white" stroke-width="1"  cx="14" cy="14" r="5"/> \
                    <rect x="16" y="0" width="82" height="11" fill-opacity="0.40" rx="2" ry="2" fill="rgb(255,255,255)" stroke="none" />'
                    +m_text+
                    '</svg>';
                    
                    var icon = {
                        anchor: new google.maps.Point(14, 14),
                        size1: new google.maps.Size(60,30.26),
                        url: url
        }
    }
        
       var marker = new google.maps.Marker({
            name: m.name,
            title: markerTitle,
            dist:dist,
            position: pos,
            map: map,
            m: m,
            gpxSet: m.gpxSet,
            idx: m.idx,
            draggable: true,
            icon: icon,
          });
      
       
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
    
        drawPath();
    //    map.panTo(pos);
        // geocoding 
    } // end method PlaceMarker
}

function updateMarkerIcon(m)
{

m.setMap(null);
console.log("@@ updateMarkerIcon", m);
url = m.url
/*'data:image/svg+xml;utf-8, \
      <svg width="52" height="32" viewBox1="0 0 15 32" xmlns="http://www.w3.org/2000/svg"> \
        <circle fill="%23ff55aa" stroke="white" stroke-width="1"  cx="14" cy="14" r="5"/> \
        <rect x="16" y="0" width="27" height="11" fill-opacity="0.40" rx="2" ry="2" fill="rgb(255,255,255)" stroke="none" /> \
        <text x="29" y="9" font-family="Arial, sans-serif" fill="%23113388" stroke="none" paint-order="stroke" text-anchor="middle" font-size="9"  >'+m.title+'</text>\
      </svg>';
*/

console.log("@@ url=",m.icon.url);

new_m     = m.m; 
new_m.url = url;
new_m.lat = m.position.lat();
new_m.lng = m.position.lng();

markersArray.push(new_m); // заменить на update Marker
markersArray.placeMarker(new_m,{'fill':"%23ff8811"});

}  



function svg_text_to_lines(t, width, height) {
  
    var words = t.split(/[\n ]+/).reverse();

    w = words ;
    
    words = words.filter( function(e) { return e !== '' });
    
    [lines,line] = [[],[]];
        
    while (word = words.pop()) {
      line.push(word);
      text = line.join(" ");
      if (text.length > width) { 
        line = []; 
        lines.push(text); 
        text="";
       }
    }
    
  if(text !== "" ) lines.push(text); 


//  console.log("@@ svg_text_to_lines \n", t, w, lines);


  return lines;
}

function svg_wrap1(t, width, height) {
  
  var tspan;
  
  text = $(t);
  
  text.attr("dy",height);
        var words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat( text.attr("dy") ),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    console.log("@@ elem", text, words,tspan );
    
    while (word = words.pop()) {

      line.push(word);
      tspan.text(line.join(" "));

      if (text.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }

  return tspan;
}


let markersArray = new _markers([]);  




// end of ready

function showhideInfoWindow()
{
    
    for (m in markers)
     { m[1].close(); }
}
     
// Calculate distаnce by lattitude longitude js 
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

// 2020-02-10 Операции по завершению перетягивания маркера
    
    if (drag_end)  
        { 
         // map.panTo(marker.position);
//          console.log("@@ updateTotalDist=", marker);
          updateLatLngInGlobalGpx(marker,lat,lng);
          updateGeoInTable(marker,lat,lng);
          updateMarkersOnMap();         // все маркеры
//          updateMarkerIcon(marker);   // одиночный маркер
//          drawPath();
//          markersArray.addMarkers();  // все маркеры
//          updateTotalDist(marker);
        }
  };
}



function updateLatLngInGlobalGpx(m,lat,lng)
{           
    console.log("@@ updateLatLngInGlobalGpx m=", m.m.gpx_id, m);
    
    [setName,pointName,pos] = m.m.gpx_id.split('|');

    console.log("@@ updateLatLngInGlobalGpx= n", pos, lat,lng, glob_gpx);

//    id = glob_gpx.findIndex(x => x.name === n[0]);

    glob_gpx[setName].points[pos].lat = lat;
    glob_gpx[setName].points[pos].lng = lng;

    console.log("@@ updateLatLngInGlobalGpx= n", pos, lat,lng, glob_gpx);
}

// 2020.02.10 imporved version updateLatLngInGlobalGpx
//


function updateGpx(gpx_id, d=0 )
{           
   
    [setName,pointName,pos] = gpx_id.split('|');

//    id = glob_gpx.findIndex(x => x.name === n[0]);
/*
ID: "7"
Status: ""
name: "точка 7"
description: "метро Университет "
lat: "55.7423"
lng: "37.6155"
dist: "13.22"
color: "#ffdd88"
*/

    glob_gpx[setName].points[pos].lat = lat;
    glob_gpx[setName].points[pos].lng = lng;
    glob_gpx[setName].points[pos].name = d.name || glob_gpx[setName].points[pos].name;
    glob_gpx[setName].points[pos].description = d.description || glob_gpx[setName].points[pos].description;

    console.log("@@ 07.updateLatLngInGlobalGpx=", d, d.name, pos, lat,lng, glob_gpx);

}


function updatePointOrderInGlobalGpx(setName)
{           
    console.log("@@ updatePointOrderInGlobalGpx m=", setName, glob_gpx);
    gpx_set_trs = $("tr[gpx_id*='"+setName+"']");
        
    points = [];
    glbp = glob_gpx[setName].points;
        
    $.each(gpx_set_trs, function (k,v)
    {   
        tds = $($(v).children('td')[0]).text();
        inp_idx = $($(v).children('input')[0]).text();
        console.log("@@@ updatePointOrderInGlobalGpx k=%s tds=%s \n glbp[k]=%o \n glbp[tds]=%o \n v=%o \n", k, tds, glbp[k], glbp[tds], v);
        points.push( glbp[tds] );
        
        $($(v).children('td')[0]).text(k);
        
        rowId = setName+"|"+glbp[tds].name+"|"+k;
        
        $($(v).find('input')[0]).attr({gpx_id:rowId});
        $(v).attr({gpx_id:rowId});
        
        console.log("@@ input=", $($(v).find('input')[0]));
        
/*        p = {
        ID: k
        Status: ""
        name: []
        description: "Москва, Юго-западная"
        lat: "55.6624"
        lng: "37.4838"
        dist: "1.57"
        color: "#ff8866"
        time: ""
        'Название станции': "Юго-западная"
        }
*/

    }); 

    glob_gpx[setName].points = points;
    
//    gpxPointsToTable(glob_gpx[setName],setName);

console.log("@@ updatePointOrderInGlobalGpx= n", glob_gpx[setName].points, glbp, points);

//    id = glob_gpx.findIndex(x => x.name === n[0]);

//    glob_gpx[setName].points[pos].lat = lat;
//    glob_gpx[setName].points[pos].lng = lng;

}


function updateTotalDist(mname)
{
//    console.log("@@ updateTotalDist=",mname);
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
    
    
    point_id = ob.idx  ;
    
    trCont = $("tr[id='"+point_id+"']");

//    console.log("@@markerClik", trCont, ob.m.gpx_id, ob);

    
    trCont.addClass(); 
    $('.rowselect').toggleClass('rowselect');
    trCont.toggleClass('rowselect');
//    $("body").scrollTo(tdgeos);
    
    gpxPoinsTableSlide(ob.m.gpx_id); 
    
    }

function gpxPoinsTableSlide(id)
{ 
    var frame = $("#left_panel"); // The ".test" parent element
    
    console.log("@@ TableSlide id=",id);
    
    frame.animate({
        scrollTop: $("[gpx_id='"+id+"']").offset().top + frame.scrollTop() -5
      }, 300);
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
    
   map.overlayMapTypes.insertAt( 0, new CoordMapType(new google.maps.Size(256, 256)));
      
   google.maps.event.addListener(map,'zoom_changed',function(){
         $('#zoom_info').html(this.getZoom());
         
         ifMapChanged();

//         rect.setMap(null);

      });


   google.maps.event.addListener(map,'center_changed',function(){
         ifMapChanged();
      });

  
   google.maps.event.addListener(map,'click',function(e){ // select div rectangle on map
        
        int_latlng = {lat:e.latLng.lat(),lng:e.latLng.lng()};

        var b=MERCATOR.getTileBounds(MERCATOR.getTileAtLatLng(int_latlng,this.getZoom()));
        
        checkCacheMultyZoomBySQL(int_latlng, this.getZoom(),6)

//        cacheMap(b,this.getZoom(),2);
        
//       rect.setOptions({bounds:new google.maps.LatLngBounds(new google.maps.LatLng(b.sw.lat,b.sw.lng),new google.maps.LatLng(b.ne.lat,b.ne.lng)),
//                      map:map});

      });
  
   var controlDiv =$("#floating-panel");
   controlDiv.index = 1;
   
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv[0]);
   
//   console.log ("@@ map.controls=", map.controls[google.maps.ControlPosition.TOP_RIGHT]);
    
}





// ************* карта покрытия *********************
function cacheMap(b, z = 10,z_depth = 2){
    
  console.log("@@ cacheMap(): ",b,z,z_depth);
    
    var l_lat;
    var l_lng;
    
    
    
    for (layer_zoom = z; layer_zoom <= z+z_depth; layer_zoom++ )
    {
    
    cells = Math.pow(2,layer_zoom-z);
    
    lat_delt = (b.ne.lat - b.sw.lat ) / cells ;
    lng_delt = (b.ne.lng - b.sw.lng ) / cells ;
    

            
        for (l_lat = b.sw.lat+lat_delt/2; l_lat < b.ne.lat-lat_delt/4; l_lat+= lat_delt  )          
        {
//            for (l_lng = b.sw.lng+lng_delt/4; l_lng < b.ne.lng-lng_delt/4; l_lng+= lng_delt  )
        
        l_lng = b.sw.lng + lng_delt/3;
          
            while ( l_lng < b.ne.lng-lng_delt/4 )          
            {   
//                console.log("@@ b_depth", i, z, l_lat, l_lng,"\n coord=" ,coord, srcImage);
//                code = UrlExists(srcImage) ;
//                console.log('@@ UrlExists(srcImage) =', code);

//             checkByFiles ({lat:l_lat,lng:l_lng},layer_zoom)
             checkBySQL ({lat:l_lat,lng:l_lng},layer_zoom+1)
             
                             
            l_lng+= lng_delt;
        
            } // lng                    
        } // end lat                          
    } // end z
        
}


  


function checkByFiles (latlng,layer_zoom)
{
        coord = MERCATOR.getTileAtLatLng(latlng, layer_zoom);

        var srcImage  = 'http://msp.opendatahub.ru/gpx/img_cache/'+ layer_zoom + '/'+coord.x+'/'+coord.y+'.png';
         
       console.log("layer_zoom=",srcImage);
            
    
        $.ajax({
        url: srcImage,
        async : false, 
        type: 'HEAD',
        error: function(XMLHttpRequest, textStatus, errorThrown){
//                           console.log('@@ status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText +'\n' +srcImage);
        },
        success: function(data){
                    

//                    coord = MERCATOR.getTileAtLatLng(latlng, zoom_w_depth);
                    r_idx = layer_zoom + '_'+coord.x+'_'+coord.y; 

console.log("\nOK: ************\n@@ b_depth[",r_idx,"]\n",layer_zoom, latlng,"\n coord=" ,coord, srcImage);
                    
                    
                    cache_area[r_idx]=new google.maps.Rectangle({
                            strokeColor: '#888',
                            strokeWeight: 1,
                            strokeOpacity: (layer_zoom)/24,
//                            strokeColor: clr_r[layer_zoom%8],
//                            fillColor: clr_r[layer_zoom%8],
                            strokeColor: 'gray',
                            fillColor: 'red',
                            fillOpacity: 0
                            })
    
                    var b2=MERCATOR.getTileBounds(MERCATOR.getTileAtLatLng(latlng,layer_zoom));
    
                    cache_area[r_idx].setOptions({bounds:new google.maps.LatLngBounds(
                                new google.maps.LatLng(b2.sw.lat,b2.sw.lng),
                                new google.maps.LatLng(b2.ne.lat, b2.ne.lng)),
    //                              new google.maps.LatLng(b2.ne.lat,b2.ne.lng)),
                                map:map});
        
        
        }
    });                                

    
}


 
 
 function drawCacheArea(z,x,y)
 {

    r_idx = z+"_"+x+"_"+y;

//    console.log("@@@ drawCacheArea z,x,y=",z,x,y, cache_area[r_idx]);
    
    
    
    if (typeof cache_area[r_idx] == 'undefined')
    {
        
    hmk = ((z>8)?z-9:0)/7;
        
    cache_area[r_idx]=new google.maps.Rectangle({
//            fillColor: clr_r[z%8],
//            fillColor: clr_r[z%8],
//            fillColor: 'red',
//            strokeWeight: hmk*1.5 + 0.2,
            strokeWeight: 1,
//            strokeOpacity: Math.pow(2,z)/Math.pow(2,16),
            strokeOpacity: Math.pow(z,2)/Math.pow(16,2.5),
//            strokeColor: clr_r[z%8],
            strokeColor: heatMapColorforValue( hmk ),
            fillOpacity: 0
            })



    var b2=MERCATOR.getTileBounds({x:x,y:y,z:z});
    
    swlat = b2.sw.lat;
    swlng = b2.sw.lng;
    nelat = b2.ne.lat;
    nelng = b2.ne.lng;

//    frame = 400000/Math.pow(1.9,z);
    
//    frame = Math.pow(0.1,(17-z));
    frame = (z * Math.pow(2.4,z))/Math.pow(10,8);
    
    
    dlt = (b2.ne.lat - b2.sw.lat)*frame;
    dlg = (b2.ne.lng - b2.sw.lng)*frame;
    
//    console.log("@@ dlt",dlt)
    
    swlat = b2.sw.lat+dlt;
    swlng = b2.sw.lng+dlg;
    nelat = b2.ne.lat-dlt;
    nelng = b2.ne.lng-dlg;

    
    cache_area[r_idx].setOptions({bounds:new google.maps.LatLngBounds(
                new google.maps.LatLng(swlat,swlng),
                new google.maps.LatLng(nelat, nelng)),
//                              new google.maps.LatLng(b2.ne.lat,b2.ne.lng)),
                map:map});
     }    
} // end drawCacheArea

 
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

function updateGeoInTable(m,lat,lng)
{
//    tdgeos = $('.datasets td:contains('+addr+')').parent("tr").find("td").slice(4,7)
//    row = $("#")
    rselect = 'tr[gpx_id="'+m.m.gpx_id+'"]';
    
    tdgeos = $(rselect).find("td").slice(4,7)

    console.log("@@ tdgeos", m, rselect  ,tdgeos);

    tdgeos.addClass('modified_geo');
    
    $(tdgeos[0]).text(lat);
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


function drawPath() {
    
    if (polyline) polyline.setMap(null);

    console.log ("@@ drawPath path_points", globalSettings.pathOnOff.on, polyline);
    
    if ( !globalSettings.pathOnOff.on) return;
    
    chkd = $("[gpx_id] input:checked");
    
    path_points = chkd.map(function(i,e) {

         v = e.closest('tr');
         name = $(v).find("td:eq(2)").text();
         lat = $(v).find("td:eq(4)").text(); // переделать на global_gpx
         lng = $(v).find("td:eq(5)").text();   
         
//       console.log("@@@ lat,lng  ",name, lat,lng);
         
         var latLng = new google.maps.LatLng(lat,lng);
         return latLng ;
      }).get();
    
// Create a new chart in the elevation_chart DIV.
// chart = new google.visualization.ColumnChart(document.getElementById('elevation-chart'));
    chart = new google.visualization.AreaChart(document.getElementById('elevation-chart'));

    var path = path_points.slice(1);
    
    // Create a PathElevationRequest object using this array.
    // Ask for 256 samples along that path.

    samp = Math.floor(($(window).width()-500)/4)
    
//    console.log("@@@ samp ", samp)
    
    var pathRequest = {
        'path': path_points,
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
      strokeWeight: 2,
      strokeColor: '#2255cc',
      strokeOpacity: 0.75,
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
        
        while(el_markers.length) { el_markers.pop().setMap(null); 
//             base_dist.setMap(null);   
             }
        
        var elev = elevations[e.row].elevation.toFixed(0); 
        
        var image1 = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23ff8080%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + elev + '%3C%2Ftext%3E%3C%2Fsvg%3E';
        
        var image = '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">\
        <path fill="#ff4040" stroke="#ccc" stroke-width=".5" \
        d="M34.305 16.234c0 8.83-15.148 19.158-15.148 19.158S3.507 25.065 3.507 16.1c0-8.505 6.894-14.304 15.4-14.304 8.504 0 15.398 5.933 15.398 14.438z"/>\
        <text transform="translate(19 18.5)" fill="#fff" style="font-family: Arial, sans-serif;font-weight:bold;text-align:center;" font-size="12" text-anchor="middle">' + elev + '</text></svg>';
        
        image = 'data:image/svg+xml,' + encodeURIComponent(image);

//      console.log("@@ image1, image", image1, image);
        
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
        
//      map.panTo(pos);

        
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
    console.log("@@@ resize", $('elevation-chart').length);
    if ($('elevation-chart').length)
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
        console.log("@@@ updateIndex",e, ui);

        [setName,pointName,pos] = $(ui.item[0]).attr('gpx_id').split('|');
        
        updatePointOrderInGlobalGpx(setName); 
                
        drawPath();
        
        $('td.index', ui.item.parent()).each(function (i) {
            $(this).html(i + 1);
        });
    },
 updatePath = function(e, ui) {
    };



CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {

    var tile=MERCATOR.normalizeTile({x:coord.x,y:coord.y,z:zoom}),
    tileBounds=MERCATOR.getTileBounds(tile);
    
    var div = ownerDocument.createElement('div');
    
      switch ( dinfo )
      {
        case '1' : tile_html = "<div style='background-color:rgba(255,255,255,0.75); width:100px;'>"+zoom+','+tile.x+','+tile.y+"</div>";
                break;    
        case '2' : tile_html = "<div style='background-color:rgba(255,255,255,0.75); font-size:15px; color:blue; width:100px;'>"
                                +zoom+','
                                +tile.x+','
                                +tile.y+'<br />'
                                + tileBounds.ne.lat.toFixed(4)+','
                                + tileBounds.ne.lng.toFixed(4)+','
                                +"</div>";
                break;
        default:        
                tile_html = "-";
      }
       
      div.innerHTML = tile_html;
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.className = 'heatmapdiv';
      div.style.fontSize = '10';
      div.style.borderStyle = 'solid';
      div.style.borderWidth = '1px';
      div.style.borderColor = '#AAAAAA';
      div.style.opacity =hmOpacity;

  
  if (zoom<17)
  {
    //srcImage  = 'http://msp.opendatahub.ru/gpx/strava.php?z='+zoom+'&x='+tile.x+'&y='+tile.y;
    //  srcImage  = 'http://msp.opendatahub.ru/gpx/strava.php?z='+zoom+'&x='+tile.x+'&y='+tile.y;
    
    // AnyGis  
      srcImage  = 'https://anygis.ru/api/v1/Tracks_Strava_All/'+tile.x+'/'+tile.y+'/'+zoom;
    
    // ODH cache
      srcImage  = 'http://msp.opendatahub.ru/gpx/img_cache/'+zoom+'/'+tile.x+'/'+tile.y+'.png';
    
    // ODH strava
      srcImage  = srcImageStrava  = 'http://msp.opendatahub.ru/gpx/strava.php?z='+zoom+'&x='+tile.x+'&y='+tile.y;

      div.style.backgroundImage = "url('"+srcImage+"')";


    //var filename = document.location.href.replace(/^.*[\\\/]/, '')
    //console.log("@@ document.location.href", tileBounds );
      $.get(srcImageStrava)
            .done(function() { 
    //              srcImage  = 'http://msp.opendatahub.ru/gpx/strava.php?z='+zoom+'&x='+tile.x+'&y='+tile.y;
    //              srcImage  = 'http://msp.opendatahub.ru/gpx/img_cache/'+zoom+'/'+tile.x+'/'+tile.y+'.png';
    //              div.style.backgroundImage = "url('"+srcImage+"')";
    //              div.innerHTML =srcImage;
    
          }).fail(function() { 
    //              srcImage  = 'http://msp.opendatahub.ru/gpx/strava.php?z='+zoom+'&x='+tile.x+'&y='+tile.y;
    //              div.style.backgroundImage = "url('"+srcImage+"')";
            });
        
    
    
  }
  else
  {
    
  }
  


  return div;
};





$( function() {
$( "#slider_transperency" ).slider(
    {
      orientation: "horizontal",
      range: "min",
      max: 100,
      value: hmOpacity*100,
      slide: refreshTrans,
      change: refreshTrans
    });
 $('span.ui-slider-handle').css({'display': 'inline-block'})
                                   .html("<div>"+hmOpacity*100+"</div>"); 
                                   
});

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

   ifMapChanged();                                 

}

toggle = function(s=1) {
    $("div.heatmapdiv").toggle();
    $('#toggleHM').val( $('#toggleHM').val() == "Show HM" ? "Hide HM" : "Show HM");  
//    console.log("@@ toggle v=", $('#toggleHM').val() );
};

function ifMapChanged() 
{       
//    return; 
//        console.log("@@ map",map);
         c = map.getCenter();   
         location_search = c.lat().toFixed(3)+','
                    + c.lng().toFixed(3)
                    +','+ map.getZoom()
                    +','+ hmOpacity
                    +','+ dinfo;   
            
         href = window.location.origin+"/gpx/#"+location_search; 
//         console.log("@@ href ", href );
         window.location.href = href;
         $.cookie('hash', '#'+location_search);
         
//         console.log("@@ location_search", location_search);

// Read the cookie

} //*** ifMapChanged()



// 2020-01-17 get stat by group 
console.log("@@ init gps.js");

function getCacheStat(i)
    {
        console.log("@@ getCacheStat",i);
        
    $.ajax
        ({
            type: "POST",
            dataType : 'json',
            async: false,
            url: 'act.php',
            data: { get_cache_stat: i, depth: 10},
            success: function (d) {
                updateIntCols(d);
            },
            failure: function() {alert("Error!");}
        });

    }

function updateIntCols(d)
{

console.log ('updateIntCols', d);
    
    colors = $(Object.keys( d['colors'] )).map(function (k,v) {return v.substring(1);} );
    console.log("colors",colors);
    max_r = d['max_cnt'];

    console.log("@@ maxRow", max_r);

    
    $('.by_int').map (function(k,v)
    {   
    var svg = "<svg height='2' width='400'></svg><br />";
    
//    var maxRow = d['groups'].map(function(row){ 
//        return Math.max.apply(Math, Object.values(row).map(function(c){return c['cnt'];})); });
        
//    max_cnt = Math.max.apply(Math, maxRow);
    
//        delete d['ranges']['0rgb(200, 200, 200)'];

        
        $.each(d['ranges'],function (kk,vv) {
            
                h = w = 35;
                
                if (typeof d['groups'][k] != 'undefined' && typeof d['groups'][k][kk] != 'undefined' )
                 {
                    c = d['groups'][k][kk]['cnt'];
                    s = d['groups'][k][kk]['s'];
                    
                    svg_r = h/2.1 * Math.pow (c/max_r,1/2) +1 //2;
                    
                    svg = svg+ `<svg height="${h}" width="${w}">\
                                    <title>${c}\n${s}\n${kk}</title>\
                                    <circle cy="${h/2}" cx="${w/2}" r="${svg_r}" \
                                    stroke-width="0" fill="${colors[kk.substring(0,1)-1]}" /> \
                                 </svg>`;
//                    svg = svg+"["+d['groups'][k][kk]['cnt']+"]";
                 }   
                else  
                {   
                    svg = svg+`<svg height='${h}' width='${w}'>\
                                    <circle cx='${h/2}' cy='${w/2}' r='2' \
                                    stroke='black' stroke-width='0' fill='lightgray' />\
                                </svg>`;
                }                    
        });
        
        $(v).html(svg);
    });
    
}    

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}
    
// Секция для обработки кнопок тулбара

function cacheOnOff()
{
    if (globalSettings.cacheOnOff.on) checkCacheMultyZoomBySQL(map.getCenter(),map.getZoom()-3,6);
    else clear_cache();
}


function checkCacheMultyZoomBySQL (latlng, zoom, z_depth)
{
        coord = MERCATOR.getTileAtLatLng(latlng, zoom);
        
        var request_data = 
        { get_cache_list: 1, 
            z_depth: z_depth,
            z: zoom,
//            x: coord.x,
//            y: coord.y,
            lat: latlng.lat,
            lng: latlng.lng
           };

// console.log ("@@ request_data",latlng,request_data );
        
        $.ajax
            ({
                type: "POST",
                dataType : 'json',
                async: false,
                url: 'act.php',
                data: request_data,
                success: function (d) {
//                    console.log("@@ data = ", d);
                    
                    $.each(d.tiles, function(k,v){
                    $.each(v, function(kk,vv){
                    $.each(vv, function(kkk,vvv){
//                        console.log("@@  k,kk,kkk =",k,kk,vvv);
                        drawCacheArea(k,kk,vvv);
                    });
                    });
                    });
                    
                },
                failure: function() {alert("Error!");}
            });

 } // end checkBySQL



function clear_cache()
{
    
    break_cnt = 0; 
    
    $.each(cache_area, function (k,v) {
        v.setMap(null);
        delete cache_area[k];
    });
}

// >>>> Секция для обработки кнопок тулбара    
// ****************  helpers *******************

function heatMapColorforValue(value){

/*  
0    : blue   (hsl(240, 100%, 50%))
0.25 : cyan   (hsl(180, 100%, 50%))
0.5  : green  (hsl(120, 100%, 50%))
0.75 : yellow (hsl(60, 100%, 50%))
1    : red    (hsl(0, 100%, 50%))
*/  
  
  var h = (1 - value) * 280 + 5
  return "hsl(" + h + ", 100%, 40%)";
}


function show_cache_legend()
{   
    dv = "";
    
    for (i=0;i<=16;i++)
    {
        dv = dv+"<div style='background-color:"+heatMapColorforValue(i/16)+"'>"+i+"</div>";
    }
    
    
    $('.buttons_panel').append("<br /><br /><div class=legend>"+dv+"</div>");
};

function gpxexec(proc)
{
    $(proc).each(function(k,v){
        console.log ("@@ gpxexec", k,v );
        eval(v+"()");
    }) ;  
}

    