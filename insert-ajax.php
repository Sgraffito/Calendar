<?php
// must be POSTed the following:
   // name: the name of the event
   // start (optional): full start time and date of the event, in a PHP-acceptable DATE/TIME format [e.g. "28 October 1993 1:28" works fine]
   // end (optional): full end time and date of the event, in a PHP-acceptable DATE/TIME format
   // location (optional): location of the event
// inserts an event with the given name, start, end, and description [used for location] into the database; no return value
$eventName = $_POST["name"];
$eventStart = date("Y-m-d H:i", strtotime($_POST["start"]));
$eventEnd = date("Y-m-d H:i", strtotime($_POST["end"]));
if (isset($_POST["location"]) && !empty($_POST["location"])) {
   $eventDesc = $_POST["location"];
} else { $eventDesc = null; }

// url, name, and login info of database
$dburl = "alumen.fishsicles.net";
$dbuser = "tsp";
$dbpasswd = "hello";
$dbname = "testdb";
// connect to database
$db = new mysqli($dburl,$dbuser,$dbpasswd,$dbname);
if ($db->connect_errno) {
   $response_array['status'] = 'error';
} else {
   $response_array['status'] = 'success';
   // prepare a query string
   $query = $db->prepare("INSERT INTO Events (Name, StartTime, EndTime, Description) VALUES (?, ?, ?, ?)");
   // place the values for the parameters into the query string
   $query->bind_param('ssss', $eventName, $eventStart, $eventEnd, $eventDesc);
   // run the query with substituted values
   $query->execute();
   // store key
   $response_array['key'] = $db->insert_id();
   
   // close database connection
   $db->close();
}

header('Content-type: application/json');
echo json_encode($response_array);
?>