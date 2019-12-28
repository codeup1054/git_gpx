var glob_gpx = [];
var gpx_line = [];
var deferreds = [];
tm();


function makeApiCall(action) {
  switch (action)
      {
      case "get_sheets_names":
            sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheets = sheet_metadata.get('sheets', '')
            title = sheets[0].get("properties", {}).get("title", "Sheet1")
            sheet_id = sheets[0].get("properties", {}).get("sheetId", 0)
            break; 

      case "save_json":  
            json_gpx = JSON.stringify(glob_gpx);
            json_gpx2 = JSON.stringify( [{ uno: 1, Ленинград: 2 }] );
            console.log("@@ gpx", glob_gpx );
            
            $.ajax
                ({
                    type: "POST",
                    dataType : 'json',
                    async: false,
                    url: 'act.php',
                    data: { data: json_gpx },
                    success: function () {alert("Thanks!"); },
                    failure: function() {alert("Error!");}
                });
            
            break; 

      case "read_json":          
            gpxFromJson();
            break; 
      
      case "read_google":  
            gpxFromGoogle();
            break; 


      case "save_google":  

            $("[type=checkbox]:checked").each(function(){

              var vals = new Array();
               ds = $(this).attr('id');
               trs = $('.wp_panel.'+ds+" tr" )
               row = 0;
               
               $(trs).each(function(k,tr) {
                       t = $(tr).children("td").map(function(ek,ev){ return $(ev).text()}).get(); 
                       vals[row++] = t;
                   });
                
              var params = {
                spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.
                range: ds+'!A1:J'+vals.length,  // TODO: Update placeholder value.
                valueInputOption: 'RAW',  // TODO: Update placeholder value.
              };
        
              var valueRangeBody = {"values": vals };
        
              var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
              request.then(function(response) {
                // TODO: Change code below to process the `response` object:
                console.log(response.result);
              }, function(reason) {
                console.error('error: ' + reason.result.error.message);
              });        
               
              }); // $(".checkbox.active").each
            break;
      
      default:
//            gpxFromJson();     
            gpxFromGoogle();
      }
  } // make call API    


function gpxFromJson()  
{           
            glob_gpx = [];
            tm('start read JSON');
            $.get({ url: 'data/gpx.json', cache: false },function(data) {
                   console.log("@@ read_json ",data);
                   glob_gpx = data;
                   gpxSetNamesToTable(data);
                });
            tm('end read JSON');
}


function gpxSetNamesToTable(gpx_names)
{   
    $(".datasetcheckbox").html("");

    console.log("@@ names ", gpx_names) 
    
    $.each(gpx_names, function (k,v)
     {
//       console.log("@@ names each", v, v.name); onclick='updateMarkersOnMap(this.id)
       $(".datasetcheckbox").append("<div class='checkbox_field' >\
        <div check="+v.name+"><input type=checkbox id='"+v.name+
            "' onchange='gpxSetCheck(this.id)'>" +
        "<label for='"+v.name+"'><gpx_total>("+v.points.length+") </gpx_total>"+v.name+"</label></div></div>");
        gpxPointsToTable(v,k);
     });
}

function isLat(lat) {  return isFinite(lat) && Math.abs(lat) <= 90; }
function isLon(lng) {  return isFinite(lng) && Math.abs(lng) <= 180; }


function gpxSetCheck(id)
{
    console.log('@@ gpxSetCheck',id);
    updateMarkersOnMap(id);
}



function gpsUpdateSetType(sel)
{   
    setId = $(sel).attr('set_id');

    glob_gpx[setId].meta.type = $(sel).val();

    console.log("@@ gpsUpdateSetType", glob_gpx);
}

function gpxPointsToTable(v,id)
 {
//    console.log("@@ gpxPointsToTable",points);
    
/*
0: {ID: "ID"}
1: {Status: "Status"}
2: {name: "name"}
3: {description: "description"}
4: {lat: "lat"}
5: {lng: "lng"}
6: {dist: "dist"}
7: {color: "color"}
8: {time: "time"}
9: {Название станции: "Название станции"}
*/  

    points = v.points; 
    setName = v.name;
    
    options = ['path','poi'].map(function(x) { return "<option "+ ((v.meta.type == x )? "selected":"")+">"+x+"</option>"; } ).join("")
    
//    console.log("@@ type options", options );
    
    setInfo = "<table class=stab>"+
              "<tr><td>Набор:</td><td><input value='"+v.name+"'></input></td></tr>"+
              "<tr><td>Тип:</td><td><select set_name='"+v.name+"' set_id='"+id+"' onchange='gpsUpdateSetType(this);' >"+options+"</select></td></tr>"+
              "</table>";
    
    row = "<tr class='header'><td> </td>" +
                  "<td class='hide'>Название</td>" +        
                  "<td>Наименование</td>"+        
                  "<td geo>Описание</td>"+        
                  "<td>Широта</td>"+        
                  "<td>Долгота</td>"+
                  "<td>До базы</td>"+
                  "<td class='hide'>Цвет</td>"+ // color
                  "<td>Расстояния</td>"+
                  "</tr>";
  
    hide = (setName != '1Мещ-Сколково')?"":"hide";
  
    $(".datasets").append("<div class='wp_panel "+hide+" "+setName+"'>"+ setInfo +"<table class='tab' dataset='"+setName+"'></table><div>");

  
    $.each(points, function( k,v)
        {   
//            if(k == 0) { continue;}
//            console.log("@@ eachGPX ", v );
            tdist_html = 0;
            dist_total = 0;
//          remask = '^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$';
            
         if ( typeof o_lat !== 'undefined' || ( isLat( v.lat ) && isLon( v.lng) ) )
            {
                dist_next = getDistanceFromLatLonInKm(v.lat, v.lng, o_lat, o_lng);
//                console.log("@@ cells", cels[r][4], cels[r][5], cels[r-1][4],cels[r-1][5]);
                dist_total += isNaN(dist_next)? 0: dist_next; // добавляем если число  
                tdist_html = dist_total.toFixed(2)+"<sup>+"+dist_next+"</sup>"; 
            } 
            
            o_lat = v.lat;  
            o_lng = v.lng;  
           
//continue;
            
            row += "<tr class='"+k+"'><td>"+k+"</td>" +
                  "<td class='hide'>"+v.name+"</td>" +        
                  "<td>"+v.name+"</td>"+        
                  "<td geo>"+v.description+"</td>"+        
                  "<td>"+v.lat+"</td>"+        
                  "<td>"+v.lng+"</td>"+
                  "<td>"+v.dist+"</td>"+
                  "<td class='hide'>"+v.color+"</td>"+ // color
                  "<td>"+  tdist_html  +"</td>"+
                  "</tr>";
        });
        
        $("label[for='"+setName+"'] gpx_total").text("("+ points.length +") ");
        $("[dataset ="+setName+"]").append(row);

        tm("addToTable"+setName)
        
        $(".tab tbody").sortable({
                helper: fixHelperModified,
                stop: updateIndex,
                cancel: '[contenteditable]',
        })//.disableSelection();
    }



function gpxFromGoogle() {     
      var params = {
        // The spreadsheet to request.
        spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.

        // The ranges to retrieve from the spreadsheet.
        ranges: [],  // TODO: Update placeholder value.

        // True if grid data should be returned.
        // This parameter is ignored if a field mask was set in the request.
        includeGridData: false,  // TODO: Update placeholder value.
      };

      var request = gapi.client.sheets.spreadsheets.get(params);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
      shetsNames = $(response.result.sheets).map(function (k,v) {
            
            if (v.properties.title[0] != "~" ) return v.properties.title; 
            
        }).get();

        $(".datasetcheckbox").html("<div class='checkbox_field'>\
            <div check=all><input type=checkbox id='all' onchange='updateMarkersOnMap(this.id)'>" +
                    "<label for='all'>Все</label></div></div>");

//        console.log("@@@ shnames", shetsNames);
//        shetsNames.sort();
        
        tm('start load');        
        
        
        
        $(shetsNames).each(function(k,v){
           
           $(".datasetcheckbox").append("<div class='checkbox_field'>\
                <div check="+v+"><input type=checkbox id='"+v+
                    "' onchange='updateMarkersOnMap(this.id)'>" +
                "<label for='"+v+"'><gpx_total></gpx_total>"+v+"</label></div></div>");
//                "<label for='"+v+"'>"+cels.length+"."+v+"</label></div></div>");
            getGoogleGPX(k,v);
            
               
          });

//          console.log("@@ res",glob_gpx);
          
          $.when.apply(deferreds).then(function() {
                // all AJAX calls have complete
//               console.log("@@ gpx=",gpx);
            });


      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      })
    }


    function getGoogleGPX(set_id,sheetName)
    {
        var params = {
            spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.
            range: sheetName+'!A1:J1000',  // TODO: Update placeholder value.
          };
          
        var request = gapi.client.sheets.spreadsheets.values.get(params);
            request.then(function(response) {

//            console.log("@@ sheetName= ", sheetName, response.result)
//            deferreds.push( gpxPointToTable(response.result,sheetName) )
            
//            console.log("response.result.values= ", response.result.values);
            
            col_names=response.result.values[0];
            
            $.each(response.result.values, function(k,v)
            {
//                console.log("response.result.values= ", v  );
                var myArray = $.map(v, function(element, key ) {        // ***
//                       console.log("element, key= ", element, key) 
                       return element.value;                               // ***
                    });
            });
            
            gcols = response.result.values[0]
            geo_set = {};
            points = [];
            
            response.result.values.map(function(v,k){ 
                    
                    p = {}
                    
                    $.each( v , function(kk,vv) { p[gcols[kk]] = vv; } )
                    
                    points.push( p );
                    
                    })
            
             geo_set = {'name': sheetName,
                meta: {type: 'path',
                       descriptin: '',  
                       cdate: '2019-12-26', 
                       mdate: '2019-12-26' 
                       },
                points : points
               } 
            
            glob_gpx.push(geo_set);

            gpxPointsToTable (geo_set,set_id)  // отрисовка таблицы как для JSON    
            
            
//            tm("load data"+sheetName);
//            return response.result;
            return glob_gpx;
                
          }, function(reason) {
            console.error('error: ' + reason.result.error.message);
          }); 
          
          console.log("@@ res",sheetName, glob_gpx);
    
    }

    function initClient() {
      var API_KEY = 'AIzaSyBbtTWVRcUwdDgQbxbhAUU3XTbhxP4NyO0';  // TODO: Update placeholder with desired API key.

      var CLIENT_ID = '608799792412-vd2f3gk4q4dgdhtf1h23utku1vc7b39g.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

      // TODO: Authorize using one of the following scopes:
      //   'https://www.googleapis.com/auth/drive'
      //   'https://www.googleapis.com/auth/drive.file'
      //   'https://www.googleapis.com/auth/spreadsheets'
      var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

      gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        makeApiCall('read');
      }
    }

    function handleSignInClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }
    
    function gpxPointToTable(res,sheetName)
    {   
        var cels = res.values;
        var row = "";
        
        total_points = cels.length;
        dist_next = dist_total = 0;
        
         row = "<tr class='header'><td> </td>" +
                  "<td class='hide'>Название</td>" +        
                  "<td>Наименование</td>"+        
                  "<td geo>Описание</td>"+        
                  "<td>Широта</td>"+        
                  "<td>Долгота</td>"+
                  "<td>До базы</td>"+
                  "<td class='hide'>Цвет</td>"+ // color
                  "<td>Расстояния</td>"+
                  "</tr>";


        for (var r=1; r < total_points; r++)
        {   
            if (cels[r][2] == '') continue;
            
//            console.log("@@ pp ", r );
            
            
            if ( r > 2 )
            {
                dist_next = getDistanceFromLatLonInKm(cels[r][4], cels[r][5], cels[r-1][4],cels[r-1][5]);
//                console.log("@@ cells", cels[r][4], cels[r][5], cels[r-1][4],cels[r-1][5]);
                dist_total += isNaN(dist_next)? 0: dist_next; // добавляем если число  
            } 
            else
            {
            }    

            tdist_html = (r>0) ? dist_total.toFixed(2)+"<sup>+"+dist_next+"</sup>" :"Total"
           
//continue;
            
            row += "<tr class='"+((r)?"":"header")+"'><td>"+cels[r][0]+"</td>" +
                  "<td class='hide'>"+cels[r][1]+"</td>" +        
                  "<td>"+cels[r][2]+"</td>"+        
                  "<td geo>"+cels[r][3]+"</td>"+        
                  "<td>"+cels[r][4]+"</td>"+        
                  "<td>"+cels[r][5]+"</td>"+
                  "<td>"+cels[r][6]+"</td>"+
                  "<td class='hide'>"+cels[r][7]+"</td>"+ // color
                  "<td>"+tdist_html+"</td>"+
                  "</tr>";
        }
        
        $("label[for='"+sheetName+"'] gpx_total").text("("+ cels.length +") ");
        tm(sheetName)
        
        $(".datasets").append("<div class='wp_panel hide "+sheetName+"'><table class='tab' dataset='"+sheetName+"'></table><div>");
        $("[dataset ="+sheetName+"]").append(row);
        
        $(".tab tbody").sortable({
                helper: fixHelperModified,
                stop: updateIndex,
                cancel: '[contenteditable]',
        })//.disableSelection();
    
/*
    var start = document.getElementById('start');
    start.focus();
    start.style.backgroundColor = 'yellow';
    start.style.color = 'magenta';
*/    

/*                
left = 37
up = 38
right = 39
down = 40                
*/                


    document.onkeydown = checkKey;
    
    function checkKey(e) {
        
        e = e || window.event;
        
        el= start || $('.tab').find('td')[0];
        
        console.log("@@ e.keyCode", e.keyCode);
        
        switch (e.keyCode)
        {
         case 13:  
         case 37: el = el.closest('tr').find('td').eq(index).next(); 
                  break;
         case 39: el = el.closest('tr').find('td').eq(index).prev(); 
                  break;
        }
      }
        
        
        $('.tab td').keypress(function(e) {
                var $this = $(this),
                    index = $this.closest('td').index();
                console.log("@@ keypress",index,e.keyCode);
                
                el.css({color:'red'});
                el.attr('contenteditable','true');
                el.focus();
                setTimeout(function() {
                    el.focus();
                }, 0);
                 e.preventDefault();
            });

        
        $(".datasets td").on("click", function(e){
            start = $(this);
            start.focus();

            var self   = $(this),
            
            index  = self.index(),
            text   = self.text();
       
console.log("@@@ table eq()" , text + ' ' + index, start );
        
            if (e.ctrlKey) // description column
            {
            td_val = $(this).text();
                switch(index)
                {
                case 3: geo_result = geocode(td_val);
                        break; 
                
                case 6: td_val = $(this).parent("tr").find("td:eq(4),td:eq(5)")
                        .map(function() {return $(this).text()}).get();
                        
                        $(this).text(getDistanceFromLatLonInKm(td_val[0], td_val[1]));

                        break;
                }         
// console.log("@@@ td [geo]",geo_result);
            $(this).addClass('geocoded');
                
            }


// zoom to clicked marker            

            if (e.altKey) {map.setZoom(13);}

// pan to clicked marker

            $(this).attr('contenteditable','true');
            
            pan_location = $(this).parent("tr")
                 .find("td:eq(4),td:eq(5)")
                 .map(function() {
                 return $(this).text();
              }).get();
            
            lat = pan_location[0];
            lng = pan_location[1];
            
            
            if (e.ctrlKey && index == 1) {
                
                
                url = 'https://maps.googleapis.com/maps/api/elevation/json?locations=' +
                       lat+ ','+ lng + 
                       '&key=AIzaSyBbtTWVRcUwdDgQbxbhAUU3XTbhxP4NyO0';


                console.log ('@@@ altitude url', url);
                
                $.get(url, function( data){
                    console.log ('@@@ altitude', url, data );
                })
                
            }

            var latLng = new google.maps.LatLng(lat,pan_location[1]); 
            map.panTo(latLng);  
            
        })

    } // end gpxPointToTable
    
function updateMarkersOnMap(id)
{
// http://qaru.site/questions/17975/google-maps-api-v3-how-to-remove-all-markers 
    
//    $(".wp_panel").addClass('hide');
    
    while(markers.length) { markers.pop().setMap(null);   }


   if (id == 'all')
   { 
      $("[type=checkbox]").prop('checked', $('[type=checkbox]#all').prop('checked') );
   }

    markersArray = new _markers([]);
    
    $("[type=checkbox]:checked").each(function(){
       
       ds = $(this).attr('id');

    console.log("@@@ updateMarkersOnMap()",ds, $("[type=checkbox]:checked"));
       
//       $(".wp_panel."+ds).toggleClass('hide');
       
//       console.log("@@@checkbox.active",ds);
        
       trs = $('.wp_panel.'+ds+" tr" )
       
//       console.log("@@@ trs", trs);
       
       lat = total_dist = 0
              
       $(trs).each(function(k,tr) {
           
           t = $(tr).children("td").map(function(ek,ev){ return $(ev).text()}); 

           lat = t[4];
           lng = t[5];
           
           
           if (k>1)
           {
            total_dist +=  (k)? getDistanceFromLatLonInKm(lat, lng, olat, olng):0;
//            console.log("@@ k ",total_dist, k, lat, lng, olat, olng);
           }
           else
           {
//            console.log("@@ k 0");
           } 
                                   
           m = { 'name':t[2],
                 'idx':ds+'_'+t[0],
                 'group':ds,
                 'lat':t[4],
                 'lng':t[5],
                 'dist':total_dist,
                 'color':t[7]  
                 };
           
           olat = lat;
           olng = lng;

           markersArray.push(m);
       });
   });
   
  markersArray.addMarkers();
//  drawPath();
//  savegpx();
}    


var start;
var lap;

function tm(s="")
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
}

