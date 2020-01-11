<html>
<head>
    <link href="gpx.css" rel="stylesheet" type="text/css" /> 
</head>
<style>
 .cache td:nth-child(n+2):nth-child(-n+4){
    text-align: right;
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

function tm($s = '')
{
    global $time_start, $time_lap;    
    $t  = microtime(true);

    if ($s == '') $time_start = microtime(true);
    else printf("+%0.6f <sup>%0.3f %s</sup><sub>%s</sub><br/>", 
                ($t - $time_lap), 
                ($t - $time_start), 
                date('M-d H:i:s', time()),
                $s
                );
    
    //print (": ".$s.", ".($t - $time_start));
    
    

    $time_lap = $t; 
}


tm();

$c_day_cnt = array();
$cache_files = array();

$du_size = ""; // размер подпапок 

// find . -mmin -120 -type f  -exec ls -la {} + | awk '{s+=$5} END {print "Total SIZE: " s}'
// $io = popen ( "cd ./img_cache/; find . -mmin -120 -type f -exec ls -l {} + | awk '{ print $5, $6 , $7, $8, $9 }'", 'r' );

$io = popen ( "cd ./img_cache/; find . -mmin -120000 -type f -exec ls -l --time-style=+%s {} + | awk '{ print $5\"/\"$6\"/\"$7 }'", 'r' );

tm("<br />01. get find");

$total_size = 0;
$total_cnt = 0;

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
        $y = $p[5]; // y
        
        $total_size_zoom[$z] = (isset($total_size_zoom[$z]))?$total_size_zoom[$z]+$s:$s;
        
//        $delt = time()-strtotime ($l[1].' '.$l[2].' '.$l[3]);
        $delt = time()-$p[1];

        $d_c = d_color($delt);
        
        $bar[$z][$d_c] = (isset($bar[$z][$d_c]))?$bar[$z][$d_c]+1:1;
        $size[$z][$d_c] = (isset($size[$z][$d_c]))?$size[$z][$d_c]+$s:$s;
        
        $cache_files[$z][$x][trim($y)] = 
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
    $dv = "";
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
        
        $dv .= "<div title='$vv' style='font-size:15px; display:inline-block; background-color:$clr; height:19px; width:".($vv/3 )." '>".$vv."</div>";
    }

    $mean_size = $l_size/$cnt;


    $dv_cnt = "$cnt<br /><div title='$vv' style='width:".($cnt/50)." '></div>";

    $dv_size = floor($l_size/1024)."<br /><div title='$vv' style='margin: auto;  background-color:lightgray; 
                                      height:5px; width:".($l_size/1000000 )." '></div>";


    $dv_mean_size = floor($mean_size)."<br /><div title='$vv' style='margin: auto;  background-color:lightgray; 
                                      height:5px; width:".($mean_size/200 )." '></div>";


   
    $l .= "<tr>
                <td>$k</td>
                <td>$dv_cnt</td>
                <td>$dv_size</td>
                <td>$dv_mean_size</td>
                <td style='background:url(bkg.png);'>".$dv."</td>
            </tr>";
    
    
    
}


$dv = "<div title='$vv' style='font-size:15px; display:inline-block; background-color:$clr; height:19px; width:".($vv/3 )." '>".$vv."</div>";
echo "<table class='stab cache'>
<tr><td>№</td>
    <td>Количество</td>
    <td>Размер</td>
    <td>Ср. размер</td>
    <td>Диаграмма</td>
</tr>

$l
<tr><td>Total</td>
    <td>$total_cnt</td>
    <td>".floor($total_size/1024)."</td>
    <td>".floor($total_size/$total_cnt)."</td>
    <td></td>
</tr>
</table>";

tm("05. echo table");

$files = glob('./img_cache/*');
print_r (usort($files, 'cmp'));


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
      $t /= 60; 
      if  ($t < 0)          return '0rgb( 10,  0,  0)';
      elseif  ($t < 30)     return '1rgb(200,  0,  0)';
      elseif ($t < 60*6)      return '2rgb(255, 110, 20)';
      elseif ($t < 60*24)    return '3rgb(250,250, 10)';
      elseif ($t < 60*24*2)   return '4rgb(100,230, 10)';
      elseif ($t < 60*24*5) return '5rgb( 30,180, 15)';
      elseif ($t < 60*24*14) return '6rgb( 50,150,125)';
                            return '7rgb( 150,180,160)';

}

?>

</html>