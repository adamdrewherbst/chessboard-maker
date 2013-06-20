var wPaintCanvas, fabricCanvas;

function setPaintPanel($elem) {
	$elem.wPaint({
	    mode                 : 'Pencil',         // drawing mode - Rectangle, Ellipse, Line, Pencil, Eraser
		lineWidthMin         : '0',              // line width min for select drop down
		lineWidthMax         : '10',             // line widh max for select drop down
		lineWidth            : '2',              // starting line width
		fillStyle            : '#000000',        // starting fill style
		strokeStyle          : '#FFFF00',        // start stroke style
		fontSizeMin          : '8',              // min font size in px
		fontSizeMax          : '20',             // max font size in px
		fontSize             : '12',             // current font size for text input
		fontFamilyOptions    : ['Arial', 'Courier', 'Times', 'Trebuchet', 'Verdana'],
		fontFamily           : 'Arial',          // active font family for text input
		fontTypeBold         : false,            // text input bold enable/disable
		fontTypeItalic       : false,            // text input italic enable/disable
		fontTypeUnderline    : false,            // text input italic enable/disable
		image                : null,             // preload image - base64 encoded data
		imageBg              : null,             // preload image bg, cannot be altered but saved with image
		drawDown             : null,             // function to call when start a draw
		drawMove             : null,             // function to call during a draw
		drawUp               : null,             // function to call at end of draw
		menu                 : ['undo','clear','select','rectangle','ellipse','line','pencil','text','eraser','fillColor','lineWidth','strokeColor'], // menu items - appear in order they are set
		menuOrientation      : 'horizontal',      // orinetation of menu (horizontal, vertical)
		menuOffsetX          : 5,                // offset for menu (left)
		menuOffsetY          : 5,                 // offset for menu (top)
		menuTitles           : {                 // icon titles, replace any of the values to customize
					                'undo': 'undo',
					                'redo': 'redo',
					                'clear': 'clear',
					                'select': 'select',
					                'rectangle': 'rectangle',
					                'ellipse': 'ellipse',
					                'line': 'line',
					                'pencil': 'pencil',
					                'text': 'text',
					                'eraser': 'eraser',
					                'fillColor': 'fill color',
					                'lineWidth': 'line width',
					                'strokeColor': 'stroke color',
					                'bold': 'bold',
					                'italic': 'italic',
					                'underline': 'underline',
					                'fontSize': 'font size',
					                'fontFamily': 'font family'
					            },
		disableMobileDefaults: false             // disable default touchmove events for mobile (will prevent flipping between tabs and scrolling)
	});
	
	wPaintCanvas = $elem.data('_wPaint');
	$(wPaintCanvas.canvas).attr('id', 'wpCanvas');
	console.info(wPaintCanvas.canvas);
	
	fabricCanvas = new fabric.Canvas('wpCanvas', {
		backgroundColor: 'rgba(255,255,255,0.0)',
	});
	wPaintCanvas.setFabricCanvas(fabricCanvas);
	
	wPaintCanvas.calcOffset();
	fabricCanvas.calcOffset();
	
	wPaintCanvas.mainMenu.set_mode(wPaintCanvas.mainMenu, wPaintCanvas, 'Pencil');
	
	/*var line = new fabric.Line([50,50,100,100], {stroke: 'red', strokeWidth: 5});
	fabCanvas.add(line);
	line.set({x1: 100, y1: 100, x2: 200, y2: 200});
	line.setCoords();
	fabCanvas.renderAll();//*/
	
	//console.info(wPaintCanvas);
	//console.info(fabricCanvas);
}

function Board(rows, cols, squareLength) {
	this.rows = rows;
	this.cols = cols;
	this.squareLength = squareLength;
	this.$board = $('<div></div>');
	for(var n = 0; n < rows*cols; n++) {
		//generate the square
		var col = n % cols, row = Math.floor(n / cols);
		var tag = '<div class="square ';
		tag += ((row + col) % 2 == 0) ? 'black' : 'white';
		if(col == 0) tag += ' first left';
		else if(col == cols-1) tag += ' right';
		if(row == 0) tag += ' top';
		else if(row == rows-1) tag += ' bottom';
		tag += '"></div>';
		var $square = $(tag);
		
		//determine if a piece belongs here
		if(row < 2 || row > rows-3) {
			$square.append('<img class="piece_img" src="images/BLANK_PIECE.svg"></img>');
			var team = row < 2 ? 'White' : 'Black';
			if(row == 1 || row == rows-2) piece = 'Pawn';
			else switch(col) {
				case 0:
				case cols-1:
					piece = 'Rook';
					break;
				case 1:
				case cols-2:
					piece = 'Knight';
					break;
				case 2:
				case cols-3:
					piece = 'Bishop';
					break;
				case 3:
					piece = 'King';
					break;
				case cols-4:
					piece = 'Queen';
					break;
				default:
					piece = 'Unknown';
					break;
			}
			$square.attr('color', team);
			$square.attr('rank', piece);
			$square.attr('piece', team + ' ' + piece);
			$square.attr('title', team + ' ' + piece);
			$square.tooltip({
				track: true
			});//*/
			
			//allow the user to edit the piece image by clicking on this square
			$square.click(function(event) {
				var $tgt = $(this);
				var squareTitle = $tgt.attr('piece'), squareColor = $tgt.attr('color'), squareRank = $tgt.attr('rank');
				console.log('making dialog ' + squareTitle + ' for ' + $tgt[0].tagName + ' .' + $tgt[0].className);
				var $dialog = $('#piece-window');
				$dialog.dialog({
					dialogClass: 'piece-window-dialog',
					title: squareTitle,
					position: 'top',
					modal: true,
					width: 600,
					height: 480,
					maxWidth: 1000,
					maxHeight: 1000,
					closeOnEscape: true,
					buttons: [
						{
							text: 'Cancel',
							click: function() {
								$dialog.dialog('close');
							}
						},
						{
							text: 'Save',
							click: function() {
								var img = fabricCanvas.toSVG(), json = fabricCanvas.toJSON();
								console.info(img);
								$.ajax({
									url:'save_piece.php',
									type: 'POST',
									data: {user: 'test', board: 'test', color: squareColor, rank: squareRank, image: img},
									dataType:'json',
									success: function(data) {
										console.log('ajax success: ' + data.response);
										//insert the returned svg file into all squares of the same color and rank
										var $squares = $('.square[piece="'+squareTitle+'"]');
										$squares.children('.piece_img').attr('src', data.filename+'?'+(new Date().getTime()));
										$squares.data('imgJSON', json);
										$dialog.dialog('close');
									},
									error: function(jqXHR, textStatus, errorThrown) {
										console.log('ajax - ' + textStatus + ': ' + errorThrown);
									}
								});
							}
						},
					],
					close: function(event, ui) {
					}
				});
				wPaintCanvas.calcOffset();
				fabricCanvas.calcOffset();
				var curImg = $tgt.data('imgJSON');
				if(curImg) {
					fabricCanvas.loadFromJSON(curImg);
				}
				else fabricCanvas.clear();
				wPaintCanvas.mainMenu.set_mode(wPaintCanvas.mainMenu, wPaintCanvas, 'Pencil');
				console.info($(wPaintCanvas.canvas).offset());
				console.info($(fabricCanvas.upperCanvasEl).offset());
			});
		}
		this.$board.append($square);
	}
}

$(document).ready(function() {

	var board = new Board(8, 8, 100);
	$('body').append(board.$board);
	//$canvas = $('#piece-canvas'); //'<canvas id="piece-canvas"></canvas>');
	//$canvas.detach();
	setPaintPanel($('#piece-canvas-container'));

});
