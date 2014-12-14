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

function get_connect(){
    global $ip, $port, $user, $pass;
    $conn = mysql_connect($ip.":".$port, $user, $pass);
    if(! $conn ) die('Could not connect: ' . mysql_error());
    return $conn;
}

function init_database(){
    $conn = get_connect();
    $sql = 'CREATE Database IF NOT EXISTS Quiz';
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create database: ' . mysql_error());
    mysql_close($conn);
    create_tables('rank');
    create_tables('users');
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