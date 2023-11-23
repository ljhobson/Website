var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var mouse = {x:null, y:null, down:null, prev:null};
document.onmousemove = function(event) {
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
}
canvas.onmousedown = function(event) {
	if (event.which === 1) {
		mouse.down = true;
	}
}
canvas.onmouseup = function(event) {
	if (event.which === 1) {
		mouse.down = false;
	}
}
document.oncontextmenu = function(event) {
	event.preventDefault();
}
var keysDown = [];
document.onkeydown = function(event) {
	if (event.ctrlKey && event.which === 83) {
		event.preventDefault();
		save();
	} else if (event.ctrlKey && event.which === 90) {
		if (stage === 0) {
			event.preventDefault();
			polygon.pop();
		}
	} else if (event.ctrlKey && event.which === 70) {
		if (stage === 0) {
			event.preventDefault();
			polygon.push({x: continents[critPointer[0]].polygon[critPointer[1]+1].x, y: continents[critPointer[0]].polygon[critPointer[1]+1].y});
			critPointer[1]++;
		}
	} else if (event.ctrlKey && event.which === 71) {
		if (stage === 0) {
			event.preventDefault();
			polygon.push({x: continents[critPointer[0]].polygon[critPointer[1]-1].x, y: continents[critPointer[0]].polygon[critPointer[1]-1].y});
			critPointer[1]--;
		}
	} else {
		if (!keysDown.includes(event.key)) {
			keysDown.push(event.key);
		}
	}
}
document.onkeyup = function(event) {
	keysDown.splice(keysDown.indexOf(event.key));
}

class Button {
	constructor(label, x, y) {
		this.label = label;
		if (x === undefined) {
			this.x = 0;
		} else {
			this.x = x;
		}
		if (y === undefined) {
			this.y = 0;
		} else {
			this.y = y;
		}
		ctx.font = "24px Arial";
		this.width = ctx.measureText(label).width+20;
		this.height = 30+10;
		this.textOffX = 10;
		this.textOffY = 5;
		
		this.hover = false;
		this.action = function(){};
	}
	mouseOn() {
		if (this.x <= mouse.x && mouse.x < this.x+this.width && this.y <= mouse.y && mouse.y < this.y+this.height) {
			return (true);
		} else {
			return (false);
		}
	}
	update() {
		if (this.mouseOn()) {
			this.hover = true;
			document.body.style.cursor = "pointer";
			if (mouse.down && !mouse.prev) {
				this.action();
				return (true);
			}
		} else {
			this.hover = false;
		}
		return (false);
	}
	render() {
		if (this.hover) {
			ctx.fillStyle = "#6df";
		} else {
			ctx.fillStyle = "#4bf";
		}
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "#fff";
		ctx.font = "24px Arial";
		ctx.fillText(this.label, this.textOffX+this.x, this.textOffY+this.y+24);
	}
}
class Dropdown {
	constructor(x, y) {
		if (x === undefined) {
			this.x = 0;
		} else {
			this.x = x;
		}
		if (y === undefined) {
			this.y = 0;
		} else {
			this.y = y;
		}
		this.width = 250;
		this.height = 300;
		this.textOffX = 10;
		this.textOffY = 5;
		this.visible = true;
		
		this.hover = null;
		this.items = [];
	}
	mouseOn() {
		if (this.x <= mouse.x && mouse.x < this.x+this.width && this.y <= mouse.y && mouse.y < this.y+this.height) {
			return (true);
		} else {
			return (false);
		}
	}
	update() {
		this.hover = null;
		if (this.visible) {
			if (this.mouseOn()) {
				this.hover = (mouse.y-this.y-this.textOffY)/24;
				if (this.hover < 0) {
					this.hover = null;
				} else if (this.hover >= this.items.length) {
					this.hover = null;
				} else {
					this.hover = Math.floor(this.hover);
					if (mouse.down && !mouse.prev) {
						this.action(this.hover);
					}
				}
				if (mouse.down) {
					return (true);
				}
			}
		}
		return (false);
	}
	render() {
		if (this.visible) {
			ctx.fillStyle = "#222";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			if (this.hover !== null) {
				ctx.fillStyle = "#777";
				ctx.fillRect(this.x, this.textOffY+this.y+24*(this.hover), this.width, 24);
			}
			ctx.fillStyle = "#fff";
			ctx.font = "24px Arial";
			for (var i = 0; i < this.items.length; i++) {
				ctx.fillText(this.items[i], this.textOffX+this.x, this.textOffY+this.y+24*(i+1)-4);
			}
		}
	}
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function distance(x1, y1, x2, y2) {
	return(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)));
}

var reference = {};
reference.ref1 = new Image();
reference.ref1.src = "reference.png";

var stage = 4;
var stages = new Dropdown();
stages.items.push("Create Continents");
stages.items.push("Create Connections");
stages.items.push("Edit Countries");
stages.items.push("Create Bonus Groups");
stages.items.push("Preview");
stages.visible = false;
stages.action = function(menuItem) {
	this.visible = false;
	stage = menuItem;
}
var next = new Button("Next");
next.action = function() {
	stages.visible = true;
}

var addRegion = new Button("Add New");
addRegion.action = function() {
	createBonusGroup(prompt("Name"), Number(prompt("Value", 0)), prompt("Colour"));
}

var groupSelected = 0;
var bonusValues = [];
var bonusGroups = new Dropdown();
function createBonusGroup(name, value, colour) {
	bonusGroups.items.push(name);
	bonusValues.push({name: name, value: value, colour: colour});
}

createBonusGroup("Region 0", 0, "#509");
createBonusGroup("Bymar", 2, "#4bf");
createBonusGroup("West Gelyn", 3, "#191");
createBonusGroup("East Gelyn", 3, "#4d2");
createBonusGroup("North Avenia", 4, "#e20");
createBonusGroup("South Avenia", 6, "#333");
createBonusGroup("NW Carthya", 3, "#129");
createBonusGroup("NE Carthya", 2, "#25b");
createBonusGroup("Drylliad", 5, "#fe0");
createBonusGroup("South Carthya", 3, "#37e");
createBonusGroup("North Mendenwal", 5, "#eee");
createBonusGroup("Central Mendenwal", 7, "#ff5");
createBonusGroup("South Mendenwal", 5, "#ff0");

bonusGroups.action = function(menuItem) {
	groupSelected = menuItem //bonusGroups.items[menuItem];
}

var continents = [];
function save() {
	localStorage.continents = JSON.stringify(continents);
	localStorage.bonusGroupsItems = JSON.stringify(bonusGroups.items);
	localStorage.bonusValues = JSON.stringify(bonusValues);
}
function load() {
	if (localStorage.continents !== undefined) {
		continents = JSON.parse(localStorage.continents);
		bonusGroups.items = JSON.parse(localStorage.bonusGroupsItems);
		bonusValues = JSON.parse(localStorage.bonusValues);
	} else {
		
	}
}
load();
var polygon = [];
var snapRange = 4;
var critPointer = null;
var criticalPoint = {x:null, y:null};
var renderCP = false;
var polygonSelected = null;
var dragging = {
	dragging: false,
	offX: null,
	offY: null
};
var polygonHover = null;
var connecting = {
	connecting: false,
	start: null,
	end: null
};
function createConnection() {
	if (connecting.start !== connecting.end && !continents[connecting.start].connections.includes(connecting.end)) {
		continents[connecting.start].connections.push(connecting.end);
		continents[connecting.end].connections.push(connecting.start);
	} else if (continents[connecting.start].connections.includes(connecting.end)) {
		//continents[connecting.start].connections.push(connecting.end);
	}
	connecting.start = null;
	connecting.end = null;
}

function renderConnections() {
	for (var i = 0; i < continents.length; i++) {
		for (var j = 0; j < continents[i].connections.length; j++) {
			var c = continents[i].connections[j];
			ctx.beginPath();
			ctx.lineTo(continents[i].center.x, continents[i].center.y);
			ctx.lineTo(continents[c].center.x, continents[c].center.y);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(continents[c].center.x, continents[c].center.y, 4, 0, 2*Math.PI);
			ctx.stroke();
		}
	}
}

function renderPolygon(pol, outline, fill) {
	if (pol.length === 1) {
		ctx.beginPath();
		ctx.arc(pol[0].x, pol[0].y, 5, 0, 2*Math.PI);
		ctx.stroke();
		return;
	}
	ctx.beginPath();
	for (var i = 0; i < pol.length; i++) {
		ctx.lineTo(pol[i].x, pol[i].y);
	}
	if (pol.length > 0) {
		ctx.lineTo(pol[0].x, pol[0].y);
	}
	if (fill !== undefined) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	
	ctx.strokeStyle = outline;
	ctx.lineWidth = 2;
	ctx.stroke();
}

function renderContinents(conts) {
	for (var i = conts.length-1; i >= 0; i--) {
		if (stage === 4) {
			renderPolygon(conts[i].polygon, "#000", "#29f");
		} else if (stage === 3) {
			renderPolygon(conts[i].polygon, ["#000", "#ff0"][Number(groupSelected === continents[i].region)], bonusValues[continents[i].region].colour);
		} else {
			renderPolygon(conts[i].polygon, "#000");
		}
	}
}

function render() {
	ctx.drawImage(reference.ref1, 0, 0);
	
	ctx.strokeStyle = "#000";
	renderContinents(continents);
	if (polygonHover !== null) {
		renderPolygon(continents[polygonHover].polygon, "#999");
	}
	if (polygonSelected !== null) {
		var pS = continents[polygonSelected];
		renderPolygon(pS.polygon, "#f33");
		ctx.strokeStyle = "#000";
		ctx.fillText(pS.name, pS.center.x-ctx.measureText(pS.name).width/2, pS.center.y+12);
	}
	renderPolygon(polygon, "#ff0");
	
	if (stage === 1) {
		ctx.strokeStyle = "#ddd";
		renderConnections();
	}
	
	if (stage === 3) {
		bonusGroups.hover = groupSelected;
		addRegion.render();
	}
	
	if (stage === 4) {
		for (var i = 0; i < continents.length; i++) {
			ctx.font = "16px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText(continents[i].name, continents[i].center.x-ctx.measureText(continents[i].name).width/2, continents[i].center.y);
		}
	}
	
	next.render();
	stages.render();
	bonusGroups.render();
	
	
	ctx.fillStyle = "#222";
	ctx.font = "24px Arial";
	ctx.fillText(stages.items[stage], next.x+next.width+10, next.y+next.height*3/4);
	
	if (renderCP) {
		ctx.strokeStyle = "#f33";
		ctx.beginPath();
		ctx.arc(criticalPoint.x, criticalPoint.y, 10, 0, 2*Math.PI);
		ctx.stroke();
	}
}

function update() {
	polygonHover = null;
	if (stage !== 0) {
		if (polygon.length !== 0) {
			addPolygon();
		}
	}
	if (stage !== 2) {
		polygonSelected = null;
	}
	if (stage === 3) {
		bonusGroups.height = bonusGroups.items.length*24+bonusGroups.textOffY*2
		bonusGroups.x = window.innerWidth-bonusGroups.width;
		bonusGroups.y = window.innerHeight-bonusGroups.height;
		bonusGroups.visible = true;
		addRegion.x = bonusGroups.x;
		addRegion.y = bonusGroups.y-addRegion.height;
	} else {
		bonusGroups.visible = false;
	}
	if (polygonSelected === null) {
		textinput.style.display = "none";
	} else {
		textinput.value = continents[polygonSelected].name;
		textinput.style.display = "block";
		//textinput.style.left = continents[polygonSelected].center.x-75+"px";
		//textinput.style.top = continents[polygonSelected].center.y-25+"px";
	}
	next.x = 0;
	next.y = canvas.height-next.height;
	stages.height = stages.items.length*24+stages.textOffY*2
	stages.x = next.x;
	stages.y = next.y-stages.height;
	if (!next.mouseOn() && !stages.mouseOn()) {
		stages.visible = false;
	}
	if (next.update()) {
		return;
	}
	if (stages.update()) {
		return;
	}
	if (bonusGroups.update()) {
		return;
	}
	if (stage === 3) {
		if(addRegion.update()) {
			return;
		}
	}
	
	switch (stage) {
		case 0: // Create Polygons
		if (keysDown.includes("Control")) {
			// default
			criticalPoint = {x: mouse.x, y: mouse.y};
			// find the critical point
			critFound:
			for (var i = 0; i < continents.length; i++) {
				for (var j = 0; j < continents[i].polygon.length; j++) {
					var p = continents[i].polygon[j];
					if (distance(mouse.x, mouse.y, p.x, p.y) < snapRange) {
						criticalPoint = {x: p.x, y: p.y};
						if (mouse.down) {
							critPointer = [i, j];
						}
						break critFound;
					}
				}
			}
			// loop through own polygon
			for (var i = 0; i < polygon.length; i++) {
				var p = polygon[i];
				if (distance(mouse.x, mouse.y, p.x, p.y) < snapRange) {
					criticalPoint = {x: p.x, y: p.y};
					break;
				}
			}
			renderCP = true;
		} else {
			renderCP = false;
		}
		if (mouse.down && !mouse.prev) {
			if (keysDown.includes("Control")) {
				if (polygon.length > 0 && criticalPoint.x === polygon[0].x && criticalPoint.y === polygon[0].y) {
					addPolygon();
				} else {
					polygon.push(criticalPoint);
				}
			} else {
				polygon.push({x: mouse.x, y: mouse.y});
			}
		}
		if (keysDown.includes(" ")) {
			addPolygon();
		}
		break;
		case 1: // Create Connections
		if (mouse.down && !mouse.prev) {
			for (var i = 0; i < continents.length; i++) {
				var p = continents[i].polygon;
				if (inPolygon(mouse.x, mouse.y, p)) {
					connecting.connecting = true;
					connecting.start = i;
					break;
				}
			}
		} else if (mouse.prev && !mouse.down) {
			for (var i = 0; i < continents.length; i++) {
				var p = continents[i].polygon;
				if (inPolygon(mouse.x, mouse.y, p)) {
					connecting.end = i;
					createConnection();
					break;
				}
			}
		}
		if (!mouse.down) {
			connecting.connecting = false;
		}
		break;
		case 2: // Edit Countries
		if (dragging.dragging) {
			if (!mouse.down) {
				dragging.dragging = false;
			} else {
				var p = continents[polygonSelected].polygon;
				for (var i = 0; i < p.length; i++) {
					p[i].x += mouse.x-dragging.offX;
					p[i].y += mouse.y-dragging.offY;
				}
				continents[polygonSelected].center.x += mouse.x-dragging.offX;
				continents[polygonSelected].center.y += mouse.y-dragging.offY;
				dragging.offX = mouse.x;
				dragging.offY = mouse.y;
			}
		} else {
			if (mouse.down && !mouse.prev) {
				polygonSelected = null;
			}
			for (var i = 0; i < continents.length; i++) {
				var p = continents[i].polygon;
				if (inPolygon(mouse.x, mouse.y, p)) {
					polygonHover = i;
					if (mouse.down && !mouse.prev) {
						polygonSelected = i;
						dragging.dragging = true;
						dragging.offX = mouse.x;
						dragging.offY = mouse.y;
					}
					break;
				}
			}
		}
		break;
		case 3: // Select Regions
		if (mouse.down) {
			for (var i = 0; i < continents.length; i++) {
				var p = continents[i].polygon;
				if (inPolygon(mouse.x, mouse.y, p)) {
					continents[i].region = groupSelected;
					break;
				}
			}
		}
		break;
	}
}

function inPolygon(x, y, pol) {
	var count = 0;
	for (var i = 0; i < pol.length; i++) {
		if (lineCrosses(x, y, pol[i].x, pol[i].y, pol[(i+1)%pol.length].x, pol[(i+1)%pol.length].y)) {
			count++;
		}
	}
	if (count%2 === 1) {
		return (true);
	}
	return (false);
}


function lineCrosses(x, y, a, b, c, d) {
	// sort points
	if (b === d) {
		return (false); // line is horizontal
	} else if (b < d) {
		var x1 = a;
		var y1 = b;
		var x2 = c;
		var y2 = d;
	} else {
		var x1 = c;
		var y1 = d;
		var x2 = a;
		var y2 = b;
	}
	// see if line crosses horizontally
	if (!(y1 <= y && y < y2)) {
		return (false);
	}
	// test if intersection within bounds
	if (x <= x1+(x2-x1)*(y-y1)/(y2-y1)) {
		return (true);
	}
	return (false);
}

function addPolygon() {
	if (polygon.length > 2) {
		var cX = 0;
		var cY = 0;
		for (var i = 0; i < polygon.length; i++) {
			cX += polygon[i].x;
			cY += polygon[i].y;
		}
		cX /= polygon.length;
		cY /= polygon.length;
		continents.push({
			name: "Unnamed",
			center: {x: cX, y: cY},
			polygon: polygon,
			connections: [],
			region: 0
		});
	}
	polygon = [];
}

var frame = 0;
function loop() {
	frame++;
	update();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	render();
	mouse.prev = mouse.down;
}

setInterval(loop, 20);



var textinput = document.createElement("INPUT");
var inputX = 500;
var inputY = window.innerHeight-50;
textinput.value = "";
textinput.display = "none";
textinput.placeholder = "name";
textinput.style = `
top: ${inputY}px;
left: ${inputX}px;
`;
textinput.style.display = "none";
textinput.oninput = function() {
	continents[polygonSelected].name = this.value;
}
document.body.appendChild(textinput);





















