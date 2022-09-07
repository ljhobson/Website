/*  Created By Louis Hobson 21/01/2022
    welcome to tic tac toe 3d.      */
   
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {right:false, down:false, prev:null, x:null, y:null};
document.onmousemove = function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}
document.onmousedown = function(event) {
	if (event.button === 0) {
		mouse.down = true;
	} else if (event.button === 2) {
		mouse.right = true;
	}
}
document.onmouseup = function(event) {
	if (event.button === 0) {
		mouse.down = false;
	} else if (event.button === 2) {
		mouse.right = false;
	}
}
document.onmousewheel = function(event) {
	zoom *= (0.9+((2-event.deltaY/100)-1)/10);
}
canvas.oncontextmenu = function(event) {
	event.preventDefault();
}
function rad(deg) {
	return deg*Math.PI/180;
}
function nxor(a, b) {
	return (a && b) || (!a && !b);
}
function mouseOn(x, y, w, h) {
	if (x < mouse.x && mouse.x < x+w && y < mouse.y && mouse.y < y+h) {
		return true;
	}
	return false;
}

var prevX = mouse.x;
var prevY = mouse.y;
var rotXV = 0;
var rotZV = 0;

var rotX = 45;
var rotZ = 0;
var zoom = 6;
var oldX;
var oldY;
var startX;
var startY;
var dragging = false;

var colours = ["#eee", "#000"];
var names = ["White", "Black"];

var prevTime = Date.now();

setInterval(update, 40);
function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if (mouse.right || mouse.down) {
		if (dragging) {
			rotZ = oldX + mouse.x - startX;
			rotX = oldY + mouse.y - startY;
		} else {
			startX = mouse.x;
			startY = mouse.y;
			oldX = rotZ;
			oldY = rotX;
			dragging = true;
		}
	} else {
		if (dragging) {
			rotZV = mouse.x - prevX;
			rotXV = mouse.y - prevY;
		}
		dragging = false;
		rotZV *= 0.9;
		rotXV *= 0.9;
		rotZ += rotZV;
		rotX += rotXV;
	}
	if (rotZ < 0) {
		rotZ += 360;
	}
	if (rotX > 0) {
		rotX = 0;
	} else if (rotX < -90) {
		rotX = -90;
	}
	
	resetBoard();
	rotateBoard(board);
	renderBoard(board); // get selected
	
	renderInfo();
	
	if (mouse.down && !mouse.prev && winner === false) {
		if (play(selected, turn)) {
			winner = checkWin();
			if (winner !== false) {
				console.log(names[winner] + " Wins!");
			}
			timer[turn] += (Date.now()-prevTime)/1000;
			prevTime = Date.now()
			turn = (turn+1)%2;
		}
	}
	// Draw Winner Line
	if (winner !== false) {
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#f43";
		var midX = canvas.width/2;
		var midY = canvas.height/2;
		var i1 = startWin.y*4+startWin.x + board.length-32;
		var i2 = endWin.y*4+endWin.x + board.length-32;
		var x1 = midX+board[i1].x;
		var y1 = midY+board[i1].y + (board[i1+16].y - board[i1].y)*((startWin.z+0.5)/4);
		var x2 = midX+board[i2].x;
		var y2 = midY+board[i2].y + (board[i2+16].y - board[i2].y)*((endWin.z+0.5)/4);
		x1 -= (x2-x1)*0.13;
		y1 -= (y2-y1)*0.13;
		x2 += (x2-x1)*0.13;
		y2 += (y2-y1)*0.13;
		ctx.beginPath();
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	
	prevX = mouse.x;
	prevY = mouse.y;
	mouse.prev = mouse.down;
}

var winner = false;
var turn = 0;
var selected;
var game;
function resetGame() {
	game = [];
	for (var x = 0; x < 4; x++) {
		var layerY = [];
		for (var y = 0; y < 4; y++) {
			layerY.push([]);
		}
		game.push(layerY);
	}
}
resetGame();
function play(selected, col) {
	if (selected === null) {
		return false;
	}
	var pin = game[Math.floor(selected/4)][selected%4];
	if (pin.length < 4) {
		pin.push(col);
		return true;
	} else {
		return false;
	}
}
var startWin = null;
var endWin = null;
function checkWin() { // just a classic brute force
	var col;
	var same;
	// Pins
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			if (game[y][x].length < 4) {
				continue;
			}
			col = game[y][x][0];
			startWin = {x:x,y:y,z:0};
			same = true;
			for (var z = 1; z < 4; z++) {
				if (col !== game[y][x][z]) {
					same = false;
					break;
				}
				endWin = {x:x,y:y,z:z};
			}
			if (same) {
				return col;
			}
		}
	}
	// Rows
	for (var y = 0; y < 4; y++) {
		for (var z = 0; z < 4; z++) {
			col = game[y][0][z];
			startWin = {x:0,y:y,z:z};
			same = true;
			for (var x = 1; x < 4; x++) {
				if (game[y][x].length <= z) {
					same = false;
					break;
				}
				if (col !== game[y][x][z]) {
					same = false;
					break;
				}
				endWin = {x:x,y:y,z:z};
			}
			if (same) {
				return col;
			}
		}
		col = game[y][0][0];
		startWin = {x:0,y:y,z:0};
		if (game[y][1][1] === col && col !== undefined) {
			if (game[y][2][2] === col) {
				if (game[y][3][3] === col) {
					endWin = {x:3,y:y,z:3};
					return col;
				}
			}
		}
		col = game[y][3][0];
		startWin = {x:3,y:y,z:0};
		if (game[y][2][1] === col && col !== undefined) {
			if (game[y][1][2] === col) {
				if (game[y][0][3] === col) {
					endWin = {x:0,y:y,z:3};
					return col;
				}
			}
		}
	}
	// Collums
	for (var x = 0; x < 4; x++) {
		for (var z = 0; z < 4; z++) {
			col = game[0][x][z];
			startWin = {x:x,y:0,z:z};
			same = true;
			for (var y = 1; y < 4; y++) {
				if (game[y][x].length <= z) {
					same = false;
					break;
				}
				if (col !== game[y][x][z]) {
					same = false;
					break;
				}
				endWin = {x:x,y:y,z:z};
			}
			if (same) {
				return col;
			}
		}
		col = game[0][x][0];
		startWin = {x:x,y:0,z:0};
		if (game[1][x][1] === col && col !== undefined) {
			if (game[2][x][2] === col) {
				if (game[3][x][3] === col) {
					endWin = {x:x,y:3,z:3};
					return col;
				}
			}
		}
		col = game[3][x][0];
		startWin = {x:x,y:3,z:0};
		if (game[2][x][1] === col && col !== undefined) {
			if (game[1][x][2] === col) {
				if (game[0][x][3] === col) {
					endWin = {x:x,y:0,z:3};
					return col;
				}
			}
		}
	}
	// Diagonals (1)
	for (var z = 0; z < 4; z++) {
		col = game[0][0][z];
		startWin = {x:0,y:0,z:z};
		same = true;
		for (var i = 1; i < 4; i++) {
			if (game[i][i].length <= z) {
				same = false;
				break;
			}
			if (col !== game[i][i][z]) {
				same = false;
				break;
			}
			endWin = {x:i,y:i,z:z};
		}
		if (same) {
			return col;
		}
	}
	col = game[0][0][0];
	startWin = {x:0,y:0,z:0};
	if (game[1][1][1] === col && col !== undefined) {
		if (game[2][2][2] === col) {
			if (game[3][3][3] === col) {
				endWin = {x:3,y:3,z:3};
				return col;
			}
		}
	}
	col = game[0][0][3];
	startWin = {x:0,y:0,z:3};
	if (game[1][1][2] === col && col !== undefined) {
		if (game[2][2][1] === col) {
			if (game[3][3][0] === col) {
				endWin = {x:3,y:3,z:0};
				return col;
			}
		}
	}
	// (2)
	for (var z = 0; z < 4; z++) {
		col = game[0][3][z];
		startWin = {x:3,y:0,z:z};
		same = true;
		for (var i = 1; i < 4; i++) {
			if (game[i][3-i].length <= z) {
				same = false;
				break;
			}
			if (col !== game[i][3-i][z]) {
				same = false;
				break;
			}
			endWin = {x:3-i,y:i,z:z};
		}
		if (same) {
			return col;
		}
	}
	col = game[0][3][0];
	startWin = {x:3,y:0,z:0};
	if (game[1][2][1] === col && col !== undefined) {
		if (game[2][1][2] === col) {
			if (game[3][0][3] === col) {
				endWin = {x:0,y:3,z:3};
				return col;
			}
		}
	}
	col = game[0][3][3];
	startWin = {x:3,y:0,z:3};
	if (game[1][2][2] === col && col !== undefined) {
		if (game[2][1][1] === col) {
			if (game[3][0][0] === col) {
				endWin = {x:0,y:3,z:0};
				return col;
			}
		}
	}
	return false;
}

var timer = [0, 0];
function renderInfo() {
	var infoWidth = 250;
	ctx.fillStyle = "#ddd";
	ctx.fillRect(canvas.width-infoWidth, 0, infoWidth, 300);
	
	ctx.fillStyle = "#aaa";
	ctx.fillText("© louis hobson", canvas.width-infoWidth+10, 290);
	
	ctx.fillStyle = "#222";
	ctx.strokeStyle = "#444";
	ctx.font = "24px Arial";
	
	// Timer
	if (winner === false) {
		ctx.fillText(names[turn] + "s turn", canvas.width-infoWidth+10, 30);
		// Piece
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.arc(canvas.width-infoWidth+40 + ctx.measureText(names[turn] + "s turn").width, 22, 20, 0, 2*Math.PI);
		ctx.fillStyle = colours[turn];
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.arc(canvas.width-infoWidth+40 + ctx.measureText(names[turn] + "s turn").width, 22, 8, 0, 2*Math.PI);
		ctx.fillStyle = "#8889";
		ctx.fill();
		ctx.stroke();
		if (turn === 0) {
			ctx.fillText(Math.ceil(timer[0]+(Date.now()-prevTime)/1000) + " : " + Math.ceil(timer[1]), canvas.width-infoWidth+10, 60);
		} else {
			ctx.fillText(Math.ceil(timer[0]) + " : " + Math.ceil(timer[1]+(Date.now()-prevTime)/1000), canvas.width-infoWidth+10, 60);
		}
	} else {
		ctx.fillText(Math.ceil(timer[0]) + " : " + Math.ceil(timer[1]), canvas.width-infoWidth+10, 60);
		ctx.fillText(names[winner] + " Wins!", canvas.width-infoWidth+10, 30);
		// Piece
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.arc(canvas.width-infoWidth+40 + ctx.measureText(names[winner] + " Wins!").width, 22, 20, 0, 2*Math.PI);
		ctx.fillStyle = colours[winner];
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.arc(canvas.width-infoWidth+40 + ctx.measureText(names[winner] + " Wins!").width, 22, 8, 0, 2*Math.PI);
		ctx.fillStyle = "#8889";
		ctx.fill();
		ctx.stroke();
	}
}

var board;
function resetBoard() {
	// Base
	board = [{x:-40, y:-40, z:0}, {x:40, y:-40, z:0}, {x:40, y:40, z:0}, {x:-40, y:40, z:0}, {x:-40, y:-40, z:-10}, {x:40, y:-40, z:-10}, {x:40, y:40, z:-10}, {x:-40, y:40, z:-10}];
	// Sticks
	board.push({x:-30, y:-30, z:0});
	board.push({x:-10, y:-30, z:0});
	board.push({x:10, y:-30, z:0});
	board.push({x:30, y:-30, z:0});
	board.push({x:-30, y:-10, z:0});
	board.push({x:-10, y:-10, z:0});
	board.push({x:10, y:-10, z:0});
	board.push({x:30, y:-10, z:0});
	board.push({x:-30, y:10, z:0});
	board.push({x:-10, y:10, z:0});
	board.push({x:10, y:10, z:0});
	board.push({x:30, y:10, z:0});
	board.push({x:-30, y:30, z:0});
	board.push({x:-10, y:30, z:0});
	board.push({x:10, y:30, z:0});
	board.push({x:30, y:30, z:0});
	
	board.push({x:-30, y:-30, z:30});
	board.push({x:-10, y:-30, z:30});
	board.push({x:10, y:-30, z:30});
	board.push({x:30, y:-30, z:30});
	board.push({x:-30, y:-10, z:30});
	board.push({x:-10, y:-10, z:30});
	board.push({x:10, y:-10, z:30});
	board.push({x:30, y:-10, z:30});
	board.push({x:-30, y:10, z:30});
	board.push({x:-10, y:10, z:30});
	board.push({x:10, y:10, z:30});
	board.push({x:30, y:10, z:30});
	board.push({x:-30, y:30, z:30});
	board.push({x:-10, y:30, z:30});
	board.push({x:10, y:30, z:30});
	board.push({x:30, y:30, z:30});
}
function rotateBoard() {
	bnew = JSON.parse(JSON.stringify(board));
	for (var i = 0; i < board.length; i++) {
		// Rotate Z
		bnew[i].x = Math.cos(-rad(rotZ))*board[i].x - Math.sin(-rad(rotZ))*board[i].y;
		bnew[i].y = Math.sin(-rad(rotZ))*board[i].x + Math.cos(-rad(rotZ))*board[i].y;
		board[i] = bnew[i];
		// Rotate Y
		bnew[i].y = Math.cos(-rad(rotX))*board[i].y - Math.sin(-rad(rotX))*board[i].z;
		bnew[i].z = Math.sin(-rad(rotX))*board[i].y + Math.cos(-rad(rotX))*board[i].z;
		// Zoom
		bnew[i].x *= zoom;
		bnew[i].y *= zoom;
		bnew[i].z *= zoom;
		// Perspective
		//bnew[i].y += 100;
		//bnew[i].x /= -bnew[i].y/100;
		//bnew[i].z /= -bnew[i].y/100;
		// NOPE
	}
	board = bnew;
}
function renderBoard(board) {
	ctx.lineWidth = zoom/2;
	
	var midX = canvas.width/2;
	var midY = canvas.height/2;
	ctx.fillStyle = "#310";
	drawQuad(midX+board[0].x, midY+board[0].y, midX+board[1].x, midY+board[1].y, midX+board[2].x, midY+board[2].y, midX+board[3].x, midY+board[3].y);
	if (nxor(90 < rotZ%360 && rotZ%360 < 270, rotX%360 < 180)) {
		ctx.fillStyle = "#520";
		drawQuad(midX+board[0].x, midY+board[0].y, midX+board[1].x, midY+board[1].y, midX+board[5].x, midY+board[5].y, midX+board[4].x, midY+board[4].y);
	}
	if (nxor(180 < rotZ%360 && rotZ%360 < 360, rotX%360 < 180)) {
		ctx.fillStyle = "#200";
		drawQuad(midX+board[1].x, midY+board[1].y, midX+board[2].x, midY+board[2].y, midX+board[6].x, midY+board[6].y, midX+board[5].x, midY+board[5].y);
	}
	if (nxor(270 < rotZ%360 || rotZ%360 < 90, rotX%360 < 180)) {
		ctx.fillStyle = "#520";
		drawQuad(midX+board[2].x, midY+board[2].y, midX+board[3].x, midY+board[3].y, midX+board[7].x, midY+board[7].y, midX+board[6].x, midY+board[6].y);
	}
	if (nxor(0 < rotZ%360 && rotZ%360 < 180, rotX%360 < 180)) {
		ctx.fillStyle = "#200";
		drawQuad(midX+board[3].x, midY+board[3].y, midX+board[0].x, midY+board[0].y, midX+board[4].x, midY+board[4].y, midX+board[7].x, midY+board[7].y);
	}
	// Render Pins
	selected = null;
	var radius = 2;
	for (var j = 0; j < 16; j++) {
		var i = j;
		if (0 < rotZ%360 && rotZ%360 <= 90) {
			i = (i+1)*4-1;
		} else if (90 < rotZ%360 && rotZ%360 <= 180) {
			i = 15-i;
		} else if (180 < rotZ%360 && rotZ%360 <= 270) {
			i = ((15-i)+1)*4-1;
		}
		i = i%17;
		i = i+board.length-32;
		if (mouseOn(midX+board[i+16].x-zoom*radius, midY+board[i+16].y-zoom*radius, zoom*2*radius, board[i].y - board[i+16].y + zoom*radius*2)) {
			selected = i-(board.length-32);
		}
	}
	for (var j = 0; j < 16; j++) {
		var i = j;
		if (0 < rotZ%360 && rotZ%360 <= 90) {
			i = (i+1)*4-1;
		} else if (90 < rotZ%360 && rotZ%360 <= 180) {
			i = 15-i;
		} else if (180 < rotZ%360 && rotZ%360 <= 270) {
			i = ((15-i)+1)*4-1;
		}
		i = i%17;
		if (selected === i) {
			ctx.strokeStyle = "#ff0";
		} else {
			ctx.strokeStyle = "#000";
		}
		i = i+board.length-32;
		// Stick
		ctx.fillStyle = "#520";
		ctx.beginPath();
		ctx.lineTo(midX+board[i+16].x+zoom*radius, midY+board[i+16].y);
		ctx.ellipse(midX+board[i].x, midY+board[i].y, zoom*radius, zoom*radius*Math.cos(rad(rotX)), 0, 0, Math.PI);
		ctx.lineTo(midX+board[i+16].x-zoom*radius, midY+board[i+16].y);
		ctx.fill();
		ctx.stroke();
		// Head
		ctx.fillStyle = "#730";
		ctx.beginPath();
		ctx.ellipse(midX+board[i+16].x, midY+board[i+16].y, zoom*radius, zoom*radius*Math.cos(rad(rotX)), 0, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		// Render Peices
		var p = i - (board.length-32);
		for (var z = 0; z < game[Math.floor(p/4)][p%4].length; z++) {
			var x = midX+board[i].x;
			var y = midY+board[i].y + (board[i+16].y - board[i].y)*((z+0.5)/4);
			var yCut = midY+board[i].y + (board[i+16].y - board[i].y)*((z+1)/4);
			ctx.beginPath();
			ctx.ellipse(x, y, 6*zoom, 4*zoom + 2*zoom*Math.cos(rad(rotX)), 0, 0, 2*Math.PI);
			ctx.fillStyle = colours[game[Math.floor(p/4)][p%4][z]];
			ctx.fill();
			ctx.stroke();
			// Stick
			ctx.fillStyle = "#520";
			ctx.beginPath();
			ctx.lineTo(x+zoom*radius, midY+board[i+16].y);
			ctx.ellipse(x, yCut, zoom*radius, zoom*radius*Math.cos(rad(rotX)), 0, 0, Math.PI);
			ctx.lineTo(x-zoom*radius, midY+board[i+16].y);
			ctx.fill();
			ctx.stroke();
		}
		// Head
		ctx.fillStyle = "#730";
		ctx.beginPath();
		ctx.ellipse(midX+board[i+16].x, midY+board[i+16].y, zoom*radius, zoom*radius*Math.cos(rad(rotX)), 0, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4) {
	ctx.beginPath();
	ctx.lineTo(Math.floor(x1), Math.floor(y1));
	ctx.lineTo(Math.floor(x2), Math.floor(y2));
	ctx.lineTo(Math.floor(x3), Math.floor(y3));
	ctx.lineTo(Math.floor(x4), Math.floor(y4));
	ctx.lineTo(Math.floor(x1), Math.floor(y1));
	//ctx.arc(x1, y1, 10, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
}