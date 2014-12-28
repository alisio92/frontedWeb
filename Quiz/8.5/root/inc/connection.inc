<?php
/**
 * Created by PhpStorm.
 * User: alisio
 * Date: 23/11/2014
 * Time: 13:41
 */
$ip = "localhost";
$port = "3307";
$user = "root";
$pass = "usbw";
$database = "Quiz";

/*
$password = $_POST['password'];
$salt = "8dC_9Kl?";
$encrypted password = md5($password . $salt);

The encrypted password would be stored in the database. Then, if you wanted to log the user in and compare what they entered against the database:

$db_password = ""; //get the password from the database
if (md5($password . $salt) == $db_password)
{
// continue...
}
 */

function get_connect(){
    global $ip, $port, $user, $pass;
    $conn = mysql_connect($ip.":".$port, $user, $pass);
    if(! $conn ) die('Could not connect: ' . mysql_error());
    return $conn;
}

function init_database(){
    echo 'defuck';
    /*$conn = get_connect();
    $sql = 'CREATE Database IF NOT EXISTS Quiz';
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create database: ' . mysql_error());
    mysql_close($conn);
    create_tables('rank');
    create_tables('users');*/
}

function create_tables($name){
    global $database;
    $conn = get_connect();
    $query_file = 'queries/'.$name.'.txt';

    $fp = fopen($query_file, 'r');
    $sql = fread($fp, filesize($query_file));
    fclose($fp);

    mysql_select_db($database);
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create table: ' . mysql_error());
    mysql_close($conn);
}

?>