<?php

include_once 'gpx.lib';

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
$watermark = (isset($_GET['$watermark']))? $_GET['$watermark'] :0;

tm();

$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     
$img_cache_path = "img_cache/$z/$x/$y.png";


$img_str = ">";

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
    global $img_str;
    $strava_url = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot';
    
    //$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";
    //11,1149,657

    $Signature="Signature=nhvQEGtjjIY2~pRAupGkcmBpyekTjuDQdYb8EqnOh5NQohY~YGp2~0~9uVx0~MOo~dd90hTtX1xp~YUuPT3MATSMnVlWbfeOA6VLPXy0ca5IsBmP2C4T71v3HD5PZWdyO~D3pAjhHYhcOYmP-it6nrblxAp2M2zbcmE5-33yDgZW03W7FmkqgK~nOxHzke7hlwyySAmd2LswA3FScfrOTPXpqQX5NHCEDCFtZAdZCPm-XaR4uqNz49U5Mbhk7g5ui7adcbH4NGT52HcCjlY8Syp4oOZjrDJcuozYJa4Rw529FJl4drfboCKnW9wnxFYgDhD5wfdilCvZoXeOi0KBQw__";
    $Key="Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU4MDIyNzMwNX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc5MDAzMzA1fX19XX0_";
         
    $img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     
    
//    $img = "https://anygis.ru/api/v1/Tracks_Strava_Ride/$x/$y/$z";
    
//    print ($img); 
    
    $img_cache_path = "img_cache/$z/$x/$y.png";
    
    $path_parts = pathinfo($img_cache_path);
    //$path_parts_print_r = print_r($path_parts,1); 
    
    if (!is_dir($path_parts['dirname'])) {  // ************ 2020 Create directory *****************
      mkdir($path_parts['dirname'],0777, true);
    }

    header('Content-type: image/jpeg');
    
    //$img_str = "".$z.",".$x.",".$y." | ".str_replace("\t./img_cache","",$size)."" ; //."-----------\n".$du_size;  
    $img_str .= $z.",".$x.",".$y."-".str_replace("\t./img_cache", "" , $size);  
    
//    $img_str .= tm('02. create dir',1);
    
    $image = new Imagick($img);


    // записываем изображение из Strava
    $image->writeImage($img_cache_path); 
    
 
    
    $sql = update_gpx($z,$x,$y); // записываем в базу
    $img_str .=  "\n tm".tm('res',1)."<br />".$sql;
    
    
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
    $watermark_outline->annotation(0, 0, $img_str);
    $watermark_text->annotation(0, 0, $img_str);
    // Draw stroke, then text
    
    
    
    if ($watermark || 1)  // не используется в .get
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
    
    if ( 1 &&
    //    !$mysqli->query("DROP TABLE IF EXISTS strava_cache") ||
    //    !$mysqli->query($sql_create _tab) ||
        !$gsql->query($sql_insert)) {
        $err = "Не удалось создать таблицу: (" . $gsql->errno . ") " . $gsql->error;
        }
       
       return "code=".$err.":
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


?>