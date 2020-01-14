 <?php

function test_fonts(){
    //load background
    $im = new Imagick();
    $im->newimage(800, 1000, 'lightgray');
    $y = 10;
    $i = 1;
    /*
//    print_r($im->queryFonts());
    
    foreach($im->queryFonts() as $font){
        $insert_image = new Imagick();
        $insert_image->newImage(600, 30, 'whitesmoke');
        $insert_image->setImageFormat("png");
        $draw = new ImagickDraw();
        $draw->setFont($font);
        $draw->setFontSize(25);
        $draw->setFillColor(new ImagickPixel('black'));
        $draw->setgravity(imagick::GRAVITY_NORTH);
        $insert_image->annotateImage($draw, 0, 0, 0, $i . '.' .  $font );
        $im->compositeImage( $insert_image,  $insert_image->getImageCompose(),100, $y);
        $y += 30;
        $i++;
    }
    */
    $im->setImageFormat('jpg');
    header('Content-Type: image/jpg');
    echo $im;
}

test_fonts();
/*
Array
(
    [0] =&gt; AvantGarde-Book
    [1] =&gt; AvantGarde-BookOblique
    [2] =&gt; AvantGarde-Demi
    [3] =&gt; AvantGarde-DemiOblique
    [4] =&gt; Bitstream-Vera-Sans-Bold
    [5] =&gt; Bitstream-Vera-Sans-Bold-Oblique
    [6] =&gt; Bitstream-Vera-Sans-Mono-Bold
    [7] =&gt; Bitstream-Vera-Sans-Mono-Bold-Oblique
    [8] =&gt; Bitstream-Vera-Sans-Mono-Oblique
    [9] =&gt; Bitstream-Vera-Sans-Mono-Roman
    [10] =&gt; Bitstream-Vera-Sans-Oblique
    [11] =&gt; Bitstream-Vera-Sans-Roman
    [12] =&gt; Bitstream-Vera-Serif-Bold
    [13] =&gt; Bitstream-Vera-Serif-Roman
    [14] =&gt; Bookman-Demi
    [15] =&gt; Bookman-DemiItalic
    [16] =&gt; Bookman-Light
    [17] =&gt; Bookman-LightItalic
    [18] =&gt; Century-Schoolbook-Bold
    [19] =&gt; Century-Schoolbook-Bold-Italic
    [20] =&gt; Century-Schoolbook-Italic
    [21] =&gt; Century-Schoolbook-Roman
    [22] =&gt; Courier
    [23] =&gt; Courier-Bold
    [24] =&gt; Courier-BoldOblique
    [25] =&gt; Courier-Oblique
    [26] =&gt; Dingbats-Regular
    [27] =&gt; fixed
    [28] =&gt; Helvetica
    [29] =&gt; Helvetica-Bold
    [30] =&gt; Helvetica-BoldOblique
    [31] =&gt; Helvetica-Narrow
    [32] =&gt; Helvetica-Narrow-Bold
    [33] =&gt; Helvetica-Narrow-BoldOblique
    [34] =&gt; Helvetica-Narrow-Oblique
    [35] =&gt; Helvetica-Oblique
    [36] =&gt; NewCenturySchlbk-Bold
    [37] =&gt; NewCenturySchlbk-BoldItalic
    [38] =&gt; NewCenturySchlbk-Italic
    [39] =&gt; NewCenturySchlbk-Roman
    [40] =&gt; Nimbus-Mono-Bold
    [41] =&gt; Nimbus-Mono-Bold-Oblique
    [42] =&gt; Nimbus-Mono-Regular
    [43] =&gt; Nimbus-Mono-Regular-Oblique
    [44] =&gt; Nimbus-Roman-No9-Medium
    [45] =&gt; Nimbus-Roman-No9-Medium-Italic
    [46] =&gt; Nimbus-Roman-No9-Regular
    [47] =&gt; Nimbus-Roman-No9-Regular-Italic
    [48] =&gt; Nimbus-Sans-Bold
    [49] =&gt; Nimbus-Sans-Bold-Condensed
    [50] =&gt; Nimbus-Sans-Bold-Condensed-Italic
    [51] =&gt; Nimbus-Sans-Bold-Italic
    [52] =&gt; Nimbus-Sans-Regular
    [53] =&gt; Nimbus-Sans-Regular-Condensed
    [54] =&gt; Nimbus-Sans-Regular-Condensed-Italic
    [55] =&gt; Nimbus-Sans-Regular-Italic
    [56] =&gt; Palatino-Bold
    [57] =&gt; Palatino-BoldItalic
    [58] =&gt; Palatino-Italic
    [59] =&gt; Palatino-Roman
    [60] =&gt; Standard-Symbols-Regular
    [61] =&gt; Symbol
    [62] =&gt; Times-Bold
    [63] =&gt; Times-BoldItalic
    [64] =&gt; Times-Italic
    [65] =&gt; Times-Roman
    [66] =&gt; URW-Bookman-Demi-Bold
    [67] =&gt; URW-Bookman-Demi-Bold-Italic
    [68] =&gt; URW-Bookman-Light
    [69] =&gt; URW-Bookman-Light-Italic
    [70] =&gt; URW-Chancery-Medium-Italic
    [71] =&gt; URW-Gothic-Book
    [72] =&gt; URW-Gothic-Book-Oblique
    [73] =&gt; URW-Gothic-Demi
    [74] =&gt; URW-Gothic-Demi-Oblique
    [75] =&gt; URW-Palladio-Bold
    [76] =&gt; URW-Palladio-Bold-Italic
    [77] =&gt; URW-Palladio-Italic
    [78] =&gt; URW-Palladio-Roman
    [79] =&gt; Utopia-Bold
    [80] =&gt; Utopia-Bold-Italic
    [81] =&gt; Utopia-Italic
    [82] =&gt; Utopia-Regular
)


*/
?>