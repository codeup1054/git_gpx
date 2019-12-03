<?php


$action = $_REQUEST['a'];


switch($action)
{
    case 'update':
                $json_obj = json_decode ($_REQUEST['stations']); //, $assoc = true);
                
//                $json_obj  = array(array(1,2,3,4),array(1,2,3,4));

                print_r ($json_obj);
                
                $fp = fopen('data/stations_geo.csv', 'w');

                fputs($fp, "№		Название	Название-2	Соседние станции	Субъект РФ	Направление	lat	lng"."\n");
                                
                foreach ($json_obj as $rows) {
//                    fputcsv($fp, $rows, "\t",chr(0));
                    fputs($fp, implode($rows, "\t")."\n");
                }
                
                fclose($fp);
                break;
                
    case 'save_vb':
                $fp = fopen('data/vb.gpx', 'w');
                
                fputs($fp, $_REQUEST['vb_xml']);
                
                fclose($fp);
                
                break;
 
    default:
                $json_obj = json_decode ($_REQUEST['markers'], $assoc = true);
                
                print_r ($json_obj);
                
                
                $fp = fopen('file.csv', 'w');
                
                foreach ($json_obj as $rows) {
                    fputcsv($fp, $rows, "\t");
                }
                
                fclose($fp);
}

?>