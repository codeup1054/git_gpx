    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M"></script>


<style>
  html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
      pre{ background:#fff; opacity:.4 }
      
 #floating-panel {
        position: absolute;
        top: 10px;
        left: 25%;
        z-index: 5;
        background-color: #fff;
        padding: 5px;
        border: 1px solid #999;
        text-align: center;
        font-family: 'Roboto','sans-serif';
        line-height: 30px;
        padding-left: 10px;
      }      
      
</style>

<div id="floating-panel">
      <input id='toggleHM' type="button" value="Hide HM" onclick="toggle();"></input>
      <div id="slider_transperency"></div>
 </div>

  <script>
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
            hmOpacity = tval/100;
            $('div.heatmapdiv').css({ opacity: hmOpacity });
//            $("#slider_transperency" ).find(".ui-slider-handle").text(tval);
            $('span.ui-slider-handle').css({'padding':'0px', 'display': 'inline-block'})
                                       .html("<div style='font-size:9px; text-align:center; top:0px; heigth:10px; padding:3px; line-height: 150%; border:0px solid red;'>"+tval+"</div>");
 //           console.log("@@ tval",tval );    
  }
  
  toggle = function() {
    
    $("div.heatmapdiv").toggle();
    
    el = $('#toggleHM');
    el.val( el.val() == "Show HM" ? "Hide HM" : "Show HM");  
    
    console.log("toggle v=", el.val() );
    
  };

  
   
  </script>


<div id="map-canvas"></div>



<script>
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

/** @constructor */
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

var map;
var hmOpacity = 0.5;
    

function initialize() {
  var mapOptions = {
    zoom: 13,
    mapTypeId: 'satellite',
    center: new google.maps.LatLng(55.65,37.50)
  };
  
  map = new google.maps.Map(document.getElementById('map-canvas'),
                                    mapOptions);
     r=new google.maps.Rectangle()
  // Insert this overlay map type as the first overlay map type at
  // position 0. Note that all overlay map types appear on top of
  // their parent base map.
 map.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(256, 256)));

 google.maps.event.addListener(map,'click',function(e){
        var b=MERCATOR.getTileBounds(MERCATOR.getTileAtLatLng({lat:e.latLng.lat(),lng:e.latLng.lng()},this.getZoom()));
        r.setOptions({bounds:new google.maps.LatLngBounds(new google.maps.LatLng(b.sw.lat,b.sw.lng),new google.maps.LatLng(b.ne.lat,b.ne.lng)),
                      map:map})
      });
      google.maps.event.addListener(map,'zoom_changed',function(){
         r.setMap(null);
      });
}

google.maps.event.addDomListener(window, 'load', initialize);



</script>