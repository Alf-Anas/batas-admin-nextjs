<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
header('Access-Control-Allow-Origin: https://batas-admin.geoit.dev');
header('Access-Control-Allow-Methods: GET');
header("Access-Control-Allow-Headers: X-Requested-With");

$error_message = array(
   "code" => 422,
   "message" => "FID, Level and Feature Type is Required!",
);
header("Content-Type: application/json");

$fid = $_GET["fid"];
$table = $_GET["table"];
$column = $_GET["column"];

if (empty($fid) || empty($table) || empty($column)) {
   http_response_code(422);
   echo json_encode($error_message);
   die();
}

class MyDB extends SQLite3
{
   function __construct()
   {
      $this->open('batas_admin.sqlite');
   }
}

$db = new MyDB();
if (!$db) {
   http_response_code(500);
   // echo json_encode($db->lastErrorMsg());
   echo json_encode(array(
      "code" => 500,
      "message" => "Failed to connect to DB!",
   ));
   die();
} else {
   $queryDB = "SELECT * FROM $table WHERE $column LIKE '$fid%'";
   if ($column == "provinsi") {
      $queryDB = "SELECT * FROM $table WHERE $column = '$fid'";
   }

   $ret = $db->query($queryDB);
   $data_response = array();

   while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
      array_push($data_response, $row);
   }

   $echo_response = array(
      "code" => 200,
      "message" => "OK",
      "data" => $data_response,
   );
   http_response_code(200);
   echo json_encode($echo_response);
   $db->close();
   die();
}

http_response_code(500);
echo json_encode(array(
   "code" => 500,
   "message" => "Internal Server Error!",
));
die();
