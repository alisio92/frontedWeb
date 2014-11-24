<?php
/**
 * Created by PhpStorm.
 * User: alisio
 * Date: 23/11/2014
 * Time: 13:50
 */
include_once("php/connection.inc");
init_database();
?>

<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link href="bootstrap/css/bootstrap.css" rel="stylesheet"/>
    <link href="css/opmaak.css" rel="stylesheet"/>
</head>
<body>
<header>
    <nav>
        <ul>
            <li><a href="" title="Ga naar Admin pagina" alt="Ga naar Admin pagina">Admin</a></li>
            <li title="Open Login window" alt="Open Login window" id="login">Login</li>
            <li title="Open Registratie window" alt="Open Registratie window" id="register">Registreren</li>
        </ul>
    </nav>
</header>
<div id="content">
</div>
<footer>
    <nav>
        <ul>
            <li>Aantal online:0</li>
        </ul>
    </nav>
</footer>
<script src="scripts/modernizr.js"></script>
<script src="scripts/index.js"></script>
</body>
</html>