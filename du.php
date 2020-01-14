<html>
<head>
    <link href="gpx.css" rel="stylesheet" type="text/css" /> 
</head>
<style>
.cache td:nth-child(n+2):nth-child(-n+4){
    text-align: right;
 }
 
.cache td
{
    font-size:13px;
}
 
.cache td:nth-child(n+2):nth-child(-n+4) div{
    display:inline-block; 
    background-color:lightgray;
    height:5px; 
 }
 

 
</style>

<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$now = time();  
$var = array();
$time_start = $time_lap =  microtime(true);


$ranges = array(
'1rgb(200,  0,  0)'=>60*30,
'2rgb(255, 110, 20)'=>3600,
'3rgb(250,235, 10)'=>3600*2,
'4rgb(100,230, 10)'=>3600*6,
'5rgb( 30,180, 15)'=>3600*24,
'6rgb( 80,190,155)'=>3600*24*3,
'7rgb( 170,190,210)'=>3600*24*7,
'8rgb( 210,220,230)'=>3600*24*14
);


$total_inter_cnt = array();

$styles = "";

foreach($ranges as $kk=>$vv) 
 { 
    $total_inter_cnt[$kk] = 0;
    $styles .= " .total_cnt_interval:nth-child(".(substr($kk,0,1)+4).") { background-color:".substr($kk,1)." }";    
 }   

echo "<style>$styles</style>";  


function tm($s = '')
{
    global $time_start, $time_lap;    
    $t  = microtime(true);

    if ($s == '') $time_start = microtime(true);
    else printf("<sup><a style='color:red;'>+%0.4f</a> %0.3f %s %s</sup><br/>", 
                ($t - $time_lap), ($t - $time_start), 
                date('M-d H:i:s', time()),
                $s
                );
    
    $time_lap = $t; 
}


tm();

$c_day_cnt = array();
$cache_files = array();

$du_size = ""; // размер подпапок 

// find . -mmin -120 -type f  -exec ls -la {} + | awk '{s+=$5} END {print "Total SIZE: " s}'
// $io = popen ( "cd ./img_cache/; find . -mmin -120 -type f -exec ls -l {} + | awk '{ print $5, $6 , $7, $8, $9 }'", 'r' );

$io = popen ( "cd ./img_cache/; find .  -type f -exec ls -l --time-style=+%s {} + | awk '{ print $5\"/\"$6\"/\"$7 }'", 'r' );

tm("01. get find");

$total_size = 0;
$total_cnt = 0;
$inserts = "";

if ($io) {
    while (($line = fgets($io, 200)) !== false) {
//        $du_size .= "".str_replace("\t./img_cache/","-",$line);
        $p = explode('/',$line);
//        print ("<pre>".$line." ".print_r($p,1)."</pre>");
//        print ("".$line."\n<br />");
        $total_cnt++;
        $total_size = $total_size+$p[0];
        $s = $p[0]; // размер файла 
        $t = $p[1]; // время 
        $z = $p[3]; // zoom
        $x = $p[4]; // x
        $y = substr($p[5],0,strlen($p[5])-5); // y
        
        $total_size_zoom[$z] = (isset($total_size_zoom[$z]))?$total_size_zoom[$z]+$s:$s;
        
//        $delt = time()-strtotime ($l[1].' '.$l[2].' '.$l[3]);
        $delt = time()-$p[1];

        $d_c = d_color($delt);
        
        $bar[$z][$d_c] = (isset($bar[$z][$d_c]))?$bar[$z][$d_c]+1:1;
        $size[$z][$d_c] = (isset($size[$z][$d_c]))?$size[$z][$d_c]+$s:$s;
        
//        print (",($z,$x,$y,$s,$t)");
        
        $inserts .= ",($z,$x,$y,$s,$t)";

        $cache_files[$z][$x][$y] = 
            array('fs' => $s, 
                  'md' => $t,
                  'delt' => $delt
                   );
                  
//        print (trim($p[3])."\t".$l[0]."<br />");
    
        }
    fclose($io);
    } 
    else 
    {
    // error opening the file.
    } 


tm("02. create array");

ksort($total_size_zoom);

//echo "<br />cache_files = <pre>".print_r($cache_files,1)."<br /></pre>";
//echo "<br />$total_cnt<br /><pre>size=".($total_size)."<br />".print_r($total_size_zoom,1)."</pre>";

tm("03. ksort");

$l = "";


ksort($bar );
$total_cnt = $total_size = 0;

foreach($bar as $k => $v)
{
    $dv = $td = $tdh = "";
    ksort($v);
    $cnt = $l_size = 0 ;

//tm("04. bar: $k");
     
    foreach ($v as $kk=>$vv)
    {
        $clr=substr($kk, 1);
        $cnt += $vv;
        $total_cnt += $vv;  
        
        $l_size += $size[$k][$kk];
        $total_size += $size[$k][$kk];
        
        
        $dv .= "<div title='$vv' style='font-size:12px; display:inline-block; background-color:$clr; height:19px; width:".($vv/20 )." '></div>";
    }

        
    foreach($ranges as $kk=>$vv)
    {   
//       print ("<br />".$kk."<br />");
//        print_r ($v);
        $tdh .= "<td>$vv</td>";
        $clr = substr($kk, 1);
        $td .= ( isset ($v[$kk]))? 
            "<td style='background-color:$clr; '>". $v[$kk]."</td>":
            "<td ></td>";
        
        if ( isset ($v[$kk]) )  $total_inter_cnt[$kk] +=$v[$kk];
                
    } 
    
    $mean_size = $l_size/$cnt;


    $dv_cnt = "$cnt<br /><div title='$vv' style='width:".($cnt/100)." '></div>";

    $dv_size = floor($l_size/1024)."<br /><div title='$vv' style='margin: auto;  background-color:lightgray; 
                                      height:5px; width:".($l_size/2000000 )." '></div>";


    $dv_mean_size = floor($mean_size)."<br /><div title='$vv' style='margin: auto;  background-color:lightgray; 
                                      height:5px; width:".($mean_size/400 )." '></div>";


   
    $l .= "<tr>
                <td>$k</td>
                <td>$dv_cnt</td>
                <td>$dv_size</td>
                <td>$dv_mean_size</td>
                $td 
                <td>$k</td>
                <td style='background:url(bkg.png);'>".$dv."</td>
            </tr>";
    
    
    
}


$dv = "<div title='$vv' style='font-size:15px; display:inline-block; background-color:$clr; height:19px; width:".($vv/3 )." '>".$vv."</div>";


$io = popen ( "du -s ./img_cache/ | awk '{ print $1 }'", 'r' );

if ($io) 
    {
        while (($line = fgets($io, 200)) !== false) $total_size_with_dir = $line;
        fclose($io);
    } 
    else { print ("error opening the file."); } 


ksort($total_inter_cnt);

// print_r ($total_inter_cnt);



echo "<table class='stab cache'>
<tr><td>№</td>
    <td>Количество</td>
    <td>Размер</td>
    <td>Ср. размер</td>
    $tdh
    <td>Z</td>
    <td>Диаграмма</td>
</tr>
$l
<tr><td>Total</td>
    <td>$total_cnt</td>
    <td>".floor($total_size/1024)."<br />$total_size_with_dir<br />".floor(100-($total_size/10.24)/$total_size_with_dir)."</td>
    <td>".floor($total_size/$total_cnt)."</td>
    <td class='total_cnt_interval'>".implode("</td><td class='total_cnt_interval'>",array_values( $total_inter_cnt))."</td>
    <td></td>
</tr>
</table>";

tm("05. echo table");

$files = glob('./img_cache/*');
usort($files, 'cmp');

tm("06. >>>>");

function cmp($a1, $b1) {
    
    $a = str_replace('./img_cache/','', $a1 ); 
    $b = str_replace('./img_cache/','', $b1 ); 
    
    if ($a < $b) {
        return -1;
    } else if ($a > $b) {
        return 1;
    } else {
        return 0;
    }
}

function d_color($t)
{     
      global $ranges;
      foreach ($ranges as $k=>$v) if  ($t < $v) return $k;
      return $ranges[7];
}


$mysqli = new mysqli("localhost", "gpx", "9jEig00&", "gpx");


/* проверка соединения */
if ($mysqli->connect_errno) {
    printf("Не удалось подключиться: %s\n", $mysqli->connect_error);
    exit();
}



$sql_insert = "INSERT INTO strava_cache (z,x,y,s,d) VALUES ".substr($inserts,1);

$sql_create_tab ="CREATE TABLE `strava_cache` (
 `z` int(11) NOT NULL,
 `x` int(11) NOT NULL,
 `y` int(11) NOT NULL,
 `s` int(11) NOT NULL,
 `d` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8";

tm("7. inserts start");

if (
    !$mysqli->query("DROP TABLE IF EXISTS strava_cache") ||
    !$mysqli->query($sql_create_tab) ||
    !$mysqli->query($sql_insert)) {
    echo "Не удалось создать таблицу: (" . $mysqli->errno . ") " . $mysqli->error;
}




$sql_select_group = "select count(*), t.z, t.rng from 
(select z, case    
    when (UNIX_TIMESTAMP()-d) between 0 	and 1800 	then '1rgb(200,  0,  0)'
    when (UNIX_TIMESTAMP()-d) between 1801 	and 21600 	then '2rgb(255, 110, 20)'  
    when (UNIX_TIMESTAMP()-d) between 21601 and 86400	then '3rgb(250, 250, 10)'  
    when (UNIX_TIMESTAMP()-d) between 86401 and 172800	then '4rgb(100, 230, 10)'  
    when (UNIX_TIMESTAMP()-d) between 172801 and 432000	then '5rgb(30, 180, 15)'  
    when (UNIX_TIMESTAMP()-d) between 432001 and 1209600	then '6rgb(50, 150, 125)'   
    else '7rgb( 150,180,160)'   
    end as rng  
  from strava_cache) t
group by t.z, t.rng  
ORDER BY t.z, t.rng ASC";






tm("7. inserts end >>>>");


/* Создание таблицы не возвращает результирующего набора */
//if ($mysqli->query("CREATE TEMPORARY TABLE myCity LIKE City") === TRUE) {
//    printf("Таблица myCity успешно создана.\n");
//}


?>
</html>