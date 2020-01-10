<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$now = time();  
$var = array();



$c_day_cnt = array();



$du_size = ""; // размер подпапок 
$io = popen ( '/usr/bin/du -sk ./img_cache/ | sort -k 2', 'r' );

if ($io) {
    while (($line = fgets($io, 4096)) !== false) {
        $du_size .= "".str_replace("\t./img_cache/","-",$line);
    }
    fclose($io);
} else {
    // error opening the file.
} 

echo "<pre>".$du_size."</pre>";

$du_size = ""; // размер подпапок 
$io = popen ( '/usr/bin/du -sk ./img_cache/* | sort -k 2', 'r' );

if ($io) {
    while (($line = fgets($io, 4096)) !== false) {
        $du_size .= "".str_replace("\t./img_cache/","-",$line);
        
        
    }
    fclose($io);
} else {
    // error opening the file.
} 


echo "<pre>".$du_size."</pre>";


$files = glob('./img_cache/*');

//print_r ($files);

$lines = "";
$total_cnt=0;

print_r (usort($files, 'cmp'));


$col = array(
'2020-01-04' => 'rgb(0,150,0)', 
'2020-01-05' => 'rgb(50,200,15)', 
'2020-01-06' => 'rgb(200,250,20)', 
'2020-01-07' => 'rgb(250,100,20)',
'2020-01-08' => 'rgb(220,50,20)',
'0' => 'rgb(0,150,0)', 
'1' => 'rgb(50,200,15)', 
'2' => 'rgb(200,250,20)', 
'3' => 'rgb(250,100,20)' 
);

foreach($files as $k=>$v)
{
    $filecount = file_cnt($v);
    
    $sub_cnt = 0;
    
    foreach ($filecount['files'] as $kk=>$vv)
    {   
        $cnt3 = file_cnt($vv);
        $sub_cnt += $cnt3['cnt'];
    }     

//    print ($v.": ".print_r ( $c_day_cnt , 1)."<br />" );
    
    $dv = $dv2 = "";
    
    ksort($c_day_cnt[$v]);
    
    foreach($c_day_cnt[$v] as $kk=>$vv)
    {
//        $dv .= "<div title='$kk' style='font-size:15px; display:inline-block; background-color:".$col[$kk]."; height:19px; width:".($vv/7 )." '>".$vv."</div>";
    }

    krsort($c_day_cnt[$v."_"]);
    
    foreach($c_day_cnt[$v."_"] as $kk=>$vv)
    {   
        $clr=substr($kk, 1);
        $dv2 .= "<div title='$kk' style='font-size:15px; display:inline-block; background-color:$clr; height:19px; width:".($vv/7 )." '>".$vv."</div>";
    }

    
    $total_cnt += $sub_cnt; 
    
    $lines .="<tr>
                <td>$v</td>
                <td>".( $filecount['cnt'] )."</td>
                <td>".( $sub_cnt )."</td>
                <td style='background:url(bkg.png);'>".$dv2."</td>
            </tr>";
    
} 


// print_r($c_day_cnt); 


// <td><div style='background-color:green; height:7px; width:".($sub_cnt/10)." '></div></td>


print "<table><tr><td>$total_cnt</td>
       </tr>".$lines."</table>";


function file_cnt($f)
{
    
    global $c_day_cnt;
    global $now, $var;
    
    $files=glob($f ."/*");
    
    
    foreach( $files as $k=>$v)
    {
      
      $f_a = explode("/",$f);
      
      $f_root = $f_a[0]."/".$f_a[1]."/".$f_a[2]; 

      $fl  = $f_root;
      $t = date ("Y-m-d", filemtime($f));  
      $c_day_cnt[$fl][$t] = (isset($c_day_cnt[$fl][$t]))?$c_day_cnt[$fl][$t]+1 : 0 ;
      
    
      $now = time();  
      
      $fl  = $f_root."_";
      $t =  floor(($now - filemtime($f))/60);
      
      
      if  ($t < 0)   $t1 = '1rgb(10,0,0)';
      elseif  ($t < 15)   $t1 = '1rgb(200,0,0)';
      elseif ($t < 60) $t1 = '2rgb(255,70,20)';
      elseif ($t < 60*6) $t1 = '3rgb(250,240,10)';
      elseif ($t < 60*24) $t1 = '4rgb(100,230,10)';
      elseif ($t < 60*24*2) $t1 = '5rgb(30,180,15)';
      else $t1 = '6rgb(50,130,115)';
        
      $c_day_cnt[$fl][$t1] = (isset($c_day_cnt[$fl][$t1]))? $c_day_cnt[$fl][$t1]+1:0;
//      $c_day_cnt[$fl][$t] = (isset($c_day_cnt[$fl][$t]))? $c_day_cnt[$fl][$t]+1:0;

    }



    $filecount = count( $files );
    return array("cnt"=>$filecount, 'files' => $files, "c_day" => $c_day_cnt);
}


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


?>