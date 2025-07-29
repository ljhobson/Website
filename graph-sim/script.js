var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.onload = function(event) {
	resize();
	for (var i = 0; i < 20; i++) {
		var cons = [];
		for (var j = 0; j < Math.floor(Math.random() * 3); j++) {
			var number = Math.floor(Math.random() * 10);
			if (!cons.includes(number) && number !== i) {
				cons.push(number);
			}
		}
		nodes.push( { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: 25, connections: cons } )
	}
	
	update();
}

window.onresize = function(event) {
	resize();
}


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
			if (j === i) {
				//continue;
			}
			var target = nodes[j];
			var group = 1;
			var dist2 = mag(subject, target);
			if (subject.connections.includes(j)) {
				group = dist2;
			}
			var c = -(100000000 / (0.1 + dist2 * dist2 * group ));
			//console.log(c);
			subject.x += c*(target.x - subject.x);
			subject.y += c*(target.y - subject.y);
			bound(subject);
			subject.x += (canvas.width/2 - subject.x) / 100;
			subject.y += (canvas.height/2 - subject.y) / 100;
			
			// Draw Connections
			if (subject.connections.includes(j)) {
				ctx.beginPath();
				ctx.lineTo(subject.x, subject.y);
				ctx.lineTo(target.x, target.y);
				ctx.stroke();
			}
		}
		drawNode(subject);
	}
	
	requestAnimationFrame(update);
}
