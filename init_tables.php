<?php //assumes dbconnect has been called

global $mysqli, $response;

function initTable($tbl, $cols, $keycol, $extra = '') {
	global $mysqli, $response;
	
	$query = 'CREATE TABLE ' . $tbl . '(';
	foreach($cols as $col) {
		$query .= $col['name'] . ' ' . strtoupper($col['type']) . ', ';
	}
	$query .= 'PRIMARY KEY (' . $keycol . ')';
	if(strlen($extra) > 0) $query .= ', ' . $extra;
	$query .= ')';
	if($mysqli->query($query) === TRUE) $response .= sprintf("Table %s successfully created.\n", $tbl);
	else $response .= sprintf("Could not create table %s\n", $tbl);
	
	return $response;
}

//ensure game table is initialized
$cols = array(
	array('name' => 'User', 'type' => 'VARCHAR(30)'),
	array('name' => 'Board', 'type' => 'VARCHAR(30)'),
	array('name' => 'Color', 'type' => 'VARCHAR(25)'),
	array('name' => 'Rank', 'type' => 'VARCHAR(25)'),
	array('name' => 'Filename', 'type' => 'VARCHAR(100)'),
);
initTable('ChessPiece', $cols, 'User,Board,Color,Rank');

?>
