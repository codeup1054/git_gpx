<html>
<head>                                                               
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href="gpx.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/google_sheets_api.js"></script>
    <script src="js/gpx.js"></script> 

</head>

<button class="button" onclick="parseYP()">Йога в парках</button>
<button class="button" onclick="parseVB()">Велобайк</button><br />
<textarea class='output' style="width:100%; height:100%"></textarea>

<script>

function parseYP() 
{
$.getJSON('data/yp.json', function(data) {
     

    var event = new Date();
    var today = event.toLocaleString('ru-RU', { timeZone: 'UTC' });
    var g_idx = 0; //markersArray.length;
    var m_group_name = "ЙП";
    var data_fields = "ID	Status	name	description	lat	lng	dist	time	param1";                
    
    $(data).each(function(k,el)
    {  
       g_idx ++;
      
       console.log ("@@ readYP",el,$(el));
       $('.output').append( 
               g_idx + '\t' + 
               'on\t'+ 
               el.name + '\t'+ 
               el.addr + '\t' + 
               el.lat  + '\t' +
               el.lon  + '\t' +
               getDistanceFromLatLonInKm(el.lat,el.lon) + '\t' + 
               today  + '\t' +
               el.addr + '\n'  
                           )
//       markersArray.push(m);
    });
});
}


function parseVB() 
{
$.getJSON('data/vb.json', function(data) {
     

    var event = new Date();
    var today = event.toLocaleString('ru-RU', { timeZone: 'UTC' });
    var g_idx = 0; //markersArray.length;
    var m_group_name = "Велобайк";
    var data_fields = "ID	Status	name	description	lat	lng	dist	time	param1";                
    
    $(data.Items).each(function(k,el)
    {  
       g_idx ++;
      
       console.log ("@@ readYP",el);
       $('.output').append( 
               g_idx + '\t' + 
               'on\t'+ 
               el.Id + '\t'+ 
               el.Address + '\t' + //description 
               el.Position.Lat  + '\t' +
               el.Position.Lon  + '\t' +
               getDistanceFromLatLonInKm(el.Position.Lat,el.Position.Lon) + '\t' + 
               today  + '\t' +
               el.Id + ', ' + el.TotalPlaces +'\n'  
                           )
//       markersArray.push(m);
    });
});
}


function readStations()
{
    $.ajax({
        type: "GET",
        url: "data/stations_clear.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });


    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split('\t');
        var lines = [];
        
//        console.log("@@ allTextLines.length",allTextLines.length);
        
        var event = new Date();
        var today = event.toLocaleString('ru-RU', { timeZone: 'UTC' });
        var g_idx = markersArray.length;
        
        for(var i=1; i<allTextLines.length; i++) {
            var el = allTextLines[i].split('\t');
               
               var m_group_name = "ж.д. " + el[4];
               
               m = {'name':el[0] +','+ el[4],
                     'extensions':{"color":"#8f8", "info":"ЙП"},
                     'idx':g_idx+'.'+i ,
                     'group':m_group_name,
                     'lat':el[5],
                     'lng':el[6], 
                     'time':today, 
                     'file_to_save': "data/stations_geo.csv" 
                     };
                markersArray.push(m);
            }
        }
        console.log("@@@ lines", markersArray);
//        tablePlus();
}


</script>

<body>
</body>
</html>