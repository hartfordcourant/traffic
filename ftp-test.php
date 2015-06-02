<?php

$ftp_server = 'sfile.ct.gov';
$ftp_user_name = 'ITIMdata'; // Username
$ftp_user_pass = 'ITIM2909'; // Password
// set up basic connection
$conn_id = ftp_connect($ftp_server);

// login with username and password
$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

// get the file list for /
$d = ftp_nb_get($conn_id,"CurrentActiveEvents.xml","CurrentActiveEvents.xml",FTP_BINARY);

while ($d == FTP_MOREDATA){
  // do whatever you want
  // continue downloading
  $d = ftp_nb_continue($conn_id);
}

if ($d != FTP_FINISHED){
  echo "Error downloading $server_file";
  exit(1);
}
// close the connection
ftp_close($conn_id);

$file_data = '<?xml version="1.0"?>';
$file_data .= file_get_contents('CurrentActiveEvents.xml');
file_put_contents('CurrentActiveEvents.xml', $file_data);

?>
