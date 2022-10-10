/* FEATURES /*
 - store a truth table of the block after create or edit
 
 - RIGHT CLICK MENU:
 - view truth table
 - duplicate
 - copy (connections also)
 - paste
 - delete
 - delete block
 - reset view (zom and pan)

/*          */
function save() {
	localStorage.blocks = JSON.stringify(blocks);
	localStorage.circut = JSON.stringify(circut);
}
function load() {
	blocks = JSON.parse(localStorage.blocks);
	circut = JSON.parse(localStorage.circut);
}
var fps = 30;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;
window.onresize = function() { 
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
}
ctx.roundRect = function(x, y, w, h, rad) {
	if (Math.min(w, h)/2 < rad) {
		rad = Math.min(w, h)/2;
	}
	this.beginPath();
	this.lineTo(x, y+rad);
	this.quadraticCurveTo(x, y, x+rad, y);
	this.lineTo(x+w-rad, y);
	this.quadraticCurveTo(x+w, y, x+w, y+rad);
	this.lineTo(x+w, y+h-rad);
	this.quadraticCurveTo(x+w, y+h, x+w-rad, y+h);
	this.lineTo(x+rad, y+h);
	this.quadraticCurveTo(x, y+h, x, y+h-rad);
	this.lineTo(x, y+rad);
	this.fill();
}
ctx.roundStroke = function(x, y, w, h, rad) {
	if (Math.min(w, h)/2 < rad) {
		rad = Math.min(w, h)/2;
	}
	this.beginPath();
	this.lineTo(x, y+rad);
	this.quadraticCurveTo(x, y, x+rad, y);
	this.lineTo(x+w-rad, y);
	this.quadraticCurveTo(x+w, y, x+w, y+rad);
	this.lineTo(x+w, y+h-rad);
	this.quadraticCurveTo(x+w, y+h, x+w-rad, y+h);
	this.lineTo(x+rad, y+h);
	this.quadraticCurveTo(x, y+h, x, y+h-rad);
	this.lineTo(x, y+rad);
	this.stroke();
}
var mouse = {x: null, y: null, down: false, prev: false, left: false, prevLeft: false, prevx: null, prevy: null};
canvas.onmousemove = function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}
canvas.onmousedown = function(event) {
	if (event.button === 0) {
		mouse.down = true;
	} else if (event.button === 2) {
		mouse.left = true;
	}
}
canvas.onmouseup = function(event) {
	if (event.button === 0) {
		mouse.down = false;
	} else if (event.button === 2) {
		mouse.left = false;
	}
}
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "|", ";", ":", "'", '"', ",", "<", ".", ">", "/", "?"];
var keysDown = [];
var keysPressed = [];
document.onkeydown = function(event) {
	if (!keysDown.includes(event.key)) {
		keysDown.push(event.key);
	}
	keysPressed.push(event.key);
}
document.onkeyup = function(event) {
	keysDown.splice(keysDown.indexOf(event.key));
	if (event.key === " ") {
		stage.scroll.scrollMode = false;
	}
}
function mouseWheel(event) {
	event.deltaY;
}
function map(x, a, b, c, d) {
	return((x-a)/(b-a) * (d-c) + c);
}
function mouseOn(x, y, w, h) {
	if (x < mouse.x && mouse.x < x+w && y < mouse.y && mouse.y < y+h) {
		return(true);
	} else {
		return(false);
	}
}
function touching(x1, y1, w1, h1, x2, y2, w2, h2) {
	if (Math.min(x1, x1+w1) < Math.max(x2, x2+w2) && Math.min(x2, x2+w2) < Math.max(x1, x1+w1) && Math.min(y1, y1+h1) < Math.max(y2, y2+h2) && Math.min(y2, y2+h2) < Math.max(y1, y1+h1)) {
		return(true);
	} else {
		return(false);
	}
}
function mouseIn(x, y, r) {
	if (Math.sqrt((x-mouse.x)*(x-mouse.x) + (y-mouse.y)*(y-mouse.y)) < r) {
		return(true);
	} else {
		return(false);
	}
}
setInterval(update, 1000/fps);
canvas.oncontextmenu = function (e) {
    e.preventDefault();
};
var LAYOUT = {
	fontSize: 24,
	font: "sans-serif",
	ctxMnu: {
		padding: {
			x: 5,
			y: 5
		},
		curve: 2,
		background: "#222",
		colour: "#fff",
		hover: "#999"
	},
	header: {
		background: "#49e",
		colour: "#fff",
		hover: "#5af",
		height: 40,
		padding: {
			x: 10,
			y: 10
		}
	},
	backpack: {
		background: "#444",
		colour: "#fff",
		width: 250,
		resizable: true,
		leway: 5,
		padding: {
			x: 10,
			y: 10
		}
	},
	search: {
		background: "#fff",
		colour: "#999",
		selected: "#000",
		height: 40,
		radius: 20
	},
	stage: {
		colour: "#eee",
		gridSize: 12
	},
	select: {
		colour: "#39f",
		background: "#0002"
	},
	block: {
		padding: {
			x: 15,
			y: 5
		},
		curve: 5,
		textSize: 24,
		colour: "#fff",
		nodeRadius: 10,
		nodePadding: 12,
		smoothConnections: true
	}
};
function mouseWheel(event) {
	if (mouseOn(stage.x, stage.y, stage.w, stage.h)) {
		this.startZoom = stage.zoom;
		this.offX = stage.scroll.x;
		this.offY = stage.scroll.y;
		stage.zoom = this.startZoom * (1-event.deltaY/400);
		if (stage.zoom < 0.3) {
			stage.zoom = 0.3;
		}
		if (stage.zoom > 6) {
			stage.zoom = 6;
		}
		stage.scroll.x = this.offX+(stage.w*(stage.zoom - this.startZoom)) / ((stage.w/(mouse.x-stage.x))*stage.zoom*this.startZoom);
		stage.scroll.y = this.offY+(stage.h*(stage.zoom - this.startZoom)) / ((stage.h/(mouse.y-stage.y))*stage.zoom*this.startZoom);
		//stage.scroll.y += event.deltaY/2/stage.zoom;
	}
}
function nodeXY(type, inout, node) {
	LAYOUT.fontSize = LAYOUT.block.textSize;
	var max;
	max = Math.max(blocks[type].inputCount, blocks[type].outputCount);
	var i;
	if (inout === 0) {
		i = (max-blocks[type].inputCount)/2;
	} else {
		i = (max-blocks[type].outputCount)/2;
	}
	return({x: inout*(blockDims(type, 1).w+LAYOUT.block.nodePadding*2)-LAYOUT.block.nodePadding, y: LAYOUT.block.padding.y + LAYOUT.block.nodePadding + (i+node)*LAYOUT.block.nodePadding*2});
}
function menuDims(name) {
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	return({
		w: ctx.measureText(name).width + LAYOUT.ctxMnu.padding.x*2,
		h: LAYOUT.fontSize + LAYOUT.ctxMnu.padding.y*2
	});
}
function blockDims(type, zoom) {
	var name = blocks[type].name;
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	max = Math.max(blocks[type].inputCount, blocks[type].outputCount);
	var h = (max*LAYOUT.block.nodePadding*2 + LAYOUT.block.padding.y*2)*zoom;
	if (h < LAYOUT.block.textSize*zoom + LAYOUT.block.padding.y*2*zoom) {
		h = LAYOUT.block.textSize*zoom + LAYOUT.block.padding.y*2*zoom;
	}
	return({
		w: Math.round((ctx.measureText(name).width + LAYOUT.block.padding.x*2*zoom)/(LAYOUT.stage.gridSize*zoom))*(LAYOUT.stage.gridSize*zoom),
		h: Math.round(h/(LAYOUT.stage.gridSize*zoom))*(LAYOUT.stage.gridSize*zoom)
	});
}
function blockNameDims(name, zoom) {
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	return({
		w: ctx.measureText(name).width + LAYOUT.block.padding.x*2*zoom,
		h: LAYOUT.fontSize + LAYOUT.block.padding.y*2*zoom
	});
}
function textWidth(text) {
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	return(ctx.measureText(text).width);
}
var stage = {
	x: null,
	y: null,
	w: null,
	h: null,
	grid: {
		visible: false,
		size: LAYOUT.stage.gridSize
	},
	scroll: {
		x: 0,
		y: 0,
		offX: null,
		offY: null,
		scrolling: false,
		scrollMode: false
	},
	zoom: 1,
	controls: {
		visible: true,
		mouseTouching: false,
		zooming: false,
		startZoom: null,
		startX: null,
		offX: null,
		offY: null,
		x: null,
		y: null,
		w: 100,
		h: 50,
		fit: function() {
			this.x = (stage.w - this.w)/2;
			this.y = stage.h - this.h - 5;
		},
		update: function() {
			if (this.visible) {
				if (mouseOn(stage.x + this.x, stage.y + this.y, this.w, this.h)) {
					this.mouseTouching = true;
					if (mouse.down && !mouse.prev) {
						this.startZoom = stage.zoom;
						this.startX = mouse.x;
						this.zooming = true;
						this.offX = stage.scroll.x;
						this.offY = stage.scroll.y;
					}
				} else {
					this.mouseTouching = false;
				}
				if (mouse.down) {
					if (this.zooming) {
						stage.zoom = this.startZoom * 1+(mouse.x-this.startX)/50;
						if (stage.zoom < 0.3) {
							stage.zoom = 0.3;
						}
						if (stage.zoom > 6) {
							stage.zoom = 6;
						}
						stage.scroll.x = this.offX+(stage.w*(stage.zoom - this.startZoom)) / (2*stage.zoom*this.startZoom);
						stage.scroll.y = this.offY+(stage.h*(stage.zoom - this.startZoom)) / (2*stage.zoom*this.startZoom);
					}
				} else {
					this.zooming = false;
				}
			}
		},
		render: function() {
			if (this.visible) {
				if (this.mouseTouching || this.zooming) {
					ctx.fillStyle = "#eee";
				} else {
					ctx.fillStyle = "#ddd";
				}
				ctx.roundRect(stage.x + this.x, stage.y + this.y, this.w, this.h, 24);
				ctx.fillStyle = "#444";
				LAYOUT.fontSize = 24;
				textAt("Zoom", stage.x + this.x+(this.w-textWidth("Zoom"))/2, stage.y + this.y+(this.h-LAYOUT.fontSize/1.5)/2);
			}
		}
	},
	select: {
		selecting: false,
		dragging: false,
		x1: null,
		y1: null,
		x2: null,
		y2: null,
		render: function() {
			if (this.selecting) {
				ctx.lineWidth = 4;
				ctx.strokeStyle = LAYOUT.select.colour;
				ctx.fillStyle = LAYOUT.select.background;
				
				ctx.fillRect(stage.x + Math.min(this.x1, this.x2), stage.y + Math.min(this.y1, this.y2), Math.max(this.x1, this.x2)-Math.min(this.x1, this.x2), Math.max(this.y1, this.y2)-Math.min(this.y1, this.y2));
				
				ctx.strokeRect(stage.x + this.x1, stage.y + this.y1, this.x2-this.x1, this.y2-this.y1);
			}
		},
		selection: []
	},
	connect: {
		connecting: false,
		startNode: null,
		innode: {block: null, node: null},
		outnode: {block: null, node: null}
	},
	fit: function() {
		if (backpack.visible) {
			this.x = backpack.x+backpack.w;
		} else {
			this.x = 0;
		}
		if (header.visible) {
			this.y = header.y+header.h;
		} else {
			this.y = 0;
		}
		this.w = WIDTH-this.x;
		this.h = HEIGHT-this.y;
	},
	clearCircut: function () {
		selection = [];
		circut = [];
	},
	duplicateSelection: function() {
		var newSelection = [];
		var circutLength = circut.length;
		for (var i = 0; i < this.select.selection.length; i++) {
			var index = this.select.selection[i].index;
			var block = circut[index];
			var inputConnections = [];
			var outputConnections = [];
			for (var j = 0; j < blocks[block.type].inputCount; j++) {
				var inSelection = false;
				var indexInSelection;
				for (var k = 0; k < this.select.selection.length; k++) {
					if (this.select.selection[k].index === block.inputConnections[j].block) {
						inSelection = true;
						indexInSelection = k;
						break;
					}
				}
				if (inSelection) {
					var newBlockIndex = circutLength+indexInSelection;
					inputConnections.push({connected: block.inputConnections[j].connected, block: newBlockIndex, node: block.inputConnections[j].node});
				} else {
					inputConnections.push({connected: false, block: null, node: null});
				}
			}
			for (var j = 0; j < blocks[block.type].outputCount; j++) {
				var connections = [];
				for (var k = 0; k < block.outputConnections[j].connections.length; k++) {
					var inSelection = false;
					var indexInSelection;
					for (var m = 0; m < this.select.selection.length; m++) {
						if (this.select.selection[m].index === block.outputConnections[j].connections[k].block) {
							inSelection = true;
							indexInSelection = m;
							break;
						}
					}
					if (inSelection) {
						var newBlockIndex = circutLength+indexInSelection;
						connections.push({block: newBlockIndex, node: block.outputConnections[j].connections[k].node});
					}
				}
				if (true) {
					outputConnections.push({connected: connections.length > 0, connections: connections});
				} else {
					outputConnections.push({connected: false, connections: []});
				}
			}
			if ([0, 1, 2].includes(block.type)) {
				circut.push(JSON.parse(JSON.stringify({type: block.type, label: block.label, x: block.x, y: block.y, inputConnections: inputConnections, outputConnections: outputConnections, state: block.state})));
			} else {
				circut.push(JSON.parse(JSON.stringify({type: block.type, label: block.label, x: block.x, y: block.y, inputConnections: inputConnections, outputConnections: outputConnections})));
			}
			newSelection.push({index: circut.length-1, offX: (mouse.x-stage.x+stage.scroll.x)/stage.zoom-circut[circut.length-1].x, offY: (mouse.y-stage.y+stage.scroll.y)/stage.zoom-circut[circut.length-1].y});
		}
		this.select.selection = JSON.parse(JSON.stringify(newSelection));
		this.select.dragging = true;
		this.select.x1 = mouse.x;
		this.select.y1 = mouse.y;
	},
	update: function() {
		this.controls.fit();
		this.controls.update();
		if (mouseOn(this.x, this.y, this.w, this.h)) {
			if (keysDown.includes(" ")) {
				this.scroll.scrollMode = true;
			}
			if (this.scroll.scrollMode) {
				cursor.set("move");
			}
			if (!this.controls.mouseTouching) {
				cursor.set("crosshair");
			}
		}
		if (mouse.down) {
			if (!mouse.prev) {
				if (!this.controls.mouseTouching || !this.controls.visible) {
					if (mouseOn(this.x, this.y, this.w, this.h)) {
						var touchingBlock = false;
						var blockTouching;
						if (this.scroll.scrollMode) {
							this.scroll.offX = (mouse.x-this.x)/this.zoom+this.scroll.x;
							this.scroll.offY = (mouse.y-this.y)/this.zoom+this.scroll.y;
							this.scroll.scrolling = true;
						} else {
							for (var i = 0; i < circut.length; i++) {
								var block = circut[i];
								LAYOUT.fontSize = LAYOUT.block.textSize*this.zoom;
								if (mouseOn(this.x+(block.x-this.scroll.x)*this.zoom, this.y+(block.y-this.scroll.y)*this.zoom, blockDims(circut[i].type, this.zoom).w, blockDims(circut[i].type, this.zoom).h)) {
									touchingBlock = true;
									blockTouching = i;
									var inSelction = false;
									for (var j = 0; j < this.select.selection.length; j++) {
										if (this.select.selection[j].index === i) {
											inSelction = true;
										}
									}
									break;
								}
							}
						}
						if (!this.scroll.scrolling) {
							if (!touchingBlock) {
								touchingNode = false;
								var node;
								var nodePos;
								johncena:
								for (var i = 0; i < circut.length; i++) {
									for (var j = 0; j < blocks[circut[i].type].inputCount; j++) {
										nodePos = nodeXY(circut[i].type, 0, j);
										if (mouseIn(this.zoom*(circut[i].x-this.scroll.x)+this.x+this.zoom*nodePos.x, this.zoom*(circut[i].y-this.scroll.y)+this.y+this.zoom*nodePos.y, LAYOUT.block.nodePadding*this.zoom)) {
											touchingNode = true;
											node = {block: i, inout: 0, node: j};
											break johncena;
										}
									}
									for (var j = 0; j < blocks[circut[i].type].outputCount; j++) {
										nodePos = nodeXY(circut[i].type, 1, j);
										if (mouseIn(this.zoom*(circut[i].x-this.scroll.x)+this.x+this.zoom*nodePos.x, this.zoom*(circut[i].y-this.scroll.y)+this.y+this.zoom*nodePos.y, LAYOUT.block.nodePadding*this.zoom)) {
											touchingNode = true;
											node = {block: i, inout: 1, node: j};
											break johncena;
										}
									}
								}
								if (touchingNode) { //touching node
									this.connect.connecting = true;
									this.connect.startNode = node.inout
									if (node.inout === 0) {
										this.connect.innode = {block: node.block, node: node.node};
										if (this.connect.startNode === 0) {
											if (circut[this.connect.innode.block].inputConnections[this.connect.innode.node].connected) {
												removeConnection(this.connect.innode.block, this.connect.innode.node);
											}
										}
									} else {
										this.connect.outnode = {block: node.block, node: node.node};
									}
								} else {
									this.select.selection = [];
									this.select.selecting = true;
									this.select.x1 = mouse.x - stage.x;
									this.select.y1 = mouse.y - stage.y;
									this.select.x2 = mouse.x - stage.x;
									this.select.y2 = mouse.y - stage.y;
								}
							} else {
								if (this.select.selection.length > 1) { // multiple selected
									if (!inSelction) {
										this.select.selection = [];
										this.select.selection[0] = {index: blockTouching, offX: (mouse.x+this.scroll.x-this.x)/this.zoom-circut[i].x, offY: (mouse.y+this.scroll.y-this.y)/this.zoom-circut[i].y};
									}
									for (var i = 0; i < this.select.selection.length; i++) {
										this.select.selection[i].offX = (mouse.x+this.scroll.x-this.x)/this.zoom-circut[this.select.selection[i].index].x
										this.select.selection[i].offY = (mouse.y+this.scroll.y-this.y)/this.zoom-circut[this.select.selection[i].index].y;
									}
								} else {
									if (this.select.selection.length > 0) { // 1 selected
										this.select.selection[0] = {index: blockTouching, offX: (mouse.x+this.scroll.x-this.x)/this.zoom-circut[i].x, offY: (mouse.y+this.scroll.y-this.y)/this.zoom-circut[i].y};
									} else { // nothing is selected
										this.select.selection[0] = {index: blockTouching, offX: (mouse.x+this.scroll.x-this.x)/this.zoom-circut[i].x, offY: (mouse.y+this.scroll.y-this.y)/this.zoom-circut[i].y};
									}
								}
								this.select.dragging = true;
								this.select.x1 = mouse.x;
								this.select.y1 = mouse.y;
								if (keysDown.includes("Control")) {
									this.duplicateSelection();
								}
							}
						}
					}
				}
			} else {
				if (this.scroll.scrolling) {
					this.scroll.x = -(mouse.x-this.x)/this.zoom+this.scroll.offX;
					this.scroll.y = -(mouse.y-this.y)/this.zoom+this.scroll.offY;
				}
				if (this.select.selecting) {
					this.select.x2 = mouse.x - stage.x;
					this.select.y2 = mouse.y - stage.y;
					if (this.select.x2 < 0) {
						this.select.x2 = 0;
					}
					if (this.select.y2 < 0) {
						this.select.y2 = 0;
					}
					this.select.selection = [];
					for (var i = 0; i < circut.length; i++) {
						LAYOUT.fontSize = LAYOUT.block.textSize*this.zoom;
						if (touching(Math.min(this.select.x1, this.select.x2), Math.min(this.select.y1, this.select.y2), Math.max(this.select.x1, this.select.x2)-Math.min(this.select.x1, this.select.x2), Math.max(this.select.y1, this.select.y2)-Math.min(this.select.y1, this.select.y2), (circut[i].x-this.scroll.x)*this.zoom, (circut[i].y-this.scroll.y)*this.zoom, blockDims(circut[i].type, this.zoom).w, blockDims(circut[i].type, this.zoom).h)) {
							this.select.selection.push({index: i, offX: (mouse.x+this.scroll.x-this.x)/this.zoom-circut[i].x, offY: (mouse.y+this.scroll.y-this.y)/this.zoom-circut[i].y});
						}
					}
				}
				if (this.select.dragging) {
					for (var i = 0; i < this.select.selection.length; i++) {
						circut[this.select.selection[i].index].x = (mouse.x+this.scroll.x-this.x)/this.zoom - this.select.selection[i].offX;
						circut[this.select.selection[i].index].y = (mouse.y+this.scroll.y-this.y)/this.zoom - this.select.selection[i].offY;
						if (this.grid.visible) {
							circut[this.select.selection[i].index].x = Math.round(circut[this.select.selection[i].index].x/this.grid.size)*this.grid.size;
							circut[this.select.selection[i].index].y = Math.round(circut[this.select.selection[i].index].y/this.grid.size)*this.grid.size;
						}
						if (circut[this.select.selection[i].index].x < this.scroll.x) {
							//circut[this.select.selection[i].index].x = this.scroll.x;
						}
						if (circut[this.select.selection[i].index].y < this.scroll.y) {
							//circut[this.select.selection[i].index].y = this.scroll.y;
						}
					}
				}
			}
		}
		if (!mouse.down) {
			if (mouse.prev) {
				if (this.select.dragging) {
					if (mouseOn(backpack.x, backpack.y, backpack.w, backpack.h) && backpack.visible) {
						removeSelection();
					}
				}
				if (this.connect.connecting) {
					touchingNode = false;
					var node;
					var nodePos;
					johncena:
					for (var i = 0; i < circut.length; i++) {
						for (var j = 0; j < blocks[circut[i].type].inputCount; j++) {
							nodePos = nodeXY(circut[i].type, 0, j);
							if (mouseIn(this.zoom*(circut[i].x-this.scroll.x)+this.x+this.zoom*nodePos.x, this.zoom*(circut[i].y-this.scroll.y)+this.y+this.zoom*nodePos.y, LAYOUT.block.nodePadding*this.zoom)) {
								touchingNode = true;
								node = {block: i, inout: 0, node: j};
								break johncena;
							}
						}
						for (var j = 0; j < blocks[circut[i].type].outputCount; j++) {
							nodePos = nodeXY(circut[i].type, 1, j);
							if (mouseIn(this.zoom*(circut[i].x-this.scroll.x)+this.x+this.zoom*nodePos.x, this.zoom*(circut[i].y-this.scroll.y)+this.y+this.zoom*nodePos.y, LAYOUT.block.nodePadding*this.zoom)) {
								touchingNode = true;
								node = {block: i, inout: 1, node: j};
								break johncena;
							}
						}
					}
					if (touchingNode) { //touching node
						if (node.inout === 0) {
							this.connect.innode = {block: node.block, node: node.node};
						} else {
							this.connect.outnode = {block: node.block, node: node.node};
						}
						if (node.inout !== this.connect.startNode) {
							if (circut[this.connect.innode.block].inputConnections[this.connect.innode.node].connected) {
								removeConnection(this.connect.innode.block, this.connect.innode.node);
							}
							createConnection(this.connect.outnode, this.connect.innode);
						}
					}
				}
			}
			this.select.selecting = false;
			if (this.select.dragging) {
				if (this.select.x1 === mouse.x && this.select.y1 === mouse.y) {
					// clicking on a block in the selection
					for (var i = 0; i < this.select.selection.length; i++) {
						var block = circut[this.select.selection[i].index];
						if (block.type === 0) {
							if (block.state == true) {
								block.state = false;
							} else {
								block.state = true;
							}
						}
					}
				}
			}
			this.select.dragging = false;
			this.scroll.scrolling = false;
			this.connect.connecting = false;
		}
		if ((keysDown.includes("Backspace") || keysDown.includes("Delete")) && !backpack.searchBox.selected) {
			removeSelection();
		}
	},
	render: function() {
		//BACKGROUND
		ctx.fillStyle = LAYOUT.stage.colour;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		if (this.grid.visible) {
			ctx.fillStyle = "#ccc";
			for (var i = 0; i < Math.ceil(this.h/this.grid.size/this.zoom)+1; i++) {
				ctx.fillRect(this.x, this.y + (i*this.grid.size-this.scroll.y%this.grid.size)*this.zoom, this.w, 1);
			}
			for (var i = 0; i < Math.ceil(this.w/this.grid.size/this.zoom)+1; i++) {
				ctx.fillRect(this.x + (i*this.grid.size-this.scroll.x%this.grid.size)*this.zoom, this.y, 1, this.h);
			}
			ctx.fillStyle = "#bbb";
			ctx.fillRect(this.x, this.y-this.scroll.y*this.zoom, this.w, 2);
			ctx.fillRect(this.x-this.scroll.x*this.zoom, this.y, 2, this.h);
		}
		
		//CONNECTIONS
		for (var i = 0; i < circut.length; i++) {
			for (var j = 0; j < circut[i].outputConnections.length; j++) {
				if (circut[i].outputConnections[j].connected) {
					for (var k = 0; k < circut[i].outputConnections[j].connections.length; k++) {
						drawConnection({block: i, node: j}, {block: circut[i].outputConnections[j].connections[k].block, node: circut[i].outputConnections[j].connections[k].node});
					}
				}
			}
		}
		
		//CONNECTING CONNECTION
		if (this.connect.connecting) {
			if (this.connect.startNode === 0) {
				var nodePos = {x: stage.x+(circut[this.connect.innode.block].x + nodeXY(circut[this.connect.innode.block].type, 0, this.connect.innode.node).x - stage.scroll.x)*stage.zoom, y: stage.y+(circut[this.connect.innode.block].y + nodeXY(circut[this.connect.innode.block].type, 0, this.connect.innode.node).y - stage.scroll.y)*stage.zoom};
			} else {
				var nodePos = {x: stage.x+(circut[this.connect.outnode.block].x + nodeXY(circut[this.connect.outnode.block].type, 1, this.connect.outnode.node).x - stage.scroll.x)*stage.zoom, y: stage.y+(circut[this.connect.outnode.block].y + nodeXY(circut[this.connect.outnode.block].type, 1, this.connect.outnode.node).y - stage.scroll.y)*stage.zoom};
			}
			ctx.lineWidth = 4*this.zoom;
			ctx.strokeStyle = LAYOUT.select.colour;
			ctx.beginPath();
			ctx.lineTo(nodePos.x, nodePos.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.stroke();
		}
		
		//BLOCKS
		for (var i = circut.length-1; i > -1; i--) {
			var inSelction = false;
			for (var j = 0; j < this.select.selection.length; j++) {
				if (this.select.selection[j].index === i) {
					inSelction = true;
				}
			}
			var colour = blocks[circut[i].type].colour;
			if (circut[i].type === 0 || circut[i].type === 1 || circut[i].type === 2) {
				if (circut[i].state == true) {
					colour = "#d32";
				} else if (circut[i].state == false) {
					colour = "#222";
				}
			}
			drawGate(circut[i].type, circut[i].label, colour, this.x+(circut[i].x-this.scroll.x)*this.zoom, this.y+(circut[i].y-this.scroll.y)*this.zoom, this.zoom, blocks[circut[i].type].inputCount, blocks[circut[i].type].outputCount, inSelction, circut[i].inputStates, circut[i].outputStates);
		}
	},
	renderFront: function() {
		var block;
		if (this.select.dragging) {
			for (var i = stage.select.selection.length-1; i > -1; i--) {
				block = circut[stage.select.selection[i].index];
				var colour = blocks[block.type].colour;
				if (block.type === 0 || block.type === 1 || block.type === 2) {
					if (block.state == true) {
						colour = "#d32";
					} else if (block.state == false) {
						colour = "#222";
					}
				}
				drawGate(block.type, circut[stage.select.selection[i].index].label, colour, stage.x+(block.x-stage.scroll.x)*stage.zoom, stage.y+(block.y-stage.scroll.y)*stage.zoom, stage.zoom, blocks[block.type].inputCount, blocks[block.type].outputCount, true, block.inputStates, block.outputStates);
			}
		}
		this.select.render();
		this.controls.render();
	}
}
var cursor = {
	cursor: "default",
	set: function (cur) {
		if (cursor.cursor === "default" || cur === "default") {
			cursor.cursor = cur;
			canvas.style.cursor = cur;
		}
	}
};
var header = {
	title: "",
	x: null,
	y: null,
	w: null,
	h: null,
	visible: true,
	fit: function() {
		LAYOUT.fontSize = this.h-LAYOUT.header.padding.y*2;
		this.x = 0;
		this.y = 0;
		this.w = WIDTH;
		this.h = LAYOUT.header.height;
		this.file.x = this.x+this.w-(textWidth(this.file.title)+LAYOUT.header.padding.x*2);
		this.file.y = this.y;
		this.file.w = textWidth(this.file.title)+LAYOUT.header.padding.x*2;
		this.file.h = this.h;
		
		this.move.x = this.x+250;
		this.move.y = this.y;
		this.move.w = textWidth(this.move.title)+LAYOUT.header.padding.x*2;
		this.move.h = this.h;
	},
	show: function() {
		this.visible = true;
	},
	hide: function() {
		this.visible = false;
	},
	update: function() {
		if (this.visible) {
			this.file.update();
			this.move.update();
		}
	},
	render: function() {
		if (this.visible) {
			ctx.fillStyle = LAYOUT.header.background;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fillStyle = LAYOUT.header.colour;
			LAYOUT.fontSize = this.h-LAYOUT.header.padding.y*2;
			textAt(this.title, this.x+LAYOUT.header.padding.x, this.y+LAYOUT.header.padding.y+LAYOUT.fontSize/8);
			this.file.render();
			this.move.render();
		}
	},
	file: {
		title: "File",
		x: null,
		y: null,
		w: null,
		h: null,
		hover: false,
		update: function() {
			if (mouseOn(this.x, this.y, this.w, this.h)) {
				cursor.set("pointer");
				this.hover = true;
				if (mouse.down && !mouse.prev) {
					this.menu.visible = true;
				}
			} else {
				if (!this.menu.visible) {
					this.hover = false;
				}
			}
			if (this.menu.visible) {
				this.menu.update();
			}
		},
		render: function() {
			if (this.hover) {
				ctx.fillStyle = LAYOUT.header.hover;
			} else {
				ctx.fillStyle = LAYOUT.header.background;
			}
			ctx.fillRect(this.x, this.y, this.w, this.h)
			ctx.fillStyle = LAYOUT.header.colour;
			LAYOUT.fontSize = this.h-LAYOUT.header.padding.y*2;
			textAt(this.title, this.x+LAYOUT.header.padding.x, this.y+LAYOUT.header.padding.y+LAYOUT.fontSize/8);
			this.menu.render();
		},
		menu: {
			visible: false,
			hover: null,
			contents: [ /* 📁 ✔ 📂*/
				{name: "Save📁", action: function() {save()}},
				{name: "Load📂", action: function() {load()}},
				{name: "Show All", action: function() {header.show(); backpack.show(); backpack.searchBox.show(); stage.controls.visible = true;}},
				{name: "Exit", action: function() {console.log(this.name)}}
			],
			update: function() {
				LAYOUT.fontSize = 24;
				if (this.visible) {
					var x = header.file.x;
					var y = header.y + header.h;
					var w = 0;
					for (var i = 0; i < this.contents.length; i++) {
						if (w < menuDims(this.contents[i].name).w) {
							w = menuDims(this.contents[i].name).w;
						}
					}
					var h = this.contents.length*(LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y)+LAYOUT.ctxMnu.padding.y*2;
					if (x > WIDTH-w) {
						x = WIDTH-w;
					}
					if (mouseOn(x, y, w, h)) {
						cursor.set("pointer");
						this.hover = Math.floor((mouse.y-y-LAYOUT.ctxMnu.padding.y)/(LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y));
						if (mouse.down && !mouse.prev) {
							this.contents[this.hover].action();
						}
					} else {
						this.hover = null;
						if (!mouseOn(header.file.x, header.file.y, header.file.w, header.file.h)) {
							if (mouse.down && !mouse.prev) {
								this.visible = false;
								header.file.hover = false;
							}
						}
					}
				}
			},
			render: function() {
				if (this.visible) {
					LAYOUT.fontSize = 24;
					ctx.fillStyle = LAYOUT.ctxMnu.background;
					var x = header.file.x;
					var w = 0;
					for (var i = 0; i < this.contents.length; i++) {
						if (w < menuDims(this.contents[i].name).w) {
							w = menuDims(this.contents[i].name).w;
						}
					}
					var h = this.contents.length*(LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y)+LAYOUT.ctxMnu.padding.y*2;
					if (x > WIDTH-w) {
						x = WIDTH-w;
					}
					ctx.roundRect(x, header.file.y+header.file.h, w, h, LAYOUT.ctxMnu.curve)
					var c;
					var offY = 0;
					for (var i = 0; i < this.contents.length; i++) {
						c = this.contents[i];
						if (this.hover === i) {
							ctx.fillStyle = LAYOUT.ctxMnu.hover;
							ctx.roundRect(x, header.file.y+header.file.h+LAYOUT.ctxMnu.padding.y+offY, w, LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y, LAYOUT.ctxMnu.curve)
						}
						ctx.fillStyle = LAYOUT.ctxMnu.colour;
						textAt(c.name, x+LAYOUT.ctxMnu.padding.x, header.file.y+header.file.h+LAYOUT.ctxMnu.padding.y+offY+LAYOUT.fontSize/8);
						offY += LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y;
					}
				}
			}
		}
	},
	move: {
		title: "Move",
		x: null,
		y: null,
		w: null,
		h: null,
		hover: false,
		highlighted: false,
		update: function() {
			if (mouseOn(this.x, this.y, this.w, this.h)) {
				cursor.set("pointer");
				this.hover = true;
				this.highlighted = true;
				if (mouse.down && !mouse.prev) {
					stage.scroll.scrollMode = true;
				}
			} else {
				this.hover = false;
				if (!stage.scroll.scrollMode) {
					this.highlighted = false;
				} else {
					this.highlighted = true;
				}
			}
		},
		render: function() {
			if (this.highlighted) {
				ctx.fillStyle = LAYOUT.header.hover;
			} else {
				ctx.fillStyle = LAYOUT.header.background;
			}
			ctx.fillRect(this.x, this.y, this.w, this.h)
			ctx.fillStyle = LAYOUT.header.colour;
			LAYOUT.fontSize = this.h-LAYOUT.header.padding.y*2;
			textAt(this.title, this.x+LAYOUT.header.padding.x, this.y+LAYOUT.header.padding.y+LAYOUT.fontSize/8);
			if (this.hover) {
				ctx.fillStyle = "#222";
				ctx.fillRect(mouse.x+15, mouse.y, textWidth("⚠ hold space"), LAYOUT.fontSize);
				ctx.fillStyle = "#fff";
				textAt("⚠ hold space", mouse.x+15, mouse.y+3);
			}
		}
	}
}
var backpack = {
	x: null,
	y: null,
	w: LAYOUT.backpack.width,
	h: null,
	visible: true,
	fit: function() {
		backpack.x = 0;
		if (header.visible) {
			backpack.y = header.y+header.h;
		} else {
			backpack.y = 0;
		}
		LAYOUT.fontSize = 18;
		if (backpack.w < Math.max(LAYOUT.backpack.width, textWidth(this.searchBox.value)+LAYOUT.backpack.padding.x*2+LAYOUT.search.radius)) {
			backpack.w = Math.max(LAYOUT.backpack.width, textWidth(this.searchBox.value)+LAYOUT.backpack.padding.x*2+LAYOUT.search.radius);
		}
		backpack.h = HEIGHT-backpack.x;
	},
	resize: function() {
		if (this.visible) {
			if (LAYOUT.backpack.resizable) {
				if (backpack.y < mouse.y && mouse.y < backpack.y + backpack.h) {
					if (mouse.x < backpack.x + backpack.w + LAYOUT.backpack.leway && backpack.x + backpack.w - LAYOUT.backpack.leway < mouse.x) {
						cursor.set("w-resize");
						if (mouse.down && !mouse.prev) {
							backpack.resizing = true;
						}
					}
				}
				if (!mouse.down) {
					backpack.resizing = false;
				}
				if (backpack.resizing) {
					backpack.w = mouse.x - backpack.x;
				}
				LAYOUT.fontSize = 18;
				if (backpack.w < Math.max(LAYOUT.backpack.width, textWidth(this.searchBox.value)+LAYOUT.backpack.padding.x*2+LAYOUT.search.radius)) {
					backpack.w = Math.max(LAYOUT.backpack.width, textWidth(this.searchBox.value)+LAYOUT.backpack.padding.x*2+LAYOUT.search.radius);
				}
				if (backpack.w > WIDTH - backpack.x) {
					backpack.w = WIDTH - backpack.x;
				}
				this.searchBox.w = backpack.w-LAYOUT.backpack.padding.x*2;
			}
		}
	},
	render: function() {
		if (this.visible) {
			ctx.fillStyle = LAYOUT.backpack.background;
			ctx.fillRect(backpack.x, backpack.y, backpack.w, backpack.h);
			backpack.searchBox.render(backpack.x, backpack.y);
			
			var offX = LAYOUT.backpack.padding.x + LAYOUT.block.nodePadding*2;
			var offY = LAYOUT.backpack.padding.y;
			if (backpack.searchBox.visible) {
				offY += backpack.searchBox.y+backpack.searchBox.h;
			}
			var show;
			for (var i = 0; i < blocks.length; i++) {
				show = true;
				if (this.searchBox.visible && this.searchBox.value !== "") {
					for (var j = 0; j < this.searchBox.value.length; j++) {						
						if (j >= blocks[i].name.length) {
							show = false;
							break;
						} else if (this.searchBox.value[j].toLowerCase() !== blocks[i].name[j].toLowerCase()) {
							show = false;
							break;
						}
					}
				}
				if (show) {
					drawGate(i, blocks[i].name, blocks[i].colour, this.x+offX, this.y+offY, 1, blocks[i].inputCount, blocks[i].outputCount);
					offY += blockDims(i, 1).h + LAYOUT.backpack.padding.y;
				}
			}
		}
	},
	update: function() {
		if (this.visible) {
			this.searchBox.select(backpack.x, backpack.y);
			var touchingBlock = false;
			for (var i = 0; i < circut.length; i++) {
				if (mouseOn(circut[i].x, circut[i].y, circut[i].w, circut[i].h)) {
					touchingBlock = true;
				}
			}
			if (mouse.down && !mouse.prev && !touchingBlock) {
				var offX = LAYOUT.backpack.padding.x + LAYOUT.block.nodePadding*2;
				var offY = LAYOUT.backpack.padding.y;
				if (backpack.searchBox.visible) {
					offY += backpack.searchBox.y+backpack.searchBox.h;
				}
				var show;
				for (var i = 0; i < blocks.length; i++) {
					show = true;
					if (this.searchBox.visible && this.searchBox.value !== "") {
						for (var j = 0; j < this.searchBox.value.length; j++) {
							if (j >= blocks[i].name.length) {
								show = false;
								break;
							} else if (this.searchBox.value[j].toLowerCase() !== blocks[i].name[j].toLowerCase()) {
								show = false;
								break;
							}
						}
					}
					if (show) {
						LAYOUT.fontSize = LAYOUT.block.textSize;
						if (mouseOn(this.x+offX, this.y+offY, blockDims(i, 1).w, blockDims(i, 1).h)) {
							addBlock(i, (-this.w+offX)/stage.zoom+stage.scroll.x, this.y-stage.y+(offY)/stage.zoom+stage.scroll.y);
							stage.select.selection = [{index: circut.length-1, offX: (mouse.x+stage.scroll.x-stage.x)/stage.zoom-circut[circut.length-1].x, offY: (mouse.y+stage.scroll.y-stage.y)/stage.zoom-circut[circut.length-1].y}];
							stage.select.dragging = true;
						}
						offY += blockDims(i, 1).h + LAYOUT.backpack.padding.y;
					}
				}
			}
		}
	},
	show: function() {
		this.visible = true;
	},
	hide: function() {
		this.visible = false;
	},
	searchBox: {
		x: LAYOUT.backpack.padding.x,
		y: LAYOUT.backpack.padding.y,
		w: null,
		h: LAYOUT.search.height,
		selected: false,
		cTimer: 0,
		cPos: 0,
		preset: "Search",
		value: "",
		visible: true,
		show: function() {
			this.visible = true;
			this.value = "";
		},
		hide: function() {
			this.visible = false;
		},
		select: function(ox, oy) {
			if (this.visible) {
				LAYOUT.fontSize = 18;
				if (mouseOn(ox+this.x, oy+this.y, this.w, this.h)) {
					cursor.set("text");
					if (mouse.down && !mouse.prev) {
						this.cTimer = 0;
						this.cPos = this.value.length;
						for (var i = 0; i < this.value.length; i++) {
							if (textWidth(this.value.substring(0, i)) > mouse.x-(ox+this.x+LAYOUT.search.radius/2)) {
								this.cPos = i;
								if (this.cPos < 0) {
									this.cPos = 0;
								}
								if (this.cPos > this.value.length) {
									this.cPos = this.value.length;
								}
								break;
							}
						}
						this.selected = true;
						keysPressed = [];
					}
				} else {
					if (mouse.down && !mouse.prev) {
						this.selected = false;
					}
				}
				if (this.selected) {
					this.cTimer++;
					for (var i = 0; i < keysPressed.length; i++) {
						this.cTimer = 0;
						if (alphabet.includes(keysPressed[i])) {
							//this.value += keysPressed[i];
							if (textWidth([this.value.slice(0, this.cPos), keysPressed[i], this.value.slice(this.cPos)].join("")) < this.w-LAYOUT.search.radius) {
								this.value = [this.value.slice(0, this.cPos), keysPressed[i], this.value.slice(this.cPos)].join("");
								this.cPos++;
							}
						}
						if (keysPressed[i] === "Backspace") {
							//this.value = this.value.slice(0, -1);
							this.value = this.value.substring(0, this.cPos-1) + this.value.substring(this.cPos, this.value.length);
							this.cPos--;
							if (this.cPos < 0) {
								this.cPos = 0;
							}
						}
						if (keysPressed[i] === "Delete") {
							this.value = this.value.substring(0, this.cPos) + this.value.substring(this.cPos+1, this.value.length);
						}
						if (keysPressed[i] === "ArrowLeft") {
							this.cPos--;
							if (this.cPos < 0) {
								this.cPos = 0;
							}
						}
						if (keysPressed[i] === "ArrowRight") {
							this.cPos++;
							if (this.cPos > this.value.length) {
								this.cPos = this.value.length;
							}
						}
						keysPressed.shift();
						i--;
					}
					if (keysDown.includes("Backspace") && keysDown.includes("Control")) {
						this.value = this.value.substring(this.cPos, this.value.length);
						this.cPos = 0;
					}
					if (keysDown.includes("ArrowLeft") && keysDown.includes("Control")) {
						this.cPos = 0;
					}
					if (keysDown.includes("ArrowRight") && keysDown.includes("Control")) {
						this.cPos = this.value.length;
					}
					if (keysDown.includes("Enter")) {
						this.selected = false;
					}
				}
			}
		},
		render: function(ox, oy) {
			if (this.visible) {
				LAYOUT.fontSize = 18;
				ctx.fillStyle = LAYOUT.search.background;
				ctx.roundRect(ox+this.x, oy+this.y, this.w, this.h, LAYOUT.search.radius);
				var display;
				if (this.selected) {
					ctx.fillStyle = LAYOUT.search.selected;
					display = this.value;
					if (Math.floor(this.cTimer/15)%2 === 0) {
						ctx.fillRect(ox+this.x+LAYOUT.search.radius/2 + (textWidth(display.slice(0, this.cPos))), oy+this.y+this.h/2-LAYOUT.fontSize/2, 1, LAYOUT.fontSize);
					}
				} else {
					ctx.fillStyle = LAYOUT.search.colour;
					if (this.value !== "") {
						display = this.value;
					} else {
						display = this.preset;
					}
				}
				textAt(display, ox+this.x+LAYOUT.search.radius/2, oy+this.y+(this.h-(LAYOUT.fontSize)/1.6)/2);
			}
		}
	}
};
var ctxMnu = {
	visible: false,
	prevVisible: false,
	x: null,
	y: null,
	w: null,
	h: null,
	contents: [],
	hover: null,
	leftClick: function() {
		LAYOUT.fontSize = 24;
		if (!mouse.left && mouse.prevLeft) {
			this.contents = [];
			if (mouseOn(backpack.x, backpack.y, backpack.w, backpack.h) && backpack.visible) {
				if (mouseOn(backpack.x+backpack.searchBox.x, backpack.y+backpack.searchBox.y, backpack.searchBox.w, backpack.searchBox.h) && backpack.visible &&backpack.searchBox.visible) {
					if (backpack.searchBox.visible) {
						this.contents.push({name: "Hide Search", action: function() {backpack.searchBox.hide()}});
					} else {
						this.contents.push({name: "Show Search", action: function() {backpack.searchBox.show()}});
					}
				} else {
					if (backpack.visible) {
						this.contents.push({name: "Hide", action: function() {backpack.hide()}});
					} else {
						this.contents.push({name: "Show", action: function() {backpack.show()}});
					}
				}
			} else if (mouseOn(header.x, header.y, header.w, header.h)) {
				if (header.visible) {
					this.contents.push({name: "Hide Header", action: function() {header.hide()}});
				} else {
					this.contents.push({name: "Show Header", action: function() {header.show()}});
				}
			} else if (mouseOn(stage.x, stage.y, stage.w, stage.h)) {
				if (mouseOn(stage.x+stage.controls.x, stage.y+stage.controls.y, stage.controls.w, stage.controls.h) && stage.controls.visible) {
					this.contents.push({name: "Hide Controls", action: function() {stage.controls.visible = false;}});
				} else {
					var touchingBlock = false;
					var blockTouching;
					for (var i = 0; i < circut.length; i++) {
						LAYOUT.fontSize = LAYOUT.block.textSize*stage.zoom;
						if (mouseOn(stage.x+(circut[i].x-stage.scroll.x)*stage.zoom, stage.y+(circut[i].y-stage.scroll.y)*stage.zoom, blockDims(circut[i].type, stage.zoom).w, blockDims(circut[i].type, stage.zoom).h)) {
							touchingBlock = true;
							blockTouching = i;
							break;
						}
					}
					if (touchingBlock) {
						if (stage.select.selection.length > 0) {
							this.contents.push({name: "Duplicate", action: function() {stage.duplicateSelection()}});
							this.contents.push({name: "Delete", action: function() {removeSelection();}});
						}
						this.contents.push({name: "["+blocks[circut[blockTouching].type].name+"] Truthtable", action: function() {console.log(this.name)}});
						this.contents.push({name: "Rename", action: function() {circut[blockTouching].label = prompt("Rename:", circut[blockTouching].label);}});
					} else {
						this.contents.push({name: "Create Block", action: function() {createBlock(String(prompt("name", "new block")), String(prompt("colour", "#93d")))}});
						this.contents.push({name: "Clear", action: function() {if(confirm("are you sure you want to clear the stage?")) {stage.clearCircut();}}});
						this.contents.push({name: "Toggle Grid", action: function() {if (stage.grid.visible) {stage.grid.visible = false;} else {stage.grid.visible = true;}}});
						this.contents.push({name: "Reset View", action: function() {stage.zoom = 1; stage.scroll.x = 0; stage.scroll.y = 0;}});
					}
				}
			}
			this.w = 0;
			LAYOUT.fontSize = 24;
			for (var i = 0; i < ctxMnu.contents.length; i++) {
				if (this.w < menuDims(ctxMnu.contents[i].name).w) {
					this.w = menuDims(ctxMnu.contents[i].name).w;
				}
			}
			this.h = ctxMnu.contents.length*(LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y)+LAYOUT.ctxMnu.padding.y*2;
			ctxMnu.visible = true;
			ctxMnu.x = mouse.x;
			ctxMnu.y = mouse.y;
			if (ctxMnu.x < 0) {
				ctxMnu.x = 0;
			}
			if (ctxMnu.x > WIDTH-this.w) {
				ctxMnu.x = WIDTH-this.w;
			}
			if (ctxMnu.y < 0) {
				ctxMnu.y = 0;
			}
			if (ctxMnu.y > HEIGHT-this.h) {
				ctxMnu.y = HEIGHT-this.h;
			}
		}
		if (ctxMnu.visible) {
			if (mouseOn(ctxMnu.x, ctxMnu.y, this.w, this.h)) {
				ctxMnu.hover = Math.floor((mouse.y-ctxMnu.y-LAYOUT.ctxMnu.padding.y)/(LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y));
				if (mouse.down && !mouse.prev) {
					ctxMnu.contents[ctxMnu.hover].action();
				}
			} else {
				ctxMnu.hover = null;
			}
		}
		if (mouse.down && !mouse.prev) {
			ctxMnu.visible = false;
		}
	},
	render: function () {
		if (ctxMnu.visible) {
			LAYOUT.fontSize = 24;
			ctx.fillStyle = LAYOUT.ctxMnu.background;
			ctx.roundRect(ctxMnu.x, ctxMnu.y, this.w, this.h, LAYOUT.ctxMnu.curve)
			var c;
			var offY = 0;
			for (var i = 0; i < ctxMnu.contents.length; i++) {
				c = ctxMnu.contents[i];
				if (ctxMnu.hover === i) {
					ctx.fillStyle = LAYOUT.ctxMnu.hover;
					ctx.roundRect(ctxMnu.x, ctxMnu.y+LAYOUT.ctxMnu.padding.y+offY, this.w, LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y, LAYOUT.ctxMnu.curve)
				}
				ctx.fillStyle = LAYOUT.ctxMnu.colour;
				textAt(c.name, ctxMnu.x+LAYOUT.ctxMnu.padding.x, ctxMnu.y+LAYOUT.ctxMnu.padding.y+offY+LAYOUT.fontSize/8);
				offY += LAYOUT.fontSize+LAYOUT.ctxMnu.padding.y;
			}
		}
	}
};
var blocks = [{ //purple: #93d
	name: "input",
	colour: "#999",
	inputCount: 0,
	outputCount: 1
}, {
	name: "output",
	colour: "#999",
	inputCount: 1,
	outputCount: 0
}, {
	name: "",
	colour: "#999",
	inputCount: 1,
	outputCount: 1
}, {
	name: "not",
	colour: "#d32",
	inputCount: 1,
	outputCount: 1
}, {
	name: "and",
	colour: "#6d0",
	inputCount: 2,
	outputCount: 1
}];
var circut = [];
function createBlock(name, colour) {
	var inputCount = 0;
	var outputCount = 0;
	for (var i = 0; i < circut.length; i++) {
		if (circut[i].type === 0) {
			inputCount++;
		} else if (circut[i].type === 1) {
			outputCount++;
		}
	}
	blocks.push({circut: JSON.parse(JSON.stringify(circut)), name: name, colour: colour, inputCount: inputCount, outputCount: outputCount});
}
function addBlock(type, x, y) {
	var inputConnections = [];
	for (var i = 0; i < blocks[type].inputCount; i++) {
		inputConnections.push({connected: false, block: null, node: null});
	}
	var outputConnections = [];
	for (var i = 0; i < blocks[type].outputCount; i++) {
		outputConnections.push({connected: false, connections: []});
	}
	if ([0, 1, 2].includes(type)) {
		circut.push({type: type, label: blocks[type].name, x: x, y: y, inputConnections: inputConnections, outputConnections: outputConnections, state: false});
	} else if ([3, 4].includes(type)) {
		circut.push({type: type, label: blocks[type].name, x: x, y: y, inputConnections: inputConnections, outputConnections: outputConnections});
	} else {
		circut.push({circut: JSON.parse(JSON.stringify(blocks[type].circut)), type: type, label: blocks[type].name, x: x, y: y, inputConnections: inputConnections, outputConnections: outputConnections});
	}
	
	
	//circut.push({type: type, x: x, y: y, inputConnections: inputConnections});
}
function removeBlock(index) {
	//reorder selection
	for (var i = 0; i < stage.select.selection.length; i++) {
		if (stage.select.selection[i].index > index) {
			stage.select.selection[i].index--;
		}
	}
	//kill connections of block
	for (var i = 0; i < circut[index].inputConnections.length; i++) { //input connections
		if (circut[index].inputConnections[i].connected) {
			removeConnection(index, i);
		}
	}
	for (var i = 0; i < circut[index].outputConnections.length; i++) { //output connections
		if (circut[index].outputConnections[i].connected) {
			for (var j = 0; j < circut[index].outputConnections[i].connections.length; j++) {
				var target = circut[index].outputConnections[i].connections[j];
				removeConnection(target.block, target.node);
				j--;
			}
		}
	}
	//reorder connections
	for (var i = 0; i < circut.length; i++) {
		for (var j = 0; j < circut[i].inputConnections.length; j++) {
			if (circut[i].inputConnections[j].block > index) {
				circut[i].inputConnections[j].block--;
			}
		}
		for (var j = 0; j < circut[i].outputConnections.length; j++) {
			for (var k = 0; k < circut[i].outputConnections[j].connections.length; k++) {
				if (circut[i].outputConnections[j].connections[k].block > index) {
					circut[i].outputConnections[j].connections[k].block--;
				}
			}
		}
	}
	
	circut.splice(index, 1);
}
function removeSelection() {
	for (var i = 0; i < stage.select.selection.length; i++) {
		removeBlock(stage.select.selection[0].index);
		stage.select.selection.shift();
		i--;
	}
}
function createConnection(outnode, innode) {
	circut[outnode.block].outputConnections[outnode.node].connected = true;
	circut[outnode.block].outputConnections[outnode.node].connections.push({block: innode.block, node: innode.node});
	circut[innode.block].inputConnections[innode.node] = {connected: true, block: outnode.block, node: outnode.node};
}
function removeConnection(block, node) { //node that the connection goes TO
	//console.log("Removing Connection -> {block: ", block, ", node: ", node, "}");

	var target = circut[block].inputConnections[node];
	var connections = circut[target.block].outputConnections[target.node].connections
	var index = 0;
	for (var i = 0; i < connections.length; i++) {
		if (connections[i].block === block && connections[i].node === node) {
			index = i;
			break;
		}
	}
	connections.splice(index, 1);
	if (circut[target.block].outputConnections[target.node].connections.length < 1) {
		circut[target.block].outputConnections[target.node].connected = false;
	}
	circut[block].inputConnections[node] = {connected: false, block: null, node: null};
}

function createInstances(circut) {
	for (var i = 0; i < circut.length; i++) {
		if (circut[i].type > 4) {
			circut[i].circut = JSON.parse(JSON.stringify(blocks[circut[i].type]));
			createInstances(circut[i].circut);
		}
	}
}
function updateDelays(circut) {
	for (var i = 0; i < circut.length; i++) {
		if (circut[i].type === 2) {
			if (circut[i].inputStates !== undefined) {
				if (circut[i].inputStates[0] === true) {
					circut[i].state = true;
				} else {
					circut[i].state = false;
				}
			}
		} else if (circut[i].type > 4) {
			updateDelays(circut[i].circut);
		}
	}
}
function clearInputOutputStates(circut) {
	for (var i = 0; i < circut.length; i++) {
		// sets all input blocks to null
		if (circut[i].type === 0) {
			circut[i].state = null;
		}
		if (circut[i].type > 4) {
			clearInputOutputStates(circut[i].circut);
		}
	}
}
function clearConnectionStates(circut) {
	for (var i = 0; i < circut.length; i++) {
		circut[i].inputStates = [];
		for (var j = 0; j < blocks[circut[i].type].inputCount; j++) {
			circut[i].inputStates.push(null);
		}
		circut[i].outputStates = [];
		for (var j = 0; j < blocks[circut[i].type].outputCount; j++) {
			circut[i].outputStates.push(null);
		}
		if (circut[i].type > 4) {
			clearConnectionStates(circut[i].circut);
		}
	}
}
function execute(circut) {
	//get all the starting gates in the first scope that the trees will begin with.
	var starting = [];
	for (var i = 0; i < circut.length; i++) {
		var startingYes = true;
		for (var j = 0; j < circut[i].inputConnections.length; j++) {
			if (circut[i].inputConnections[j].connected) {
				startingYes = false;
				break;
			}
		}
		if (![0, 1, 3, 4].includes(circut[i].type)) {
			startingYes = true;
		}
		if (startingYes) {
			starting.push(i);
		}
	}
	//loop through all the starting gates
	for (var i = 0; i < starting.length; i++) {
		var index = starting[i];
		var block = circut[index];
		var path;
		var node;
		var wire;
		if (block.type === 0 || block.type === 2) {
			//block.outputStates = [block.state];
		} else if (blocks[block.type].outputCount !== 0) {
			
		} else if (block.type === 1) {
			//block.state = block.inputStates[0];
		}
		path = [];
		node = 0;
		wire = -1;
		var fullyExplored = false;
		var allInputs;
		var unexploredOutput;
		//console.log("START");
		while (!fullyExplored) {
			allInputs = true;
			for (var j = 0; j < block.inputConnections.length; j++) {
				if (block.inputConnections[j].connected && block.inputStates[j] === null) {
					allInputs = false;
				}
			}
			if (block.type === 0) { // only for custom gates
				if (block.state === null) {
					allInputs = false;
				}
			}
			if (block.type === 2) {
				allInputs = true;
			}
			unexploredOutput = false;
			for (var j = 0; j < block.outputConnections.length; j++) {
				for (var k = 0; k < block.outputConnections[j].connections.length; k++) {
					var target = block.outputConnections[j].connections[k];
					//console.log(target);
					if (block.outputConnections[j].connected && circut[target.block].inputStates[target.node] === null) {
						unexploredOutput = true;
					}
				}
			}
			//console.log(allInputs, unexploredOutput)
			if (allInputs && unexploredOutput) { //console.log("FOWARD from", blocks[block.type].name);
				//calculate the output
				wire++;
				if (wire >= block.outputConnections[node].connections.length) {
					wire = 0;
					node++;
				}
				
				var outputState;
				if (block.type === 0) {
					outputState = block.state;
				} else if (block.type === 1) {
					console.log("tried to execute output");
				} else if (block.type === 2) {
					outputState = block.state;
				} else if (block.type === 3) {
					outputState = !block.inputStates[0];
				} else if (block.type === 4) {
					outputState = (!!block.inputStates[0])&&(!!block.inputStates[1]);
				} else {
					//console.log("tried to execute type: "+block.type);
					var newCircut = block.circut;
					newCircut[0].state = true;
					var inputIndicies = [];
					for (var j = 0; j < newCircut.length; j++) {
						if (newCircut[j].type === 0) {
							inputIndicies.push(j);
						}
					}
					for (var j = 0; j < inputIndicies.length; j++) {
						var ind = inputIndicies[j];
						newCircut[ind].state = block.inputStates[j];
					}
					
					console.log(newCircut);
					execute(newCircut);
					
					var outputIndicies = [];
					for (var j = 0; j < newCircut.length; j++) {
						if (newCircut[j].type === 1) {
							outputIndicies.push(j);
						}
					}
					outputState = newCircut[outputIndicies[node]].state;
					
					//console.log(newCircut);
				}
				block.outputStates[node] = outputState;
				
				//console.log(block.outputConnections[node].connections, wire);
				var inputNode = block.outputConnections[node].connections[wire].node;
				path.push({index: index, node: node, wire: wire});
				index = block.outputConnections[node].connections[wire].block;
				block = circut[index];
				node = 0;
				wire = -1;
				block.inputStates[inputNode] = outputState;
			} else { //console.log("BACK from", blocks[block.type].name);
				if (block.type === 1) {
					block.state = !!block.inputStates[0];
				}
				if (path.length < 1) {
					fullyExplored = true;
				} else {
					index = path[path.length-1].index;
					block = circut[index];
					node = path[path.length-1].node;
					wire = path[path.length-1].wire;
					//console.log(wire)
					path.pop();
				}
			}
		}
		
	}
}
/*/ STEPS:
	* Loop through all the 0 input devices
	* Repeat until fully explored path
		* Check if you have all the inputs AND there is an unexplored output, if so:
			* calculate the output (output function) - unless already calculated!
			* pick the node
			* pick the wire
			* add to the path array
			* set wire to true / false
			* move on to the next input gate
		* else:
			* if at the start of the path move one to the next (unless done)
			* go back to the previous node in the path
			* set the status to the latest in the path - currentGate
			* delete the latest from the path
/*/

var frame = 0;
var delayTime = 1;
function update() {
	cursor.set("default");
	ctxMnu.leftClick();
	header.fit();
	header.update();
	backpack.fit();
	if (!ctxMnu.visible && !(header.visible && header.file.menu.visible)) {
		backpack.resize();
		backpack.update();
	}
	stage.fit();
	if (!(mouseOn(ctxMnu.x, ctxMnu.y, ctxMnu.w, ctxMnu.h) && ctxMnu.visible) && !(header.visible && header.file.menu.visible)) {
		if (!ctxMnu.prevVisible) {
			stage.update();
		}
	}
	//createInstances(circut);
	for (var i = 0; i < circut.length; i++) {
		if (circut[i].type > 4) {
			clearInputOutputStates(circut[i].circut);
		}
	}
	if (frame%delayTime === 0) {
		updateDelays(circut);
	}
	clearConnectionStates(circut);
	execute(circut);
	
	mouse.prev = mouse.down;
	mouse.prevLeft = mouse.left;
	render();
	
	ctxMnu.prevVisible = ctxMnu.visible;
	
	frame++;
}
function render() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	stage.render();
	backpack.render();
	stage.renderFront();
	header.render();
	ctxMnu.render();
}
function drawGate(type, name, colour, x, y, zoom, inputCount, outputCount, outline, inputStates, outputStates) {
	if (inputStates === undefined) {
		var inputStates = [];
		for (var i = 0; i < inputCount; i++) {
			inputStates.push(0);
		}
	}
	if (outputStates === undefined) {
		var outputStates = [];
		for (var i = 0; i < outputCount; i++) {
			outputStates.push(0);
		}
	}
	LAYOUT.fontSize = LAYOUT.block.textSize*zoom;
	var w = blockDims(type, zoom).w;
	var h = blockDims(type, zoom).h;
	if (outline) {
		ctx.lineWidth = 4;
		ctx.strokeStyle = LAYOUT.select.colour;
		ctx.roundStroke(x-5, y-5, w+10, h+10, LAYOUT.block.curve*zoom);
	}
	if (type === 2) {
		ctx.lineWidth = 4*zoom;
		if (colour === "#d32") {
			ctx.strokeStyle = "#d32";
		} else {
			ctx.strokeStyle = "#000";
		}
		ctx.beginPath();
		ctx.lineTo(x-LAYOUT.block.nodePadding*zoom, y+h/2);
		ctx.lineTo(x, y+h/2);
		ctx.lineTo(x, y+h);
		var j = Math.round(w/zoom/7)*2+1;
		for (var i = 0; i < j-1; i++) {
			ctx.lineTo(x+(i+1)*w/j, y+h*(i%2));
		}
		ctx.lineTo(x+w, y);
		ctx.lineTo(x+w, y+h/2);
		ctx.lineTo(x+w+LAYOUT.block.nodePadding*zoom, y+h/2);
		ctx.stroke();
		
		ctx.fillStyle = LAYOUT.block.colour;
		textAt(name, x+LAYOUT.block.padding.x*zoom, y+(h-LAYOUT.fontSize)/2);
		
	} else {
		ctx.fillStyle = colour;
		ctx.roundRect(x, y, w, h, LAYOUT.block.curve*zoom);
		ctx.fillStyle = "#0003";
		ctx.roundRect(x, y, w, h, LAYOUT.block.curve*zoom);
		ctx.fillStyle = colour;
		ctx.roundRect(x, y, w, h-4*zoom, LAYOUT.block.curve*zoom);
		ctx.fillStyle = LAYOUT.block.colour;
		
		ctx.strokeStyle = "#fff";
		
		textAt(name, x+LAYOUT.block.padding.x*zoom, y+(h-LAYOUT.fontSize)/2);
	}
	
	ctx.fillStyle = "#000";
	var nodePos;
	for (var i = 0; i < inputCount; i++) {
		if (inputStates[i]) {
			ctx.fillStyle = "#d32";
		} else {
			ctx.fillStyle = "#000";
		}
		nodePos = nodeXY(type, 0, i);
		ctx.beginPath();
		ctx.arc(x+zoom*nodePos.x, y+zoom*nodePos.y, LAYOUT.block.nodeRadius*zoom, 0, 2*Math.PI);
		ctx.fill();
	}
	for (var i = 0; i < outputCount; i++) {
		if (outputStates[i]) {
			ctx.fillStyle = "#d32";
		} else {
			ctx.fillStyle = "#000";
		}
		nodePos = nodeXY(type, 1, i);
		ctx.beginPath();
		ctx.arc(x+zoom*nodePos.x, y+zoom*nodePos.y, LAYOUT.block.nodeRadius*zoom, 0, 2*Math.PI);
		ctx.fill();
	}
}
function drawConnection(outnode, innode) {
	if (circut[outnode.block].outputStates === undefined) {
		ctx.strokeStyle = "#000";
	} else {
		if (circut[outnode.block].outputStates[outnode.node]) {
			ctx.strokeStyle = "#d32";
		} else {
			ctx.strokeStyle = "#000";
		}
	}
	ctx.lineWidth = stage.zoom*4;
	ctx.beginPath();
	if (LAYOUT.block.smoothConnections) {
		var n1 = {x: stage.x+(circut[outnode.block].x + nodeXY(circut[outnode.block].type, 1, outnode.node).x - stage.scroll.x)*stage.zoom, y: stage.y+(circut[outnode.block].y + nodeXY(circut[outnode.block].type, 1, outnode.node).y - stage.scroll.y)*stage.zoom};
		var n2 = {x: stage.x+(circut[innode.block].x + nodeXY(circut[innode.block].type, 0, innode.node).x - stage.scroll.x)*stage.zoom, y: stage.y+(circut[innode.block].y + nodeXY(circut[innode.block].type, 0, innode.node).y - stage.scroll.y)*stage.zoom};
		ctx.lineTo(n1.x, n1.y);
		
		if (n1.x < n2.x) {
			ctx.quadraticCurveTo((n1.x+n2.x)/2, n1.y, (n1.x+n2.x)/2, (n1.y+n2.y)/2);
			ctx.stroke();
			if (circut[innode.block].inputStates === undefined) {
				ctx.strokeStyle = "#000";
			} else {
				if (circut[innode.block].inputStates[innode.node]) {
					ctx.strokeStyle = "#d32";
				} else {
					ctx.strokeStyle = "#000";
				}
			}
			ctx.beginPath();
			ctx.lineTo((n1.x+n2.x)/2, (n1.y+n2.y)/2);
			ctx.quadraticCurveTo((n1.x+n2.x)/2, n2.y, n2.x, n2.y);
		} else {
			ctx.quadraticCurveTo(n1.x, (n1.y+n2.y)/2, (n1.x+n2.x)/2, (n1.y+n2.y)/2);
			ctx.stroke();
			if (circut[innode.block].inputStates === undefined) {
				ctx.strokeStyle = "#000";
			} else {
				if (circut[innode.block].inputStates[innode.node]) {
					ctx.strokeStyle = "#d32";
				} else {
					ctx.strokeStyle = "#000";
				}
			}
			ctx.beginPath();
			ctx.lineTo((n1.x+n2.x)/2, (n1.y+n2.y)/2);
			ctx.quadraticCurveTo(n2.x, (n1.y+n2.y)/2, n2.x, n2.y);
		}
	} else {
		var nodePos = nodeXY(circut[outnode.block].type, 1, outnode.node);
		ctx.lineTo(stage.x+(circut[outnode.block].x + nodePos.x - stage.scroll.x)*stage.zoom, stage.y+(circut[outnode.block].y - stage.scroll.y + nodePos.y)*stage.zoom);
		nodePos = nodeXY(circut[innode.block].type, 0, innode.node);
		ctx.lineTo(stage.x+(circut[innode.block].x + nodePos.x - stage.scroll.x)*stage.zoom, stage.y+(circut[innode.block].y + nodePos.y - stage.scroll.y)*stage.zoom);
	}
	ctx.stroke();
}
function textAt(text, x, y) {
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	ctx.fillText(text, x, y+LAYOUT.fontSize/1.39);
}
function textOutline(text, x, y) {
	ctx.font = LAYOUT.fontSize+"px "+LAYOUT.font;
	ctx.strokeText(text, x, y+LAYOUT.fontSize/1.39);
}














