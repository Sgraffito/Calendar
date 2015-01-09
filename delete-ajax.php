<?php
// must be POSTed
   // uid: unique identifier of the event to be deleted; given as the first element of the row returned by list-ajax.php
// no return

// url, name, and login info of database
$dburl = "alumen.fishsicles.net";
$dbuser = "tsp";
$dbpasswd = "hello";
$dbname = "testdb";
// connect to database
$db = new mysqli($dburl,$dbuser,$dbpasswd,$dbname);

// delete matching event; always only one
$db->query("DELETE FROM Events WHERE id=".$_POST["uid"]);
?>