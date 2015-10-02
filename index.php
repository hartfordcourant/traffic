<?php

function getActiveEvents(){
  // message explaining what happened to the file
  $message="";
  // server authentication
  $ftp_server = 'sfile.ct.gov';
  $ftp_user_name = 'xxx'; // Username
  $ftp_user_pass = 'xxx'; // Password
  
  // set up basic connection
  $conn_id = ftp_connect($ftp_server);

  
  if($conn_id){
    // login with username and password
    $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);
    
    // check if our file exists, if so get it. if not, do nothing
    $check_file_exist = 'CurrentActiveEvents.xml';
    $path = 'DOT_ITIM';
    $contents_on_server = ftp_nlist($conn_id, $path);
      
    if (in_array(($path . "/" . $check_file_exist), $contents_on_server)){
      // go get the file
      $d = ftp_nb_get($conn_id,"CurrentActiveEvents.xml","DOT_ITIM/CurrentActiveEvents.xml",FTP_BINARY);
      // download the file
      while ($d == FTP_MOREDATA){
        // continue downloading
        $d = ftp_nb_continue($conn_id);
      }
      if ($d != FTP_FINISHED){
        $message = "Error downloading CurrentActiveEvents.xml";
      }
      else{
        $message = "Succesfully downloaded CurrentActiveEvents.xml";
        // close the connection
        ftp_close($conn_id);
        // correct sytax of xml file
        $file_data = '<?xml version="1.0"?>';
        $file_data .= file_get_contents('CurrentActiveEvents.xml');
        file_put_contents('CurrentActiveEvents.xml', $file_data);
      }
      $message =  $path . "/" . $check_file_exist . " is available, replacing old file.";
    }
    else{
      $message =  $path . "/" . $check_file_exist . " is unavailable, using old file.";
    }
    return $message;
  }
}

$result_message = getActiveEvents();

?>

<!DOCTYPE html>
<html>
    <?php include 'layouts/header.htm'; ?>
    <body>
      <!-- Debugging message saying what happened to the incident file -->
      <div id="message">
        <?php echo $result_message; ?>
      </div>
        
        <?php include 'layouts/nav.htm'; ?>

        <!-- The table of incidents goes here -->
        <div id="results">
          <table><tbody>
          <?php
            if (file_exists('CurrentActiveEvents.xml')) {
                
                $xml = simplexml_load_file('CurrentActiveEvents.xml');
                $json = json_encode($xml);
                $results = json_decode($json,TRUE);

                foreach($results["event"] as $result){
                  echo "<tr>";
                  foreach($result as $incident){ 
                    echo "<td>" . $incident['upstreamtown'] . "</td>";
                    echo "<td>" . $incident['lat'] . "</td>";
                    echo "<td>" . $incident['long'] . "</td>";
                    echo "<td>" . $incident['description'] . "</td>";
                    echo "<td>" . $incident['detectiontime'] . "</td>";
                    echo "<td>" . $incident['estimatedduration'] . "</td>";
                  }
                  echo "</tr>";
                }
            }else {
                echo 'Failed to open file.';
            }
          ?>
          </tbody></table>
        </div>

        <!-- The google map goes here -->
        <div id="map-canvas" class="container"></div>
        
        <?php include 'layouts/scripts.htm'; ?>
        
    </body>
</html>
