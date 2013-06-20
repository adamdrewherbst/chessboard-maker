<html>
	<head>
		<?php include 'init.php'; ?> <!--ensure required SQL tables exist-->
		<link type="text/css" rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"></link>
		<link type="text/css" rel="stylesheet" href="../aPaint/wColorPicker/wColorPicker.css"></link>
		<link type="text/css" rel="stylesheet" href="../aPaint/wPaint/wPaint.css"></link>
		<link type="text/css" rel="stylesheet" href="style.css"></link>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
		<script type="text/javascript" src="../aPaint/fabric-js/dist/all2.js"></script>
		<script type="text/javascript" src="../aPaint/wColorPicker/wColorPicker.js"></script>
		<script type="text/javascript" src="../aPaint/wPaint/wPaint2.js"></script>
		<script type="text/javascript" src="chessboard.js"></script>
	</head>
	<body>
		<p>Click on a square to edit the piece.</p>
		<div id="piece-window">
			<div id="piece-canvas-container">
				<!--<canvas id="piece-canvas"></canvas>-->
			</div>
			<div id="piece-fabric-controls">
				<button class="piece-fabric-control" id="pfc-draw" type="button"></button>
				<button class="piece-fabric-control" id="pfc-fill" type="button"></button>
				<button class="piece-fabric-control" id="pfc-img" type="button"></button>
			</div>
		</div>
	</body>
</html>

