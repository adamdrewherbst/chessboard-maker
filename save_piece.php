<?php

include_once 'dbconnect.php';

$user = $_POST['user'];
$board = $_POST['board'];
$color = $_POST['color'];
$rank = $_POST['rank'];
$image = $_POST['image'];

$basefile = 'images/' . $user.'_'.$board.'_'.$color.'_'.$rank.'.svg';
$filename = __DIR__ . '/' . $basefile;
$file = fopen($filename, 'w');
fwrite($file, $image);
fclose($file);

lock('ChessPiece', 'WRITE');
if(insert('ChessPiece', 'User,Board,Color,Rank,Filename',
	'("'.$user.'","'.$board.'","'.$color.'","'.$rank.'","'.$basefile.'")', false) === false)
		update('ChessPiece', 'Filename="'.$basefile.'"', 'User="'.$user.'" AND Board="'.$board.'" AND Color="'.$color.'" AND Rank="'.$rank.'"');
unlock();

succeed(array('filename' => $basefile));

?>
