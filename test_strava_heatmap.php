<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Showing/Hiding Overlays</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
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
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCqtLzdiGvGIu85wF1C7w4UKdUncnwgF0M"></script>
    <script>
      // This example adds hide() and show() methods to a custom overlay's prototype.
      // These methods toggle the visibility of the container <div>.
      // Additionally, we add a toggleDOM() method, which attaches or detaches the
      // overlay to or from the map.

      var overlay;
      var mapBounds;
      var map;

      USGSOverlay.prototype = new google.maps.OverlayView();
      
      var center = {lat: 55.75, lng: 37.509291}
      var TILE_SIZE = 256;
        
        
      function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: center,
          mapTypeId: 'satellite'
        });
        
        google.maps.event.addListener(map, 'zoom_changed', function() {
            var zoomLevel = map.getZoom();
            addTiles (map);
        });

        google.maps.event.addListener(map, 'center_changed', function() {
            var zoomLevel = map.getZoom();
            addTiles (map);
        });
        
        google.maps.event.addListener(map, 'bounds_changed', function() {
            console.log("@@ *** bounds_changed");
            addTiles (map);
        });

        mapBounds = map.getBounds()
        
        addTiles (map);
      }

      function addTiles (map)  {
        
//       tile_center = center  

//       console.log("@@ 111 ",map.getBounds());
           
       tile_center = {'lat':map.getCenter().lat(),'lng':map.getCenter().lng()};
       
       neLat=map.getBounds().getNorthEast().lat(); 
       neLng=map.getBounds().getNorthEast().lng(); 

       swLat=map.getBounds().getSouthWest().lat(); 
       swLng=map.getBounds().getSouthWest().lng();
       
       

//       console.log("@@ tile centr 2=", tile_center);
        
        var worldCoordinate = project(new google.maps.LatLng(neLat, swLng));
        
        addPin(map.getBounds().getSouthWest(),"FE7569")
        addPin(map.getBounds().getNorthEast(),"75FE69")
        
        var zoom = map.getZoom();
        var scale = 1 << zoom;
        
        for (dx=0;dx < 2; dx++)
            { 
                tileCx = Math.floor((worldCoordinate.x) * scale / TILE_SIZE) + dx;
                tileCy = Math.floor((worldCoordinate.y) * scale / TILE_SIZE) + dx;
                
                var tileCoordinate = new google.maps.Point(tileCx,tileCy);
                var tileCoordinate2 = new google.maps.Point(tileCx,tileCy);
                
                var bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(tileCoordinate.lat, tileCoordinate.lng),
                    new google.maps.LatLng(tileCoordinate2.lat, tileCoordinate2.lng) 
                    );
                
                var bounds1 = new google.maps.LatLngBounds(
                    new google.maps.LatLng(neLat, swLng),
                    new google.maps.LatLng(neLat+1, swLng+1) 
                    );

                var getPrjn = map.getProjection(); // *** .fromPointToLatLng()
        
                // The photograph is courtesy of the U.S. Geological Survey.
                srcImage  = 'https://heatmap-external-a.strava.com/tiles/ride/hot/'+zoom+'/'+tileCoordinate.x+'/'+tileCoordinate.y+'.png';
                srcImage  = 'https://anygis.ru/api/v1/Tracks_Strava_All/'+tileCoordinate.x+'/'+tileCoordinate.y+'/'+zoom;
                
                if ( typeof(overlay) == 'object' ){ overlay.setMap(null); }    
                
                overlay = new USGSOverlay(bounds, srcImage, map);
                console.warn("@@ ***************** \ntileCoordinate dx=%s\n getPrjn=%s\n tileCoordinate=%o\n zoom=%s\n scale=%o\n worldCoordinate=%o\n srcImage=%s\n bounds=%o\n bounds1=%o\n", 
                dx, getPrjn, tileCoordinate, zoom, scale, worldCoordinate , srcImage, bounds, bounds1);
            }
        }

function addPin(latlng, pinColor="FE7569")
{
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));
    
//    console.log("\n\n@@ *** addPin",latlng);
   
    var marker = new google.maps.Marker({
        position: {lat:latlng.lat(),lng:latlng.lng()},
        map: map,
        icon:pinImage,
        title: Math.round(latlng.lat()*100)/100 + ", " + Math.round(latlng.lng()*100)/100
      }); 

}


      /** @constructor */
      function USGSOverlay(bounds, image, map) {

        // Now initialize all properties.
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay
        this.setMap(map);
      }

      /**
       * onAdd is called when the map's panes are ready and the overlay has been
       * added to the map.
       */
      USGSOverlay.prototype.onAdd = function() {

        var div = document.createElement('div');
        div.style.border = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayImage" pane.
        var panes = this.getPanes();
        panes.overlayImage.appendChild(this.div_);
      };

      USGSOverlay.prototype.draw = function() {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
      };

      USGSOverlay.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
      };

      // Set the visibility to 'hidden' or 'visible'.
      USGSOverlay.prototype.hide = function() {
        if (this.div_) {
          // The visibility property must be a string enclosed in quotes.
          this.div_.style.visibility = 'hidden';
        }
      };

      USGSOverlay.prototype.show = function() {
        if (this.div_) {
          this.div_.style.visibility = 'visible';
        }
      };

      USGSOverlay.prototype.toggle = function() {
        if (this.div_) {
          if (this.div_.style.visibility === 'hidden') {
            this.show();
          } else {
            this.hide();
          }
        }
      };

      // Detach the map from the DOM via toggleDOM().
      // Note that if we later reattach the map, it will be visible again,
      // because the containing <div> is recreated in the overlay's onAdd() method.
      USGSOverlay.prototype.toggleDOM = function() {
        if (this.getMap()) {
          // Note: setMap(null) calls OverlayView.onRemove()
          this.setMap(null);
        } else {
          this.setMap(this.map_);
        }
      };

        function project(latLng) {
                var siny = Math.sin(latLng.lat() * Math.PI / 180);
        
                // Truncating to 0.9999 effectively limits latitude to 89.189. This is
                // about a third of a tile past the edge of the world tile.
                siny = Math.min(Math.max(siny, -0.9999), 0.9999);
        
                return new google.maps.Point(
                    TILE_SIZE * (0.5 + latLng.lng() / 360),
                    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
              }
      google.maps.event.addDomListener(window, 'load', initMap);




  </script>
  </head>
  <body>
<!-- Add an input button to initiate the toggle method on the overlay. -->
    <div id="floating-panel">
      <input type="button" value="Toggle visibility" onclick="overlay.toggle();"/>
      <input type="button" value="Toggle DOM attachment" onclick="overlay.toggleDOM();"/>
    </div>
    <div id="map"></div>
  </body>
</html>