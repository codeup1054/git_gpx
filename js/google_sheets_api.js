var gpx = {};
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
        
      case "write":  

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

        $(".datasetcheckbox").append("<div class='checkbox_field'>\
            <div check=all><input type=checkbox id='all' onchange='show(this.id)'>" +
                    "<label for='all'>Все</label></div></div>");

//        console.log("@@@ shnames", shetsNames);
//        shetsNames.sort();
        
        tm('start load');        
        
        $(shetsNames).each(function(k,v){
           
           $(".datasetcheckbox").append("<div class='checkbox_field'>\
                <div check="+v+"><input type=checkbox id='"+v+
                    "' onchange='show(this.id)'>" +
                "<label for='"+v+"'><gpx_total></gpx_total>"+v+"</label></div></div>");
//                "<label for='"+v+"'>"+cels.length+"."+v+"</label></div></div>");
           
          }).promise().done( function(){ 
            
                $(shetsNames).each(function(k,v){
                   cells = getGoogleGPX(v);
//                   console.log("@@ cells=",cells);
                  });
                
            
          } );
        

      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      })
      

    }
}

    function getGoogleGPX(sheetName)
    {
        
        var params = {
            spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.
            range: sheetName+'!A1:J1000',  // TODO: Update placeholder value.
          };
          
        var request = gapi.client.sheets.spreadsheets.values.get(params);
            request.then(function(response) {
                
//            console.log("@@ sheetName= ", sheetName, response.result)
            
            populateSheet(response.result,sheetName)
            
            tm("load data"+sheetName);

            return response.result;
                
          }, function(reason) {
            console.error('error: ' + reason.result.error.message);
          });        
    
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
    
    function populateSheet(res,sheetName)
    {   
        var cels = res.values;
//        console.log("@@@ populateSheet",  v, cels) //,res,v);
        var row = "";
        
        gpx[sheetName]=res.values;
        
        total_points = cels.length;


        dist_total = 0;
        for (var r=0; r < total_points; r++)
        {   
            if (cels[r][2] == '') continue;
            
            pp = (r>1)? cels[r-1].slice(4,6): homeGeo; // если первая считаем расстояние от базы  
            
            //console.log("@@ pp ", r, v, pp, cels[r])
                 
            dist_next = (cels[r][4] && cels[r][5] )? getDistanceFromLatLonInKm(cels[r][4], cels[r][5], pp[0],pp[1]) : "-";
            
            dist_total += isNaN(dist_next)? 0: dist_next; // добавляем если число  
             
            
            row += "<tr class='"+((r)?"":"header")+"'><td>"+cels[r][0]+"</td>"+
                  "<td class='hide'>"+cels[r][1]+"</td>"+        
                  "<td>"+cels[r][2]+"</td>"+        
                  "<td geo>"+cels[r][3]+"</td>"+        
                  "<td>"+cels[r][4]+"</td>"+        
                  "<td>"+cels[r][5]+"</td>"+
                  "<td>"+cels[r][6]+"</td>"+
                  "<td class='hide'>"+cels[r][7]+"</td>"+ // color
                  "<td>"+((r>0) ? ""+dist_total.toFixed(2)+"<sup>+"+dist_next+"</sup>":"")+"</td>"+
                  "</tr>";
        }
        
        $("label[for='"+sheetName+"'] gpx_total").text("("+ cels.length +") ");
        
/*        $(".datasetcheckbox").append("<div class='checkbox_field'>\
            <div check="+sheetName+"><input type=checkbox id='"+sheetName+
                    "' onchange='show(this.id)'>" +
                    "<label for='"+v+"'>"+cels.length+"."+v+"</label></div></div>");
*/
        
        $(".datasets").append("<div class='wp_panel hide "+sheetName+"'><table class='tab' dataset='"+sheetName+"'></table><div>");
        $("[dataset ="+sheetName+"]").append(row);
        
        $(".tab tbody").sortable({
                helper: fixHelperModified,
                stop: updateIndex,
                cancel: '[contenteditable]',
        })//.disableSelection();
        
        $(".datasets td").on("click", function(e){
            
            var self   = $(this),
            index  = self.index(),
            text   = self.text();
       
// console.log("@@@ table eq()" , text + ' ' + index);
        
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

    } // end populateSheet
    
function show(id)
{
// http://qaru.site/questions/17975/google-maps-api-v3-how-to-remove-all-markers 
    
    $(".wp_panel").addClass('hide');
    
    while(markers.length) { markers.pop().setMap(null);   }


   if (id == 'all')
   { 
      $("[type=checkbox]").prop('checked', $('[type=checkbox]#all').prop('checked') );
   }

    markersArray = new _markers([]);
    
    $("[type=checkbox]:checked").each(function(){
       
       ds = $(this).attr('id');
       

//     console.log("@@@ show()",ds, $("[type=checkbox]:checked"));
       
       $(".wp_panel."+ds).toggleClass('hide');
       
//       console.log("@@@checkbox.active",ds);
        
       trs = $('.wp_panel.'+ds+" tr" )
       
//       console.log("@@@ trs", trs);
       
       $(trs).each(function(k,tr) {
           
           t = $(tr).children("td").map(function(ek,ev){ return $(ev).text()}); 
                  
           m = { 'name':t[2],
                 'idx':ds+'_'+t[0],
                 'group':ds,
                 'lat':t[4],
                 'lng':t[5],
                 'dist':t[6],
                 'color':t[7]  
                 };
            
           markersArray.push(m);
       });
   });
   
  markersArray.addMarkers();
  
  savegpx();
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

