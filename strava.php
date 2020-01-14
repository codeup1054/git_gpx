<?php
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

$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     
$img_cache_path = "img_cache/$z/$x/$y.png";

if (file_exists($img_cache_path))
{
    $image = new Imagick($img_cache_path);
    echo $image;
}

else
{
    loadFromStrava($z,$x,$y);
}



function loadFromStrava($z,$x,$y)
{

$strava_url = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot';
$Signature='Signature=dHHhv0RrKOD4J3zmNy31LWJBNoq-eDHqmoy3UWKyvbPc0lWF2CVQO3QnDkW4Mk8MSrIP5C4~bFdhw-ZM7ujk2iaA9UXRlT7nLK0yzjQLTi99VOf-ToFaisg4lmPqfKlbVYoRo6~cSdlZWj5RzMykoxziSsFhY5V4sAdVWQxz732IilR~ROky5h4FTEUIJisCyVQUpuC0fLVehIdteE0Zt9TtN7GKFbNieSkDFm-PibtqTPIoMEeJd1MlYcdnLIzQUSeMPVBNogXv-oZ3yeXMmuJMJTmDdzBJlar-~nAf~HyggeyI92V2WedGa-jgl3DijXHxsiH79rwnNWtSnjiH6Q__';
$Key='Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU3ODkyNTQ1MX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc3NzAxNDUxfX19XX0_';


$Signature='Signature=GK6DjcUbbgwgn5dtNvaUfBS4h0ZahhyzwJlZ7wn6ghGeM8SG97gUKrev~H5wcgE91uwZfftBuHmLIDMBv0oDuzlsFu-Mm0g4xDpDfVkeQN5FDxxFsqwTOqX13Z4UMW1XuY6UrM9PYcjZDMMmIS3pzuco-i3AVJNH-6RMjeLKMgJUOGT1FKiUiff8V6~DXX0~CVXQT8yr9ZdX529YGiXhrMi0SR7R64sgXQRYohPUSPFepHc0kvfFUYsKa3KBK5GDF4yr0IJI-iIuw7HI3YI2fyoU8h4DZkXXPMxLLpRYiJ-FQ2qRL6M-h6FvO-bV2N864VtGtZWNGbuWoGCtjeJj9A__';
$Key='Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU3OTI5NjE0OX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc4MDcyMTQ5fX19XX0_';

$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     
//$img = "https://anygis.ru/api/v1/Tracks_Strava_Ride/$x/$y/$z.png?px=256";

$img_cache_path = "img_cache/$z/$x/$y.png";

$path_parts = pathinfo($img_cache_path);
//$path_parts_print_r = print_r($path_parts,1); 

if (!is_dir($path_parts['dirname'])) {  // ************ 2020 Create directory *****************
  mkdir($path_parts['dirname'],0777, true);
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

header('Content-type: image/jpeg');

$img_str = $path_parts_print_r;

$img_str = "".$z.",".$x.",".$y." | ".str_replace("\t./img_cache","",$size)."" ; //."-----------\n".$du_size;  
$img_str = $z.",".$x.",".$y."-".str_replace("\t./img_cache","",$size);  

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

$image = new Imagick($img);
//$image->setSize(200, 35);
//$image->readImage('XC:LightGoldenrod');



$image->writeImage($img_cache_path);

if ($watermark )  // не используется в .get
{
    $image->drawImage($watermark_outline);
    $image->drawImage($watermark_text);
}

echo $image;

}

?>