<?php

// https://my.apify.com/actors/9rJZagTpspnLsgeX6#/source   получить Policy и $Signature

        $api = "https://api.apify.com/v2/datasets/d96aWJ3sZXicMVhGS/items?format=json&clean=1";
        
//        $api = "https://api.apify.com/v2/acts/sdsp256~stravaauth?token=7mnSuF3Wpv2jKZJ6NX2WX2P9R";
        $api = "https://api.apify.com/v2/acts/sdsp256~stravaauth/run-sync";
        
print ("1");

        $ch = curl_init("https://api.apify.com/v2/acts/sdsp256~stravaauth/runs?token=7mnSuF3Wpv2jKZJ6NX2WX2P9R"); // such as http://example.com/example.xml

print ("<br />2 ".$ch);

        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [ 'token'=>'7mnSuF3Wpv2jKZJ6NX2WX2P9R'] );
//        curl_setopt($ch, CURLOPT_HEADER, 0);
        
        $api_cookie = curl_exec($ch);
        print ("<br />".$api_cookie );
        
        
        
        try
        { 
            $api_cookie_arr = json_decode ($api_cookie);
            
            echo "*** <pre>".print_r($api_cookie_arr,1)."</pre>";
            
        }
        catch (Exception $e) 
        {
            echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
        }


//echo tm(' ');

?>