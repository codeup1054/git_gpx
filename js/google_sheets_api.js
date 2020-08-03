var glob_gpx = {};
var glob_gpx_set = {cols:["set_id",
                          "set_name",
                          "set_description",
                          "set_type",
                          "set_prop",
                          "user_id",
                          "ord"],
                    el: []
                    };
var glob_gpx_points = {};

var glob_gpx_to_save = {};

var gpx_line = [];
var setCounter;
var deferreds = [];



function makeApiCall(action = "get_gpx_DB", apiCallData="*") {
  
//  console.log("@@@ action[",action,"]" ,apiCallData, $(this));
  
  switch (action)
      {
      case "save_db":
            $.get('act.php',{ save_db: gpx_id_to_save },
                function (response) { 
                    glob_gpx = response.data; }
                );
                
            break;
      
      case "save_sql":
            json_gpx = JSON.stringify(glob_gpx);

            console.log("@@ save_gpx_to_db", glob_gpx);
            
            $.ajax
                ({
                    type: "POST",
                    dataType : 'json',
                    async: false,
                    url: 'act.php',
                    data: { save_sql: json_gpx },
                    success: function () {alert("Thanks!"); },
                    failure: function() {alert("Error!");}
                });
            
            break; 

      case "get_gpx_DB":
//            tm('get_gpx_DB >>> Start');
            $.get('act.php',{ get_gpx_set_DB: "1,17" },
                function (response) {

                glob_gpx = response.data;
                
                console.log('@@ glob_gpx ', glob_gpx  );
                
                $('#left_panel').html(response['html']);  //tm('02. get_gpx_DB >>>');
                
                $('#left_panel table[points] tr td[ed]').attr("contenteditable",true); //tm('03. get_gpx_DB >>>');

                $('input#all').on('change', function(e){
                    isСheck = $(this).prop('checked');
                    set_id = $(this).attr('set_id');
                    $('#left_panel table[points='+set_id+'] input').prop('checked', isСheck);
                    
                    console.log('input#all', set_id );
                    
                    updateMarkersOnMap();

                });
                
                
                gpxPointsToTable(glob_gpx[19],19); // показываем 19-ый набор точек

                
                $('span[set_show_hide]').on('click', function(e){
                        el = $(this);
                        set_id  = el.closest('div').attr('set_id');
                        
//                        console.log("@@ set_show_hide",set_id, glob_gpx[set_id].points);
                        
                        gpxPointsToTable(glob_gpx[set_id],set_id);
                        
                        if(el.hasClass("ui-icon-triangle-1-s"))
                        {
                            el.attr('class','ui-icon ui-icon-triangle-1-n');
                            $('#gpx_set_table_'+set_id).removeClass('hide');
                        }
                        else
                        {
                            el.attr('class','ui-icon ui-icon-triangle-1-s');
                            $('#gpx_set_table_'+set_id).addClass('hide');
                        }
                     }); // end on clik
                });
            
            break;


      case "get_sheets_names":
            sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            sheets = sheet_metadata.get('sheets', '')
            title = sheets[0].get("properties", {}).get("title", "Sheet1")
            sheet_id = sheets[0].get("properties", {}).get("sheetId", 0)
            break; 

      case "save_json":
            json_gpx = JSON.stringify(glob_gpx);
            json_gpx2 = JSON.stringify( [{ uno: 1, Ленинград: 2 }] );
//            console.log("@@ save_gpx_to_json", json_gpx);
            console.log("@@ save_gpx_to_json", glob_gpx);
            
            $.ajax
                ({
                    type: "POST",
                    dataType : 'json',
                    async: false,
                    url: 'act.php',
                    data: { save_json: json_gpx },
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
              var vals = new Array();
              
              ds = apiCallData;
               
              trs = $('[dataset="'+ds+'"] tr')

              console.log("@@@ save_google", action, ds, trs); 

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
               
            break;
      
      default:
            gpxFromJson();     
//            gpxFromGoogle();
      }
  } // make call API    


function gpxFromJson()  
{           
//        return; 
        glob_gpx = [];
        //tm('start read JSON');
        $.get({ url: 'data/gpx.json', cache: false },function(data) {
               console.log("@@ read_json ",data);
               glob_gpx = data;
//               gpxSetNamesToTable(data);
               console.log("@@ gpxFromJson", data );
               $.each(data,function(k,v) { 
                console.log("@@ gpxFromJson", k,v );
                $('#left_panel').append(k+"</br>"); 
                
                } ); 
               
            });
        tm('end read JSON');
}


function gpxSetNamesToTable(gpx_names)
{   
    $(".datasetcheckbox").html("");

    console.log("@@ names ", gpx_names);
    
    $(".datasets").html("");
    
    $.each(gpx_names, function (k,v)
     {
       if(typeof v.points !== 'undefined')
       {
       $(".datasetcheckbox").append("<div class='checkbox_field' >\
        <div check="+v.name+"><input type=checkbox id='"+v.name+"' gpx_set_name='"+v.name+"' onchange='gpxSetCheckSelector(this.id)'>" +
        "<label for='"+v.name+"'><gpx_total>("+v.points.length+") </gpx_total>"+v.name+"</label></div></div>");
        gpxPointsToTable(v,k);
       }
       else 
       {
       $(".datasetcheckbox").append("<div class='checkbox_field' >\
        <div check="+v.name+"><input type=checkbox id='"+v.name+
            "' onchange='gpxSetCheckSelector(this.id)'>" +
        "<label for='"+v.name+"'><gpx_total>()</gpx_total>"+v.name+"</label></div></div>");
       }
    
     });
}

function isLat(lat) {  return isFinite(lat) && Math.abs(lat) <= 90; }
function isLon(lng) {  return isFinite(lng) && Math.abs(lng) <= 180; }

function gpxSetCheckSelector(id)
{   
    
    console.log('@@ pxSetCheckSelector',id,$("#"+id)[0].checked, $("#"+id));
    gpxPoinsTableSlide(id);
    gpxPoinsSelectTableByID(id, $("#"+id)[0].checked); 
}

function gpxPoinsSelectTableByID(id, isСheck)
{
    $('#gpx_set_table_'+id+' .points input').each(function(k,v){
        
//        console.log("@@ v k",v,k, $(v).closest('tr').attr('id'));
        
        $(v).css({'background-color':'red'})        
            .prop('checked', isСheck);
    });

    updateMarkersOnMap();
    console.log('@@ gpxPoinsSelectTableByID',id);
}


function gpsUpdateSetType(sel)
{   
    setId = $(sel).attr('set_id');
    glob_gpx[setId].meta.type = $(sel).val();
    console.log("@@ gpsUpdateSetType", glob_gpx);
//    updateMarkersOnMap();
}


function toggleSet(el)
{
    setId = $(el).attr('set_id');
    $("[set_id='"+setId+"'] input[gpx_id]").prop('checked', $(el).prop('checked'));
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
    setName = v.set_name;
    
    options = [0,1].map(function(x) { return "<option "+ ((v.set_type == x )? "selected":"")+">"+x+"</option>"; } ).join("")
    
//  console.log("@@ type options", v, id);
    
    setInfo = "<table id='prop_table_"+v.set_id+"' class=stab>"+
              "<tr><td>Набор:</td><td><input value='"+setName+"'></input></td><td>\
              <button tab_id='"+setName+"' class='ui-button ui-widget ui-corner-all small' onclick=\"makeApiCall(\'save_sql\','"+v.name+"'); console.log(\'***\');\">В DB</button></td></tr>"+
              "<tr><td>Тип:</td><td><select set_name='"+setName+"' set_id='"+id+"' onchange='gpsUpdateSetType(this);' >"+options+"</select></td></tr>"+
              "<tr>" +
                  "<td><span class='ui-icon ui-icon-plus' add_point_to_set='"+setName+"' onclick='addPoint(\""+v.name+"\");'></span></td>" +        
                  "<td>Добавить точку</td>"+        
                  "<td></td>"+        
                  "<td></td>"+        
                  "<td></td>"+        
                  "</tr>";          
              "</table>";
    
        
    row = "<tr class='header'><td> </td>" +
                  "<td><input set_type = '"+v.set_type+"' set_id ='"+id+"' onchange='toggleSet(this)' type='checkbox'/></td>" +        
                  "<td>Наименование</td>"+        
                  "<td geo>Описание</td>"+        
                  "<td>Широта</td>"+        
                  "<td>Долгота</td>"+   
                  "<td>До базы</td>"+
                  "<td class='hide'>Цвет</td>"+ // color
                  "<td>Расстояния</td>"+
                  "</tr>";

    hide = (v.set_id == 2)?"":"hide";
    
    $("[set_id="+v.set_id+"] [set_points]").html("");
    
    $("[set_id="+v.set_id+"] [set_points]").append("<div class='wp_panel' "+hide+" id='gpx_set_table_"+v.set_id+"'>"
                    + setInfo +"<table class='tab points' dataset='"+setName+"'></table><div>");

    var row_cnt;
    
    var dist_total = 0;
  
    $.each(points, function( k,v)
        {   
//            if(k == 0) { continue;}
//            console.log("@@ eachGPX ", v );
            dist_next = tdist_html = 0;
//          remask = '^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$';
            
         if ( typeof o_lat !== 'undefined' && ( isLat( v.lat ) && isLon( v.lng) ) )
            {
//                console.log("@@ cells", v.lat, (typeof o_lat) );
                dist_next = getDistanceFromLatLonInKm(v.lat, v.lng, o_lat, o_lng);
                dist_total += isNaN(dist_next)? 0: dist_next; // добавляем если число  
//                tdist_html = dist_total.toFixed(2)+"<sup>+"+dist_next+"</sup>"; 
                tdist_html = dist_total.toFixed(2); 
            } 
            
            o_lat = v.lat;  
            o_lng = v.lng;  
           
//continue;
            row_cnt = k;
            rowId = setName+"|"+v.name+"|"+k+"|"+v.set_id+"|"+v.gpx_id;
//            console.log("@@ context",context);
            context['activePointId'] = context['activePointId'] || rowId;
            
            row += "<tr gpx_id='"+rowId+"'><td>"+k+"</td>" +
                  "<td><input gpx_id='"+rowId+"' type='checkbox' onchange='updateMarkersOnMap();' /></td>" +        
                  "<td contenteditable>"+v.name+"</td>"+        
                  "<td geo contenteditable>"+v.description+"</td>"+        
                  "<td>"+v.lat+"</td>"+        
                  "<td>"+v.lng+"</td>"+
                  "<td>"+v.dist+"</td>"+
                  "<td class='hide'>"+v.color+"</td>"+ // color
                  "<td>"+  dist_next  +"</td>"+
                  "<td>"+  tdist_html  +"</td>"+
                  "</tr>";
        });

        $("label[for='"+setName+"'] gpx_total").text("("+ points.length +") ");
        $("[dataset ="+setName+"]").html("");
        $("[dataset ="+setName+"]").append(row);

//        $("[contenteditable]").on("input", function() {
//            console.log("@@ *** td input ",$(this).text());
//            }, false);
        
        $('body').on('focus', '[contenteditable]', function() {
            const $this = $(this);
            $this.data('before', $this.html());
        }).on('blur keyup paste input', '[contenteditable]', function() {
            const $this = $(this);
            if ($this.data('before') !== $this.html()) {
                $this.data('before', $this.html());
                $this.trigger('change');

            gpx_fields = {2:'name',3:'description'};
            gpx_field_name = gpx_fields[$(this).index()];
            gpx_id = $(this).closest('tr').attr("gpx_id");
            
            param = {};
            param[gpx_field_name] = $(this).text();

            console.log("@@ *** td input ",$(this).index(), 
                    $(this).text(),
                    gpx_id, 
                    gpx_field_name, 
                    param );
            
            context['activePointId'] = gpx_id;        
            
            updateGpx(gpx_id, param);
            updateMarkersOnMap("");
                
            }
        });
        
        
        $("[dataset ="+setName+"] input").on('change', function(el){
            updateMarkersOnMap();
//            console.log("@@ [dataset ='"+setName+"'] input", el);
        });
        
        $("[dataset ="+setName+"] tr[gpx_id]").on('click', function(el,v){
            updateMarkersOnMap("");
            
            
            lat = $($(this).children('td')[4]).text();
            lng = $($(this).children('td')[5]).text();
            
            var latLng = new google.maps.LatLng(lat,lng);
            
            map.panTo(latLng);
            
//            console.log("@@ map.panTo tr.on('click')=", el,lat);
        });

        tm("addToTable"+setName);
        
        $(".tab tbody").sortable({
                helper: fixHelperModified,
                stop: updateIndex,
                cancel: '[contenteditable]',
        })//.disableSelection();
    }



function addPoint(set_id,i={name:"Новая точка",
                description:"Описание",
                lat:"55.4",
                lng:"37.45"}) {
// 2020-02-18 Добавляем новую точку
/*
ID: "7"
Status: ""
name: "Китай город"
description: "метро Китай Город "
lat: "55.7544"
lng: "37.6366"
dist: "13.22"
color: "#ffdd88"

*/
/*            gpx_cnt = $("[dataset ="+set_id+"] tr[gpx_id]").length;
              
            rowId = setName+"|Новая|"+set_id+"|"+gpx_cnt;

            row = "<tr gpx_id='"+rowId+"'><td>"+gpx_cnt+"</td>" +
                  "<td><input checked gpx_id='"+rowId+"' type='checkbox' onclick='updateMarkersOnMap();'/></td>" +        
                  "<td contenteditable>"+i.name+"</td>"+        
                  "<td geo contenteditable>"+i.description+"</td>"+
                  "<td>"+i.lat+"</td>"+
                  "<td>"+i.lng+"</td>"+
                  "<td></td>"+
                  "<td class='hide'></td>"+ // color
                  "<td></td>"+
                  "</tr>";
*/
            glob_gpx[set_id].points.push(i);
            
            gpxPointsToTable(glob_gpx[set_id],set_id);
            
            
            console.log("@@ новая точка = ", rowId,gpx_cnt,setName);
            gpxexec(["updateMarkersOnMap"]);
        
//        updateMarkersOnMap("");

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
      sheetNames = $(response.result.sheets).map(function (k,v) {
            if (v.properties.title[0] != "~" ) return {name: v.properties.title}; 
        }).get();

        $(".datasetcheckbox").html("<div class='checkbox_field'>\
            <div check=all><input type=checkbox id='all'  onchange='updateMarkersOnMap(this.id)'>" +
                    "<label for='all'>Все</label></div></div>");

//        sheetsNames.sort();
        
        tm('start load');        
        
        setCounter = sheetNames.length;
        gpxSetNamesToTable(sheetNames);
        
        $(sheetNames).each(function(k,v){
           
//           $(".datasetcheckbox").append("<div class='checkbox_field'>\
//                <div check="+v+"><input type=checkbox id='"+v+
//                    "' onchange='updateMarkersOnMap(this.id)'>" +
//                "<label for='"+v+"'><gpx_total></gpx_total>"+v+"</label></div></div>");
//                "<label for='"+v+"'>"+cels.length+"."+v+"</label></div></div>");
            getGoogleGpxPoints(k,v.name);
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


    function getGoogleGpxPoints(set_id,sheetName)
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
//             console.log("response.result.values= ", v  );
                var myArray = $.map(v, function(element, key ) {        // ***
//                       console.log("element, key= ", element, key) 
                       return element.value;                               // ***
                    });
            });
            
            gcols = response.result.values[0];
            geo_set = {};
            points = [];
            
            
            response.result.values
                    .slice(1) // пропускаем первую строку
                    .map(function(v,k){ 
                        p = {}
                        $.each( v , function(kk,vv) { p[gcols[kk]] = vv; } );
                        points.push(p);
                    });
            
             geo_set = {'name': sheetName,
                meta: {type: 'path',
                       descriptin: '',  
                       cdate: '2019-12-26', 
                       mdate: '2019-12-26' 
                       },
                points : points
               } 
            

//            console.log('@@ response.result.values geo_set', geo_set); 
            
            glob_gpx[sheetName] = geo_set;
            gpxPointsToTable (geo_set,set_id)  // отрисовка таблицы как для JSON    
            
            
//            tm("load data"+sheetName);
//            return response.result;
            return glob_gpx;
                
          }, function(reason) {
            console.error('error: ' + reason.result.error.message);
          }); 
          
//          console.log("@@ res",sheetName, glob_gpx);
    
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

        makeApiCall('get_gpx_DB');  // load from DB

//      gapi.load('client:auth2', initClient);  // google load init  
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
    
    function _gpxPointToTable(res,sheetName)
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
    
function updateMarkersOnMap(id = 0 )
{
// http://qaru.site/questions/17975/google-maps-api-v3-how-to-remove-all-markers 
    
   while(markers.length) { markers.pop().setMap(null);   }
   markersArray = new _markers([]);
   chkd = $("[gpx_id] input:checked");

//   console.log("@@ updateMarkersOnMap 00 chkd =", chkd, glob_gpx );
    
   $.each(chkd, function(k,v) {

//          gpx_id = $(v).closest('tr').attr('gpx_id'); 
          gpx_id = $(v).attr('gpx_id'); 
          set_id = $(v).closest('div[set_id]').attr('set_id');
          
          g_set = glob_gpx[set_id];

          [setName,pointName,pos] = gpx_id.split("|");

//          console.log("@@@ gpx_id=", gpx_id,set_id, g_set.points[pos]);
          

          if ( typeof g_set.points[pos] === 'undefined' )  return true;   

          p = g_set.points[pos];
          
//          console.log("@@ updateMarkersOnMap each=", [setName,pointName,pos], glob_gpx[set_id]);

          m = { 'name':p.name,
                 'gpx_id':gpx_id,
                 'gpxSet':setName,
                 'lat':p.lat,
                 'lng':p.lng,
                 'dist':p.dist,
                 'color':p.color,  
//                 'icon':"icon"  
                 };
           
//           olat = lat;
//           olng = lng;
           markersArray.push(m);
   }); // end each

  console.log("@@ updateMarkersOnMap markersArray=", glob_gpx, markersArray);
//  console.log("@@ updateMarkersOnMap markersArray=", chkd, markersArray);

  markersArray.addMarkers();
//  drawPath();
//  savegpx();
}    


var start;
var lap;


