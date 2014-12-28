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
$init = $_POST['init'];

if ($init == true){
    init_database();
}

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
    create_rank_tables();
    create_users_tables();
    create_question_tables();
}

function create_rank_tables(){
    global $database;
    $conn = get_connect();

    $sql = "CREATE TABLE IF NOT EXISTS `rank` (
  `id` int(255) NOT NULL PRIMARY KEY auto_increment,
  `name` varchar(255) NOT NULL default '',
  `admin` bit NOT NULL default ''
)";
    mysql_select_db($database);
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create table: ' . mysql_error());
    mysql_close($conn);
}

function create_users_tables(){
    global $database;
    $conn = get_connect();

    $sql = "CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL PRIMARY KEY auto_increment,
  `name` varchar(255) NOT NULL default '',
  `rank` int(255) NOT NULL default 0,
  `password` varchar(255) NOT NULL default '',
  `score` int(255) NOT NULL default 0,
  FOREIGN KEY (rank) REFERENCES rank (id)
)";

    mysql_select_db($database);
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create table: ' . mysql_error());
    mysql_close($conn);
}

function create_question_tables(){
    global $database;
    $conn = get_connect();

    $sql = "CREATE TABLE IF NOT EXISTS `question` (
  `id` int(255) NOT NULL PRIMARY KEY auto_increment,
  `img` varchar(255) NOT NULL default '',
  `question` varchar(255) NOT NULL default '',
  `answer1` varchar(255) NOT NULL default '',
  `answer2` varchar(255) NOT NULL default '',
  `answer3` varchar(255) NOT NULL default '',
  `answer4` varchar(255) NOT NULL default '',
  `correct` int(3) NOT NULL default 0
)";

    mysql_select_db($database);
    $retval = mysql_query( $sql, $conn );
    if(! $retval ) die('Could not create table: ' . mysql_error());
    mysql_close($conn);
}
?>