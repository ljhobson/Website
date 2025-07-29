var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onload = function(event) {
	resize();
	
	if (isRandom) {
		for (var i = 0; i < 64; i++) {
			var cons = [];
			for (var j = 0; j < Math.floor(Math.random() * 5); j++) {
				var number = Math.floor(Math.random() * 40);
				if (!cons.includes(number) && number !== i) {
					cons.push(number);
				}
			}
			nodes.push( { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: 10, connections: cons } )
		}
	} else {
		for (var i = 0; i < 64; i++) {
			var cons = [];
			var key = [1, 8];
			for (var j = 0; j < 2; j++) {
				var conNode = i + key[j];
				if (conNode > 0 && conNode < 64 && !(i % 8 === 7 && j === 0)) {
					cons.push(conNode);
				}
			}
			nodes.push( { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: 10, connections: cons } )
		}	
	}
	
	var size = nodes.length;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < Math.floor(Math.random()*10); j++) {
			nodes.push( { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: 5, connections: [i] } )
		}
	}
	
	makeConnectionsBidirectional(nodes);
	update();
}

var moving = false;
var mouse = {};
window.onmousemove = function(event) {
	mouse.x = event.layerX;
	mouse.y = event.layerY;
}

window.onmousedown = function(event) {
	mouse.down = true;
	mouse.x = event.layerX;
	mouse.y = event.layerY;
	
	for (var i = 0; i < nodes.length; i++) {
		if (mag(mouse, nodes[i]) <= nodes[i].size*nodes[i].size) {
			moving = i;
			break;
		}
	}
}

window.onmouseup = function(event) {
	mouse.down = false;
	mouse.x = event.layerX;
	mouse.y = event.layerY;
	
	moving = false;
}



function makeConnectionsBidirectional(nodes) {
	for (let i = 0; i < nodes.length; i++) {
		let node = nodes[i];
		for (let j of node.connections) {
			if (!nodes[j].connections.includes(i)) {
				nodes[j].connections.push(i);
			}
		}
	}
}

window.onresize = function(event) {
	resize();
}

var speed = 10;
var isRandom = true;
var nodes = [];

function drawNode(node) {
	ctx.beginPath();
	ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
	ctx.fill();
}

function bound(node) {
	if (node.x < 0) {
		node.x = 0;
	}
	if (node.x > canvas.width) {
		node.x = canvas.width;
	}
	if (node.y < 0) {
		node.y = 0;
	}
	if (node.y > canvas.height) {
		node.y = canvas.height;
	}
}

function mag(a, b) {
	return (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
}

function update() {
	resize();
	
	for (var i = 0; i < nodes.length; i++) {
		var subject = nodes[i];
		for (var j = 0; j < nodes.length; j++) {
			var dx = 0;
			var dy = 0;
			if (j === i) {
				//continue;
			}
			var target = nodes[j];
			var group = 1;
			var dist2 = mag(subject, target);
			
			var c;
			if (subject.connections.includes(j)) {
				c = -(speed*1 / (0.1 + dist2)); // bigger the distance the smaller the force
			} else {
				c = -(speed*10 / (0.1 + dist2)); // bigger the distance the smaller the force
			}
			
			dx += c*(target.x - subject.x);
			dy += c*(target.y - subject.y);
			
//			subject.x += dx;
//			subject.y += dy;
			
			if (subject.connections.includes(j)) {
				c = (speed*(Math.sqrt(dist2)) / 100000); // bigger the distance the bigger the force
				dx += c*(target.x - subject.x);
				dy += c*(target.y - subject.y);
			}
			
//			subject.x += dx;
//			subject.y += dy;
			
			dx += (canvas.width/2 - subject.x) / (100000/speed);
			dy += (canvas.height/2 - subject.y) / (100000/speed);
			
			subject.x += dx;
			subject.y += dy;
			
			bound(subject);
		}
			
		if (moving !== false && moving === i) {
			subject.x = mouse.x;
			subject.y = mouse.y;
		}
		drawNode(subject);
	}
	
	// draw connections
	for (var i = 0; i < nodes.length; i++) {
		var subject = nodes[i];
		for (var j = 0; j < nodes.length; j++) {
			if (subject.connections.includes(j)) {
				var target = nodes[j];
				ctx.beginPath();
				ctx.lineTo(subject.x, subject.y);
				ctx.lineTo(target.x, target.y);
				ctx.stroke();
			}
		}
	}
	
	requestAnimationFrame(update);
}
