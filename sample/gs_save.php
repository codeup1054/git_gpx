<html>
  <head></head>
  <body>
    <!--
    BEFORE RUNNING:
    ---------------
    1. If not already done, enable the Google Sheets API
       and check the quota for your project at
       https://console.developers.google.com/apis/api/sheets
    2. Get access keys for your application. See
       https://developers.google.com/api-client-library/javascript/start/start-js#get-access-keys-for-your-application
    3. For additional information on authentication, see
       https://developers.google.com/sheets/api/quickstart/js#step_2_set_up_the_sample
    -->
        <button id="signin-button" onclick="handleSignInClick()">Sign in</button>
        <button id="signout-button" onclick="handleSignOutClick()">Sign out</button>
        <button id="save-button" onclick="makeApiCall('read')">Read</button>
        <button id="save-button" onclick="makeApiCall('write')">Save</button>
    <div class="test"></div>
    <?php 
            for ($r=0; $r<5; $r++)
            {
             echo "<div style= 'clear:both; display:block; border:0px red solid;'>";
                for ($c=0; $c<5; $c++)
                {
                    echo "<input type='text' style='float:left; width:100px;' name = '$r:$c' id='$r:$c'>";
                }
             echo "</div>\n";
            }
    ?>  
    
  <script>
  function makeApiCall(action) {
  
  console.log("makeApiCall");
    
  if(action == "write")
      {
          var vals = new Array(5);
          console.log ("vals1", vals ) ;
            
          for (var row=0; row < 5 ; row++)
            {
              vals[row] = new Array(5);
              console.log ("vals2", vals ) ;
                for (var col=0; col < 5 ; col++)
                {
                    console.log (row+":"+col, document.getElementById(row+":"+col).value, vals ) ;
                    vals[row][col] = document.getElementById(row+":"+col).value;
                }
            }
          var params = {
            spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.
            range: 'VB!A1:G30',  // TODO: Update placeholder value.
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
      }
      else 
      {
          var params = {
            spreadsheetId: '1zNy8SZ-ZPnAYXsGGmxvDYe0hHnyS6spuYuQCcAxg6dA',  // TODO: Update placeholder value.
            range: 'VB!A1:G30',  // TODO: Update placeholder value.
          };
          var request = gapi.client.sheets.spreadsheets.values.get(params);
          request.then(function(response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
            populateSheet(response.result);
            
          }, function(reason) {
            console.error('error: ' + reason.result.error.message);
          });        
      }
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
        makeApiCall();
      }
    }

    function handleSignInClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }
    
    function populateSheet(res)
    {   
        var cels = res.values;
        
        for (var r=0; r<5; r++)
        {
        console.log("@@trs ",cels[r] );
            
            for (var col=0; col<5; col++)
            {
                document.getElementById(r+":"+col).value = cels[r][col];
//                console.log ("@@ cell","#"+r+":"+col,$("#"+r+":"+col),cels[r][col]);
            }
        }
//        $('.tab').html("<tr>"+trs+"</tr>");
    }
    
    </script>
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>
  </body>
</html>