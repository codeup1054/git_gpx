<?php

// https://my.apify.com/actors/9rJZagTpspnLsgeX6#/source   получить Policy и $Signature


include_once 'gpx.lib';

error_reporting(E_ALL);
ini_set("display_errors", 1);

/* 2020-04-10

{ "email": "sdsp256@gmail.com" , "password": "652@163Ava" }

*/


//header('Content-type: image/jpeg');


/*https://heatmap-external-{switch:a,b,c}.strava.com/tiles-auth/running/bluered/{0}/{1}/{3}.png?px=256&Key-Pair-Id={ID}&Signature={Sig}&Policy={P}
Где:
{0} = zoom
{1} = x*
{2} = y*
{ID} = CloudFront-Key-Pair-Id
{Sig} = CloudFront-Signature
{P} = CloudFront-Policy
*/
//$img = 'https://anygis.ru/api/v1/Tracks_Strava_Ride/13/4950/2566.png?px=256';
//$img_static = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot/14/9901/5132.png?px=256&Signature=dHHhv0RrKOD4J3zmNy31LWJBNoq-eDHqmoy3UWKyvbPc0lWF2CVQO3QnDkW4Mk8MSrIP5C4~bFdhw-ZM7ujk2iaA9UXRlT7nLK0yzjQLTi99VOf-ToFaisg4lmPqfKlbVYoRo6~cSdlZWj5RzMykoxziSsFhY5V4sAdVWQxz732IilR~ROky5h4FTEUIJisCyVQUpuC0fLVehIdteE0Zt9TtN7GKFbNieSkDFm-PibtqTPIoMEeJd1MlYcdnLIzQUSeMPVBNogXv-oZ3yeXMmuJMJTmDdzBJlar-~nAf~HyggeyI92V2WedGa-jgl3DijXHxsiH79rwnNWtSnjiH6Q__&Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU3ODkyNTQ1MX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc3NzAxNDUxfX19XX0_';


$z = (isset($_GET['z']))?$_GET['z']:'14';
$x = (isset($_GET['x']))?$_GET['x']:'9901';
$y = (isset($_GET['y']))? $_GET['y'] :'5132';
$watermark = (isset($_GET['watermark']))? $_GET['watermark'] : 0;


$img_cache_path = "img_cache/$z/$x/$y.png";


tm();



$watermark_img_str = "*****";
$file_age  =  time()-filemtime($img_cache_path);

//print ($file_age);

if (file_exists($img_cache_path) && $file_age < 30*24*3600 )
{
    $image = new Imagick($img_cache_path);
    echo $image;
}
else
{
    $watermark = 1;
    loadFromStrava($z,$x,$y);
}




function loadFromStrava($z,$x,$y)
{
    global $img_str, $img_cache_path, $watermark_img_str;
    $strava_url = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot';
    
    //11,1149,657
    // chrome://settings/cookies/detail?site=strava.com  искать после перехода по ссылке https://www.strava.com/heatmap#9.03/37.74883/55.67465/hot/all
    //описание авторизации https://developers.strava.com/docs/getting-started/#oauth

         
//  $img_url = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     
    
    $Key_Pair_Id = "APKAIDPUN4QMG7VUQPSA";
    
    $ap = apify();
    
    echo "ap=".print_r ($ap,1); 
    
//    $Policy = "eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU5MzMzMzc5M30sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTkyMTA5NzkzfX19XX0_";
//    $Signature = "dUglMjwk2FIIOQC1G0zQMO~ZPhh7cbV-dVsdY5X331drD6Eu17AsElSLmo5040feYnNlG49hq9Mqy-o7iGobmMorNxJubxbCtqTeQDO7MOdgGY3gHxoXzt-z4MocjeeVLNUQGlpreVTGDabnFb97ZrF0Kfunk2~LXQKE5cAh1H6uNcBmEZR8xBNV9t9qXJglnbL7Yik9ojMNYUhlfHAMD2vYyhdJDSlNNEEFh0T9bkGx8EJrYsLJ6MEOmPaGd~ArbXQHt3Q2IG6-HAiJRGLU8ty6SYvXubVq8RjeJXZMqpqlRY2aLjAX7rlhWTIPtjgvJnT3Ud09xBtisKJQeSdGqw__";

    $Policy = $ap->Policy;
    $Signature = $ap->Signature;
    
//    $Signature = "My5Cctgax-eZiSPik8BYr~c79H-UXidiuutFfz9BulmYe0tH~wJnUEA0bFzkQN2Rlo91pN~Mn09JZm2XJfz6LhSJl2a8Az6D5qzoG5TrvFYeWUtzmSRm62~iiJTp7qrQi3ePdxzhRSafeju0F3SFMAMmWBcbZBIbVainHwaPuvNtSiy4FUTb1jIkexX6eXzMEoG1RFFw8Zcexqom3ODyZeGR4b3A7qrYsnZmRoS7PuIqnPnxpox4ZV3kAGIgXOYzsp6HPSft8KbpVnuz63ujReCinUToDdzyAWNH4854IAOw~0FGwga4EAjVUUhM2DuXhTjHz0vxq0bhMzjJUtpm~w__";

    $img_url  = "$strava_url/$z/$x/$y.png?px=256&Signature=$Signature&Key-Pair-Id=$Key_Pair_Id&Policy=$Policy";

//    $img_url = "$strava_url/$z/$x/$y.png?px=256";     
//    $img = "https://anygis.ru/api/v1/Tracks_Strava_Ride/$x/$y/$z";   // c 2020-01-28 не работает  
    
//    print ("<a href='".$img_url."'>$img_url</a>");

    
    
    $path_parts = pathinfo($img_cache_path);

    
    if (!is_dir($path_parts['dirname'])) {  // ************ 2020 Create directory *****************
      mkdir($path_parts['dirname'],0777, true);
    }


    $image = new Imagick($img_url);

    // записываем изображение из Strava
    $image->writeImage($img_cache_path); 
    
    $update_res = update_gpx($z,$x,$y); // записываем в базу
//    $watermark_img_str =  $watermark_img_str."{".$watermark."}date: ".tm('res',1)."\n".$update_res;
    $watermark_img_str =  $watermark_img_str."date: ".tm('res',1)."\n".$update_res;
    
    
    $font = 'Helvetica';
    $watermark_text = new ImagickDraw();
    $watermark_text->setFillColor('blue');
    $watermark_text->setFont($font);
    $watermark_text->setFontSize(9);
    $watermark_text->setStrokeAntialias(true);
    $watermark_text->setStrokeColor('none');
    $watermark_text->setStrokeWidth(0);
    $watermark_text->setGravity(Imagick::GRAVITY_NORTHWEST);
    // Clone & set stroke attributes
    $watermark_outline = clone $watermark_text;
    $watermark_outline->setFillColor('none');
    $watermark_outline->setStrokeColor('rgba(255,255,255, 0.9)');
    $watermark_outline->setStrokeWidth(4);
    $watermark_outline->setStrokeAntialias(true);  //try with and without
    //$watermark_outline->setTextAntialias(true);  //try with and without
    // Set the text for both, and offset one to match stroke width
    $watermark_outline->annotation(0, 0, $watermark_img_str);
    $watermark_text->annotation(0, 0, $watermark_img_str."****");
    // Draw stroke, then text
    
    global $watermark;
    
    if ($watermark || 1)  // не используется в .get
    {
        $image->drawImage($watermark_outline);
        $image->drawImage($watermark_text);
    }


//    echo $image;

}



function update_gpx($z,$x,$y)
{
    global $gsql;

    //  ./12/2305/1422.png
    
    $command = "cd ./img_cache/; find ./$z/$x/$y.png -type f -exec ls -l --time-style=+%s {} + | awk '{ print $5\"/\"$6\"/\"$7 }'";
    $io = popen ( $command , 'r' );
    
    if ($io) {
        while (($line = fgets($io, 200)) !== false) {
    //        $du_size .= "".str_replace("\t./img_cache/","-",$line);
            $p = explode('/',$line);
    //        print ("<pre>".$line." ".print_r($p,1)."</pre>");
    //        print ("".$line."\n<br />");
            $s = $p[0]; // размер файла 
            $d = $p[1]; // время 
            $z = $p[3]; // zoom
            $x = $p[4]; // x
            $y = substr($p[5],0,strlen($p[5])-5); // y
            }
        fclose($io);
        } 
        else 
        {
        // error opening the file.
        } 
    
    $t2 = tm("01. get find",1);
    
    $inserts = "";
    
    //print ("$command<br /><pre>".$line."<br />******:".print_r($p,1)."</pre>");
    
    
    $sql_insert = "INSERT INTO strava_cache (z,x,y,s,d) 
    VALUES ($z,$x,$y,$s,$d)";
    
    $err="OK";
    
    if ( 1 &&
    //    !$mysqli->query("DROP TABLE IF EXISTS strava_cache") ||
    //    !$mysqli->query($sql_create _tab) ||
        !$gsql->query($sql_insert)) {
        $err = "Не удалось создать таблицу: (" . $gsql->errno . ") " . $gsql->error;
        }
       
       return "sql_err=[".$err."]
".$sql_insert;  
} 



// size of cache 
// du -skh * | sort -n

/*
$io = popen ( '/usr/bin/du -skh ./img_cache ', 'r' ); //$io = popen ( '/usr/bin/du -skh '. $f .' | sort -n', 'r' );
$size = fgets ( $io, 4096);
pclose ( $io );


$du_size = ""; // размер подпапок 
$io = popen ( '/usr/bin/du -skh ./img_cache/* | sort -k 2', 'r' );

if ($io) {
    while (($line = fgets($io, 4096)) !== false) {
        $du_size .= "".str_replace("\t./img_cache/","-",$line);
    }
    fclose($io);
} else {
    // error opening the file.
} 
pclose ( $io );
*/


function curl_get_contents($url)
{
//    print ("@@  ************* explode<br />$url<br/>*****<br />".explode("?",$url)[1])."</br>";
    
    $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $url);
//   curl_setopt($ch, CURLOPT_POSTFIELDS, explode("?",$url)[1]);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
   $html = curl_exec($ch);
   $data = curl_exec($ch);
   curl_close($ch);
   return $data;
}


?>