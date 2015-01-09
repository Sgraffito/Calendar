<?php
// must be POSTed
   // date: date in a PHP-acceptable form (e.g. "28 October 1993" would work) of events to be looked up
// returns JSON encoded array of events on that day, with each entry being an array containing:
   // id, event name, start time (YYYY-MM-DD HH:II:SS format), end time (as start time)

// url, name, and login info of database
$dburl = "alumen.fishsicles.net";
$dbuser = "tsp";
$dbpasswd = "hello";
$dbname = "testdb";
// connect to database
$db = new mysqli($dburl,$dbuser,$dbpasswd,$dbname);

// retrieve date from POST
$date = date("Y-m-d",strtotime($_POST["date"]));
// query string: get all data on events where the date matches the given date
$queryStr = "SELECT * FROM Events WHERE date(starttime)='".$date."'";
// run query and store results in $result
$result = $db->query($queryStr);

//echo $date;

// print all rows to console
while ($next = $result->fetch_array())
{
   $string = '<li><a href="#" onclick="showDeletePopOver('.$next[0].'); return false;">'.date("H:i",strtotime($next[2])).' to '.date("H:i",strtotime($next[3])).' '.$next[1];
   if ( $next[4] != null ) { $string = $string.' at '.$next[4]; }
   $string = $string.'</a></li>';
   echo $string;
}

// free result structure and close database connection
$result->free();
$db->close();
?>