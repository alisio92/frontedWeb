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
$init = false;
$createUser = false;
$checkUserExists = false;

if(!empty($_POST['init'])) $init = $_POST['init'];
if(!empty($_POST['createUser'])) $createUser = $_POST['createUser'];
if(!empty($_POST['checkUserExists'])) $checkUserExists = $_POST['checkUserExists'];

if ($init){
    init_database();
}

if ($createUser){
    $name =  $_POST['name'];
    $pass = $_POST['pass'];
    if($name!=null && $pass!=null) create_user($name, $pass);
}

if ($checkUserExists){
    $name =  $_POST['name'];
    $pass = $_POST['pass'];
    if($name!=null && $pass!=null) check_user_exists($name, $pass);
}

function get_connect(){
    global $ip, $port, $user, $pass;
    $conn = mysql_connect($ip.":".$port, $user, $pass);
    if(! $conn ) die('Could not connect: ' . mysql_error());
    return $conn;
}

function get_connect_database(){
    global $ip, $port, $user, $pass, $database;
    $conn = new mysqli($ip, $user, $pass, $database, $port);
    if ($conn->connect_error) die('Connect Error (' . $conn->connect_errno . ') ' . $conn->connect_error);
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
    create_rank("admin", "1");
    create_rank("user", "0");
    echo true;
}

function create_rank_tables(){
    global $database;
    $conn = get_connect();

    $sql = "CREATE TABLE IF NOT EXISTS `rank` (
  `id` int(255) NOT NULL PRIMARY KEY auto_increment,
  `name` varchar(255) NOT NULL default '',
  `admin` int(1) default 0
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

function create_rank($name, $rank){
    $conn = get_connect_database();
    $sql = "INSERT INTO rank(name, admin) VALUES(?,?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $name, $rank);
    if($stmt->execute()) {
        $stmt->close();
        $conn->close();
    }
}

function create_user($name, $pass){
    $conn = get_connect_database();
    $rank = "1";
    $score = "0";

    $sql = "INSERT INTO users(name, rank, password, score) VALUES(?,?,?,?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sisi", $name, $rank, $pass, $score);
    if($stmt->execute()) {
        $stmt->close();
        $conn->close();
        echo true;
    }
}

function check_user_exists($name, $pass){
    $conn = get_connect_database();
    $sql = "SELECT name, password, rank FROM users WHERE name=? AND password=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $name, $pass);
    $stmt->execute();

    $result = $stmt->get_result();

    if(!$result) die('Probleem met de query: ' . $conn->error);

    while($row = $result->fetch_array(MYSQLI_ASSOC)){
        echo $row['name'].':'.$row['password'].':'.$row['rank'];
    }
}
?>