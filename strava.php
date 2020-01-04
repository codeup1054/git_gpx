<?php
/*https://heatmap-external-{switch:a,b,c}.strava.com/tiles-auth/running/bluered/{0}/{1}/{3}.png?px=256&Key-Pair-Id={ID}&Signature={Sig}&Policy={P}

Где:
{0} = zoom
{1} = x*
{2} = y*
{ID} = CloudFront-Key-Pair-Id
{Sig} = CloudFront-Signature
{P} = CloudFront-Policy

2472/1281/12

$username='solid1054@gmail.com';
$password='450@163ava';
$URL='https://heatmap-external-b.strava.com/';
$URL='https://strava.com/';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$URL);
curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
$result=curl_exec ($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
//curl_close ($ch);


function curl_redirect_exec($ch, &$redirects, $curlopt_header = false) {
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $data = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    print ('data='.$data.",".$http_code );

    if ($http_code == 301 || $http_code == 302) {
        list($header) = explode("\r\n\r\n", $data, 2);
        
        $matches = array();
        preg_match('/(Location:|URI:)(.*?)\n/', $header, $matches);
        $url = trim(array_pop($matches));
        $url_parsed = parse_url($url);
        
        print ("<br />url=".print_r($url_parsed,1)."<br />");
        
        if (isset($url_parsed)) {
            curl_setopt($ch, CURLOPT_URL, $url);
            $redirects++;
            return curl_redirect_exec($ch, $redirects);
        }
    }
    if ($curlopt_header)
        return $data;
    else {
        list(,$body) = explode("\r\n\r\n", $data, 2);
        return $body;
 }
 }
 
$red = 1;
print ("curl=".$status_code.", ".curl_redirect_exec($ch, $red , $curlopt_header = false ));
curl_close ($ch);

*/


function gets($url){
    $userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
    
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

//    print ('data='.$data.",".$http_code );

//    if ($http_code == 301 || $http_code == 302) {
//        list($header) = explode("\r\n\r\n", $data, 2);
//    }
    
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}





$img = 'https://anygis.ru/api/v1/Tracks_Strava_Ride/13/4950/2566.png?px=256';
$img_static = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot/14/9901/5132.png?px=256&Signature=dHHhv0RrKOD4J3zmNy31LWJBNoq-eDHqmoy3UWKyvbPc0lWF2CVQO3QnDkW4Mk8MSrIP5C4~bFdhw-ZM7ujk2iaA9UXRlT7nLK0yzjQLTi99VOf-ToFaisg4lmPqfKlbVYoRo6~cSdlZWj5RzMykoxziSsFhY5V4sAdVWQxz732IilR~ROky5h4FTEUIJisCyVQUpuC0fLVehIdteE0Zt9TtN7GKFbNieSkDFm-PibtqTPIoMEeJd1MlYcdnLIzQUSeMPVBNogXv-oZ3yeXMmuJMJTmDdzBJlar-~nAf~HyggeyI92V2WedGa-jgl3DijXHxsiH79rwnNWtSnjiH6Q__&Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU3ODkyNTQ1MX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc3NzAxNDUxfX19XX0_';

$strava_url = 'https://heatmap-external-a.strava.com/tiles-auth/all/hot';
$Signature='Signature=dHHhv0RrKOD4J3zmNy31LWJBNoq-eDHqmoy3UWKyvbPc0lWF2CVQO3QnDkW4Mk8MSrIP5C4~bFdhw-ZM7ujk2iaA9UXRlT7nLK0yzjQLTi99VOf-ToFaisg4lmPqfKlbVYoRo6~cSdlZWj5RzMykoxziSsFhY5V4sAdVWQxz732IilR~ROky5h4FTEUIJisCyVQUpuC0fLVehIdteE0Zt9TtN7GKFbNieSkDFm-PibtqTPIoMEeJd1MlYcdnLIzQUSeMPVBNogXv-oZ3yeXMmuJMJTmDdzBJlar-~nAf~HyggeyI92V2WedGa-jgl3DijXHxsiH79rwnNWtSnjiH6Q__';
$Key='Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU3ODkyNTQ1MX0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNTc3NzAxNDUxfX19XX0_';

//print ($img);

//Key-Pair-Id
//.png?px=256


$z = (isset($_GET['z']))?$_GET['z']:'14';
$x = (isset($_GET['x']))?$_GET['x']:'9901';
$y = (isset($_GET['y']))? $_GET['y'] :'5132';



header('Content-type: image/jpeg');

$img = "$strava_url/$z/$x/$y.png?px=256&$Signature&$Key";     




/*
echo isset($_GET['y'])."</br>".print_r($_GET,1)."<br />".$img."<br /><br />".$img_static."<br />***".(($img_static === $img)?'да':'нет');

for ( $i=0;  $i <  strlen($img_static); $i++)
{
echo $img_static[$i]."|".$img[$i]."|".(($img_static[$i] === $img[$i])?'да':'нет')."</br>";    
}
*/

    
echo gets($img);

/*
$img_cache_path = "cimg/$z/$x/$y.png";


$path_parts = pathinfo($img_path);

if (!is_dir('cimg/' . $path_parts['dirname'])) {
  mkdir('cimg/' . $path_parts['dirname']);
}
*/

//file_put_contents('cimg/'.$img_path , file_get_contents($img)); 


//print ($img_path);


?>