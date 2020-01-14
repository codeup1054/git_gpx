<?php
  $folder   = '.';
  $extList  = array( "gif", "jpg", "jpeg", "png" );
  $image    = false;

  if ( substr( $folder, -1 ) != '/' ) {
    $folder = $folder.'/';
  }

  if ( isset( $_GET["img"] ) ) {
    $imageExtn  = strtolower( pathinfo( $_GET["img"], PATHINFO_EXTENSION ) );
    $imageName  = basename( $_GET["img"] );
    if ( in_array( $imageExtn, $extList ) && file_exists( $folder.$imageName ) ) {
      $image  = $folder.$imageName;
    }
  }
  else {
    $fileList = array();
    $handle   = opendir( $folder );
    while( false !== ( $file = readdir( $handle ) ) ) {
      $fileExtn = strtolower( pathinfo( $file, PATHINFO_EXTENSION ) );
      if ( in_array( $fileExtn, $extList ) ) {
        $fileList[] = $file;
      }
    }
    closedir( $handle );

    if ( !empty( $fileList ) ) {
      $imageNumber  = time() % count( $fileList );
      $image  = $folder.$fileList[$imageNumber];
    }
  }

  if ( $image !== false ) {
    $contents = implode( "", file( $image ) );
    $md5  = md5( $contents );
    $mtime  = filemtime( $image );
    $etag = etag( $md5, $mtime );

    $r_mtime  = 0;
    $r_etag   = null;

    if ( isset( $_SERVER["HTTP_IF_MODIFIED_SINCE"] ) ) {
      $r_mtime  = strtotime( $_SERVER["HTTP_IF_MODIFIED_SINCE"] );
    }
    if ( isset( $_SERVER["HTTP_IF_NONE_MATCH"] ) ) {
      $r_etag   = trim( $_SERVER["HTTP_IF_NONE_MATCH"] );
    }

    if ( $mtime == $r_mtime && $r_etag == $etag ) {
      header( "HTTP/1.0 304 Not Modified", true, 304 );
      header( "HTTP/1.1 304 Not Modified", true, 304 );
      header( "Content-length: 0" );
      exit;
    }

    header( "Content-type: image/".strtolower( pathinfo( $image, PATHINFO_EXTENSION ) ) );
    header( "Last-Modified: ".gmdate( "D, d M Y H:i:s", $mtime )." GMT" );
    header( "ETag: ".$etag );
    header( "Expires: ".gmdate( "D, d M Y H:i:s", time()+3600 )." GMT" );
    header( "Cache-Control: max-age=3600" );
    header( "Cache-Control: public" );

    echo $contents;
    exit();
  }
  else {
    if ( function_exists( "imagecreate" ) ) {
      header( "Content-type: image/png" );
      $im = @imagecreate( 100, 100 ) or die( "Cannot initialize new GD image stream" );
      $background_color = imagecolorallocate( $im, 255, 255, 255 );
      $text_color = imagecolorallocate( $im, 0, 0, 0 );
      imagestring( $im, 2, 5, 5,  "IMAGE ERROR", $text_color );
      imagepng( $im );
      imagedestroy( $im );
    }
  }

  function etag( $string_1 = null, $string_2 = null, $quote = true ) {
    $quote  = ( $quote ) ? '"' : '';
    $etag   = sprintf( $quote."%s-%s".$quote, $string_1, $string_2 );
    return $etag;
  }
?>