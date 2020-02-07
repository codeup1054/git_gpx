<?php

include_once 'gpx.lib';

error_reporting(E_ALL);
ini_set("display_errors", 1);


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
$watermark = (isset($_GET['watermark']))? $_GET['watermark'] :0;


$img_cache_path = "img_cache/$z/$x/$y.png";


tm();



$watermark_img_str = "";

if (file_exists($img_cache_path))
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
    
    //$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";
    //11,1149,657

    $Signature="Signature=XdygRZNrhuk88SlE1sYYus5VBPj7yNupsAG~3VAisNktOQ1XTsvFTZcHvfDoBQzFHTwxJdAt3S3DDZGaRVnKYAHP~9si~HFyhW0Cyy22bFwIky~M6SHFhXImIYS2maapKyTDPjkUJ~T5bXzQ5J-9yQAheTlKKRNMlpzo1TkR6Kbr61LBcAbAPiOQ2KR8Xa85-i4b6oDn1GmmvGzvly3OcEL-ceDCOWGiBEDNuN4qs~2dCdOUUouD5rH3raVHDml4nbIs9iR-ya7JDmjC3PfTGAXUKCH19Fj8G9Os9OSgDaPTmAo4Q13a9KQZ0VKad8nxY9ZHrEclxad-nCLL3Neu0Q__";
    $Key="Key-Pair-Id=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU4MTI1NDE5NX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTgwMDMwMTk1fX19XX0_";
         
    $img_url = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     


    $img_url  = "$strava_url/$z/$x/$y.png?px=256&Signature=XdygRZNrhuk88SlE1sYYus5VBPj7yNupsAG~3VAisNktOQ1XTsvFTZcHvfDoBQzFHTwxJdAt3S3DDZGaRVnKYAHP~9si~HFyhW0Cyy22bFwIky~M6SHFhXImIYS2maapKyTDPjkUJ~T5bXzQ5J-9yQAheTlKKRNMlpzo1TkR6Kbr61LBcAbAPiOQ2KR8Xa85-i4b6oDn1GmmvGzvly3OcEL-ceDCOWGiBEDNuN4qs~2dCdOUUouD5rH3raVHDml4nbIs9iR-ya7JDmjC3PfTGAXUKCH19Fj8G9Os9OSgDaPTmAo4Q13a9KQZ0VKad8nxY9ZHrEclxad-nCLL3Neu0Q__&Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU4MTI1NDE5NX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTgwMDMwMTk1fX19XX0_";

//    $img_url = "$strava_url/$z/$x/$y.png?px=256";     
//    $img = "https://anygis.ru/api/v1/Tracks_Strava_Ride/$x/$y/$z";   // c 2020-01-28 не работает  
    
//    print ("<a href='".$img_url."'>$img_url</a>");

    
    
    $path_parts = pathinfo($img_cache_path);


    //$path_parts_print_r = print_r($path_parts,1); 
    
    if (!is_dir($path_parts['dirname'])) {  // ************ 2020 Create directory *****************
      mkdir($path_parts['dirname'],0777, true);
    }

    
    //$img_str = "".$z.",".$x.",".$y." | ".str_replace("\t./img_cache","",$size)."" ; //."-----------\n".$du_size;  
//    $img_str .= $z.",".$x.",".$y."-".str_replace("\t./img_cache", "" , $size);  
    
//    $img_str .= tm('02. create dir',1);

// $img_url = "https://heatmap-external-a.strava.com/tiles-auth/all/hot/12/2470/1282.png?px=256&Signature=XdygRZNrhuk88SlE1sYYus5VBPj7yNupsAG~3VAisNktOQ1XTsvFTZcHvfDoBQzFHTwxJdAt3S3DDZGaRVnKYAHP~9si~HFyhW0Cyy22bFwIky~M6SHFhXImIYS2maapKyTDPjkUJ~T5bXzQ5J-9yQAheTlKKRNMlpzo1TkR6Kbr61LBcAbAPiOQ2KR8Xa85-i4b6oDn1GmmvGzvly3OcEL-ceDCOWGiBEDNuN4qs~2dCdOUUouD5rH3raVHDml4nbIs9iR-ya7JDmjC3PfTGAXUKCH19Fj8G9Os9OSgDaPTmAo4Q13a9KQZ0VKad8nxY9ZHrEclxad-nCLL3Neu0Q__&Key-Pair-Id=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU4MTI1NDE5NX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTgwMDMwMTk1fX19XX0_";   



 $image = new Imagick($img_url);

/*  вариант с загрузко с использованием curl

 $file_get_image = curl_get_contents($img_url);

 if ($file_get_image !== false)
   {
     $image = new imagick();
//     print("<br />**** file_get_image=".$file_get_image."<br />****************<br />");
     $image->readImageBlob($file_get_image);
   }
 else
   {
     echo "Uh-oh... Cannot load image from URL!";
   }
*/
    

    // записываем изображение из Strava
    $image->writeImage($img_cache_path); 
    
 
    
    $update_res = update_gpx($z,$x,$y); // записываем в базу
    $watermark_img_str =  $watermark_img_str."{".$watermark."}date: ".tm('res',1)."\n".$update_res;
    
    
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
    $watermark_text->annotation(0, 0, $watermark_img_str);
    // Draw stroke, then text
    
    
    global $watermark;
    if ($watermark)  // не используется в .get
    {
        $image->drawImage($watermark_outline);
        $image->drawImage($watermark_text);
    }


    echo $image;

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