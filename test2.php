<html>
  <head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses', 'Profit'],
          ['2014', 1000, 400, 200],
          ['2015', 1170, 460, 250],
          ['2016', 660, 1120, 300],
          ['2017', 1030, 540, 350]
        ]);

        var options = {
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('columnchart_material'));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }
    </script>
  </head>
  <body>
  
  <?php 
  
  
    $a = array(1,2);
    $b = array(3,'4');
    $c = array('4',3);
    $a = $b;
    //У этих массивов ключи имеют одинаковые значения 0 и 1
  print "*** |".($b == $a)."|<br />";
  print "*** |".($c == $b)."|<br />";
  
  foreach($c as $x=>$v) print $x.":".$v."<br />";
  
  print_r ($c);
  
  $x=3; $y=$x*0.4;
  $z = $x/$y;
  
  while (abs($z -$y) > 1e-10)
    { $y =($z + $y)/2;
    $z = $x/$y;
    print $y."<br />";
    }
  
  print "<br />$y<br />".pow($x, 1/2)."<br />";
  
  $S = 0; $i = 0;
    while($S< 5)
    { $i++;
    $S += $i;
    }
    print "S=$S<BR>"; //S=15
  
    $a =5; $b = 2;
    $L = $a && $b; //$L=true
    $L1 = $a and $b; //$L1=5
    
    print "$L $L1";
  ?> 
  
    <div id="columnchart_material" style="width: 800px; height: 500px;"></div>
  </body>
</html>