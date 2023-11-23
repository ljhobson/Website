var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var mouse = {x:null, y:null, down:null, prev:null};
document.onmousemove = function(event) {
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
	hoverTimer = 0;
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
	if (!keysDown.includes(event.key)) {
		keysDown.push(event.key);
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
		ctx.font = "24px Times New Roman";
		this.width = ctx.measureText(label).width+20;
		this.height = 30+10;
		this.textOffX = 10;
		this.textOffY = 5;
		
		this.hover = false;
		this.action = function(){};
		this.visible = true;
	}
	mouseOn() {
		if (this.x <= mouse.x && mouse.x < this.x+this.width && this.y <= mouse.y && mouse.y < this.y+this.height) {
			return (true);
		} else {
			return (false);
		}
	}
	update() {
		if (this.visible) {
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
		}
		return (false);
	}
	render() {
		if (this.visible) {
			if (this.hover) {
				ctx.fillStyle = "#00f";
			} else {
				ctx.fillStyle = "#000";
			}
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = "#fff";
			ctx.font = "24px Times New Roman";
			ctx.fillText(this.label, this.textOffX+this.x, this.textOffY+this.y+24);
		}
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

function rand(a, b) {
	return(Math.round(Math.random()*(b-a))+a);
}

var img = {};
img.background = new Image();
img.background.src = "background.png";
img.title = new Image();
img.title.src = "risk.png";
img.bonusBack = new Image();
img.bonusBack.src = "bonuses.png";
img.foreground = new Image();
img.foreground.src = "foreground.png";

var continents = [];
var bonusGroups = [];
var bonusValues = [];
var mapName = "Carthya";
function load() {
	if (localStorage.continents !== undefined) {
		continents = JSON.parse(localStorage.continents);
		bonusGroups = JSON.parse(localStorage.bonusGroupsItems);
		bonusValues = JSON.parse(localStorage.bonusValues);
	}
}
load();

var finishTurn;
var endTurn = new Button("End Turn");
endTurn.action = function() {
	finishTurn = true;
};
var fortifyTurn;
var fortify = new Button("Fortify");
fortify.action = function() {
	fortifyTurn = true;
};



function reset() {
	gameHistory = [];
	
	bonusValues;
	for (var i = 0; i < bonusValues.length; i++) {
		bonusValues[i].continents = [];
	}
	for (var i = 0; i < continents.length; i++) {
		bonusValues[continents[i].region].continents.push(i);
	}
	for (var p = 0; p < players.length; p++) {
		players[p].eliminated = false;
		if (players[p].type === "bot") {
			clear();
			variableNames = players[p].variableNames;
			variableValues = players[p].variableValues;
			variableHooks = players[p].variableHooks;
			// mn pns, cns, cr, rn, rv, me
			inps = [];
			inps.push([{type: "id", value: "@SETUPINFO"}]);
			// map name
			inps.push([{type: "str", value: mapName}]);
			// player names
			var val = "";
			for (var i = 0; i < players.length-1; i++) {
				val += players[i].name + ',';
			} val += players[i].name;
			inps.push([{type: "str", value: val}]);
			// continent names
			val = "";
			for (var i = 0; i < continents.length-1; i++) {
				val += continents[i].name + ',';
			} val += continents[i].name;
			inps.push([{type: "str", value: val}]);
			// continent regions
			val = "";
			for (var i = 0; i < continents.length-1; i++) {
				val += continents[i].region + ',';
			} val += continents[i].region;
			inps.push([{type: "str", value: val}]);
			// region names
			val = "";
			for (var i = 0; i < bonusValues.length-1; i++) {
				val += bonusValues[i].name + ',';
			} val += bonusValues[i].name;
			inps.push([{type: "str", value: val}]);
			// region values
			val = "";
			for (var i = 0; i < bonusValues.length-1; i++) {
				val += bonusValues[i].value + ',';
			} val += bonusValues[i].value;
			inps.push([{type: "str", value: val}]);
			// player id
			inps.push([{type: "str", value: p}]);
			
			runkeyw("call", inps, players[p].tokens);
			
			players[p].variableNames = JSON.parse(JSON.stringify(variableNames));
			players[p].variableValues = JSON.parse(JSON.stringify(variableValues));
			players[p].variableHooks = JSON.parse(JSON.stringify(variableHooks));
			clear();
		}
	}
	var ordered = [];
	for (var i = 0; i < continents.length; i++) {
		ordered.push(i);
	}
	var random = [];
	while (ordered.length > 0) {
		var item = rand(0, ordered.length-1);
		random.push(ordered[item]);
		ordered.splice(item, 1);
	}
	for (var i = 0; i < random.length-1; i++) {
		continents[random[i]].owner = i % (players.length-1);
		continents[random[i]].armies = 1;
	}
	continents[random[i]].owner = players.length-1;
	continents[random[i]].armies = 1;
	
	startTurn = rand(1, players.length);
	turn = (startTurn-1);
	stage = 0;
	toPlace = 0;
	
	endTurn.visible = false;
	fortify.visible = false;
	finishTurn = false;
	
	iPAmount = 5;
	iPCounter = -1;
	iPRounds = 2;
	
	oneLess = true;
	
	nextTurn();
	calcPlacing();
	
	gameInProgress = true;
}
var turn;
var startTurn;
var players = [];
function createPlayer(name, colour) {
	players.push({name: name, colour: colour, type: "human"});
}
function importBot(code) {
	clear();
	var tokenz = headerTL.concat(tokenize(code));
	// initialize bot
	evaluateTokens(tokenz);
	var name = getVar("@NAME", variableNames, variableValues).value;
	var colour = getVar("@COLOUR", variableNames, variableValues).value;
	
	players.push({name: name, colour: colour, type: "bot", tokens: tokenz, variableNames: JSON.parse(JSON.stringify(variableNames)), variableValues: JSON.parse(JSON.stringify(variableValues)), variableHooks: JSON.parse(JSON.stringify(variableHooks))});
	
	clear();
}
function callFunction(func, inputs) {
	if (func === "@PLACE") {
		var target = inputs[0];
		if (target >= continents.length || target < 0) {
			return;
		}
		var amount = Math.floor(inputs[1]);
		if (continents[target].owner === turn) {
			if (toPlace >= amount) {
				PlaceAt(target, amount);
				toPlace -= amount;
			} else {
				PlaceAt(target, toPlace);
				toPlace = 0;
			}
		}
	} else if (func === "@ATTACK") {
		var source = inputs[0];
		var target = inputs[1];
		if (continents[source].owner !== turn) {
			return -1;
		}
		if (continents[target].owner === turn) {
			return -1;
		}
		var aAO = inputs[2];
		if (aAO === undefined) {
			aAO = 0;
		}
		if (simulateAttack(source, target, aAO)) {
			// we have just gained land
			toPlace = continents[source].armies-1;
			continents[source].armies = 1;
			attCountry = source;
			defCountry = target;
			
			checkWin();
			
			return 1;
		}
		return 0;
	} else if (func === "@FORTIFY") {
		var source = inputs[0];
		var target = inputs[1];
		var amount = inputs[2];
		if (continents[source].owner !== turn) {
			return -1;
		}
		if (continents[target].owner !== turn) {
			return -1;
		}
		if (amount === undefined) {
			continents[target].armies += continents[source].armies-1;
			continents[source].armies = 1;
		} else if (amount < continents[source].armies) {
			continents[source].armies -= amount;
			continents[target].armies += amount;
		} else {
			continents[target].armies += continents[source].armies-1;
			continents[source].armies = 1;
		}
	} else if (func === "@CONNECTIONS") {
		var target = inputs[0];
		var val = "";
		for (var i = 0; i < continents[target].connections.length-1; i++) {
			val += continents[target].connections[i] + ',';
		} val += continents[target].connections[i];
		return val;
	} else if (func === "@OWNED") {
		var target = inputs[0];
		var list = [];
		for (var i = 0; i < continents.length; i++) {
			if (continents[i].owner === target) {
				list.push(i);
			}
		}
		var val = "";
		for (var i = 0; i < list.length-1; i++) {
			val += list[i] + ',';
		} val += list[i];
		if (list.length === 0) {
			val = "";
		}
		return val;
	} else if (func === "@REGION") {
		var target = inputs[0];
		var list = [];
		for (var i = 0; i < continents.length; i++) {
			if (continents[i].region === target) {
				list.push(i);
			}
		}
		var val = "";
		for (var i = 0; i < list.length-1; i++) {
			val += list[i] + ',';
		} val += list[i];
		return val;
	}
}
//createPlayer("Louis", "#39f");
//createPlayer("Marx", "#922");
//createPlayer("Zoodac", "#e92");
//createPlayer("Lux Luther", "#222");
// IMPORT BOTS
for (var i = 0; i < botList.length; i++) {
	importBot(botList[i]);
}
importBot(localStorage.editor);

createPlayer("Island Master", "#292");

var polygonHover = null;
var polygonSelected = null;
var attCountry = null;
var defCountry = null;
var hoverTimer = 0;

var stage;
var toPlace;

var iPAmount;
var iPRounds;
var iPCounter;

var gameInProgress;
var gameHistory;
var fadeTimer = 0;

reset();

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
	ctx.stroke();
}

function drawNumberBox(number, x, y) {
	if (number > 0) {
		ctx.beginPath();
		ctx.arc(x, y, 5+4*String(number).length, 0, 2*Math.PI);
		ctx.fillStyle = "#fff";
		ctx.fill();
		ctx.fillStyle = "#222";
		ctx.font = "14px Arial";
		ctx.fillText(String(number), x-ctx.measureText(String(number)).width/2, y+5);
	}
}

function renderContinents(conts) {
	var renderAfter = [];
	ctx.lineWidth = 1;
	for (var i = conts.length-1; i >= 0; i--) {
		if (bonusData.selected === continents[i].region) {
			renderAfter.push(i);
		} else {
			renderPolygon(conts[i].polygon, "#000", players[continents[i].owner].colour);
		}
	}
	ctx.lineWidth = 30;
	for (var i = 0; i < renderAfter.length; i++) {
		renderPolygon(conts[renderAfter[i]].polygon, bonusValues[continents[renderAfter[i]].region].colour, bonusValues[continents[renderAfter[i]].region].colour);
	}
	ctx.lineWidth = 1;
	for (var i = 0; i < renderAfter.length; i++) {
		renderPolygon(conts[renderAfter[i]].polygon, "#000", players[continents[renderAfter[i]].owner].colour);
	}
}

function renderArmies(conts) {
	for (var i = conts.length-1; i >= 0; i--) {
		if (oneLess) {
			drawNumberBox(continents[i].armies-1, continents[i].center.x, continents[i].center.y);
		} else {
			drawNumberBox(continents[i].armies, continents[i].center.x, continents[i].center.y);
		}
	}
}

var bonusData = {
	x: 1014,
	y: 126,
	width: 296,
	height: 405,
	dragging: false,
	ox: null,
	oy: null,
	selected: null,
	mouseOn: function () {
		if (this.x <= mouse.x && mouse.x < this.x+this.width && this.y <= mouse.y && mouse.y < this.y+this.height) {
			return (true);
		} else {
			return (false);
		}
	},
	move: function () {
		if (this.dragging) {
			if (mouse.down) {
				this.x = mouse.x - this.ox;
				this.y = mouse.y - this.oy;
				if (this.x < 0) {
					this.x = 0;
				}
				if (this.y < 0) {
					this.y = 0;
				}
				if (this.x > canvas.width-this.width) {
					this.x = canvas.width-this.width;
				}
				if (this.y > canvas.height-this.height) {
					this.y = canvas.height-this.height;
				}
			} else {
				this.dragging = false;
			}
		} else if (this.mouseOn()) {
			if (mouse.down && !mouse.prev) {
				this.dragging = true;
				this.ox = mouse.x - this.x;
				this.oy = mouse.y - this.y;
			}
		}
		if (this.mouseOn()) {
			this.selected = (mouse.y-this.y-28)/27;
			if (this.selected < 0) {
				this.selected = null;
			} else if (this.selected >= bonusGroups.length) {
				this.selected = null;
			} else {
				this.selected = Math.floor(this.selected);
			}
		} else {
			this.selected = null;
		}
		
		if (this.dragging) {
			return true;
		}
	},
	render: function () {
		ctx.lineWidth = 1;
		ctx.drawImage(img.bonusBack, bonusData.x, bonusData.y);
		ctx.fillStyle = "#000";
		ctx.font = "32px Serif";
		ctx.fillText("Bonuses", this.x+90, this.y+45);
		ctx.font = "24px Serif";
		var y = this.y + 50;
		for (var i = 1; i < bonusGroups.length; i++) {
			ctx.strokeStyle = bonusValues[i].colour;
			if (this.selected === i) {
				ctx.strokeText(bonusGroups[i], this.x+16, y+i*27);
				ctx.strokeText(bonusValues[i].value, this.x+266, y+i*27);
			}
			ctx.fillText(bonusGroups[i], this.x+16, y+i*27);
			ctx.fillText(bonusValues[i].value, this.x+266, y+i*27);
		}
	}
};

function plotHistory(mode) {
	ctx.globalAlpha = Math.max(fadeTimer-50, 0)/100;
	// 2 different views
	if (mode === 0) {
		ctx.fillStyle = "#eeec";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var h = canvas.height/2;
		var w = canvas.width-10;
		for (var i = 0; i < gameHistory.length; i++) {
			var total = 0;
			for (var p = 0; p < players.length; p++) {
				total += gameHistory[i][p];
			}
			var oy = (canvas.height-h)/2;
			for (var p = 0; p < players.length; p++) {
				ctx.fillStyle = players[p].colour;
				ctx.fillRect((canvas.width-w)/2 + i/gameHistory.length*w, oy, Math.ceil(w/gameHistory.length), h*(gameHistory[i][p]/total));
				oy += h*(gameHistory[i][p]/total);
			}
		}
	} else {
		ctx.fillStyle = "#eeef";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var max = 0;
		for (var i = 0; i < gameHistory.length; i++) {
			for (var p = 0; p < gameHistory[i].length; p++) {
				if (gameHistory[i][p] > max) {
					max = gameHistory[i][p];
				}
			}
		}
		ctx.lineWidth = 5;
		for (var p = 0; p < players.length; p++) {
			ctx.strokeStyle = players[p].colour;
			ctx.beginPath();
			for (var i = 0; i < gameHistory.length; i++) {
				ctx.lineTo(i/gameHistory.length * canvas.width, canvas.height - canvas.height*gameHistory[i][p]/max);
			}
			ctx.stroke();
		}
	}
	ctx.globalAlpha = 1;
}
function render() {
	ctx.drawImage(img.background, 0, 0);
	ctx.fillStyle = "#fff";
	ctx.fillRect(bonusData.x, bonusData.y, bonusData.width, bonusData.height);
	
	
	ctx.strokeStyle = "#000";
	renderContinents(continents);
	if (gameInProgress) {
		if (polygonSelected !== null) {
			ctx.lineWidth = 1;
			renderPolygon(continents[polygonSelected].polygon, "#ff0", "#ff05");
		}
		if (polygonHover !== null) {
			ctx.lineWidth = 1;
			renderPolygon(continents[polygonHover].polygon, "#ff0", "#ff05");
		}
	}
	
	ctx.drawImage(img.foreground, 0, 0);
	if (gameInProgress) {
		renderArmies(continents);
		if (stage === 2) {
			var c = continents[polygonSelected];
			if (polygonSelected !== null && c.owner === turn && c.armies > 1 && toPlace === 0) {
				ctx.fillStyle = "#f00";
				for (var i = 0; i < c.connections.length; i++) {
					var p = continents[c.connections[i]];
					ctx.beginPath();
					if (p.owner !== turn) {
						ctx.arc(p.center.x + Math.sin(frame/20 + i/2)*10, p.center.y + Math.cos(frame/20 + i/2)*10, 5 + Math.sin(frame/20 + i), 0, 2*Math.PI);
					} else {
						//ctx.arc(p.center.x, p.center.y, 4, 0, 2*Math.PI);
					}
					ctx.fill();
				}
			} else if (toPlace > 0) {
			ctx.fillStyle = "#0f0";
				var p = continents[attCountry];
				ctx.beginPath();
				ctx.arc(p.center.x + Math.sin(frame/20)*15, p.center.y + Math.cos(frame/20)*15, 5 + Math.sin(frame/20), 0, 2*Math.PI);
				ctx.fill();
				var p = continents[defCountry];
				ctx.beginPath();
				ctx.arc(p.center.x + Math.sin(frame/20 + 1.8)*15, p.center.y + Math.cos(frame/20 + 1.8)*15, 5 + Math.sin(frame/20 + 1.8), 0, 2*Math.PI);
				ctx.fill();
			}
		} else if (stage === 3) {
			var c = continents[polygonSelected];
			if (polygonSelected !== null && c.owner === turn && c.armies > 1) {
				ctx.fillStyle = "#0f0";
				for (var i = 0; i < c.connections.length; i++) {
					var p = continents[c.connections[i]];
					ctx.beginPath();
					if (p.owner === turn) {
						ctx.arc(p.center.x + Math.sin(frame/20 + i/2)*10, p.center.y + Math.cos(frame/20 + i/2)*10, 5 + Math.sin(frame/20 + i), 0, 2*Math.PI);
					} else {
						//ctx.arc(p.center.x, p.center.y, 4, 0, 2*Math.PI);
					}
					ctx.fill();
				}
			}
		}
	}
	
	ctx.fillStyle = "#000";
	ctx.fillRect(canvas.width-300, canvas.height-50, 300, 50);
	
	if (toPlace > 0) {
		ctx.fillStyle = "#fff";
		ctx.font = "32px New Times Roman";
		ctx.fillText(toPlace, canvas.width-ctx.measureText(toPlace).width-5, canvas.height-15);
		
		ctx.fillStyle = players[turn].colour
		ctx.fillText(players[turn].name + "'s turn", canvas.width-290, canvas.height-15);
	}
	
	// leaders
	var portionsOwned = [];
	for (var i = 0; i < players.length; i++) {
		portionsOwned.push(0);
	}
	var total = 0;
	for (var i = 0; i < continents.length; i++) {
		portionsOwned[continents[i].owner] += continents[i].armies;
		total += continents[i].armies;
	}
	for (var i = 0; i < players.length; i++) {
		portionsOwned[i] /= total;
	}
	var ox = 0;
	for (var i = 0; i < players.length; i++) {
		var p = (turn+i)%players.length;
		ctx.fillStyle = players[p].colour;
		ctx.fillRect(canvas.width-300+ox, canvas.height-70, Math.ceil(300*portionsOwned[p]), 20);
		ox += 300*portionsOwned[p];
	}
	
	endTurn.render();
	fortify.render();
	bonusData.render();
	
	if (!gameInProgress) {
		ctx.drawImage(img.title, 0, 0);
		plotHistory(Math.floor(fadeTimer/400)%2);
	} else if (polygonHover !== null) {
		if (hoverTimer > 30) {
			ctx.font = "16px monospace";
			ctx.globalAlpha = (hoverTimer-30)/40;
			ctx.fillStyle = "#0005";
			ctx.fillRect(mouse.x+27, mouse.y+5, ctx.measureText(polygonHover+" - "+continents[polygonHover].name).width+10, 22);
			ctx.fillStyle = "#ff9";
			ctx.fillRect(mouse.x+20, mouse.y, ctx.measureText(polygonHover+" - "+continents[polygonHover].name).width+10, 22);
			ctx.fillStyle = "#000";
			ctx.fillText(polygonHover+" - "+continents[polygonHover].name, mouse.x+25, mouse.y+16);
		}
	}
	if (frame < 100) {
		ctx.globalAlpha = Math.max(0, 5-frame/20);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	ctx.globalAlpha = 1;
	if (frame < 80) {
		ctx.globalAlpha = Math.max(0, 1-frame/80);
		ctx.drawImage(img.title, 0, 0);
	}
	ctx.globalAlpha = 1;
}

function update() {
	fadeTimer++;
	if (gameInProgress) {
		fadeTimer = 0;
		if (bonusData.move()) {
			return;
		}
		// position buttons
		endTurn.x = canvas.width-endTurn.width-5;
		endTurn.y = canvas.height-endTurn.height-5;
		if (endTurn.update()) {
			return;
		}
		fortify.x = canvas.width-fortify.width-10-endTurn.width;
		fortify.y = canvas.height-fortify.height-5;
		if (fortify.update()) {
			return;
		}
		var prevPol = polygonHover;
		polygonHover = mouseOnWhich();
		if (polygonHover !== prevPol) {
			hoverTimer = 0;
		} else {
			hoverTimer++;
		}
		if (frame < 100) {
			return;
		}
		if (players[turn].type === "human") { //player
			var clicked = false;
			if (stage === 2) {
				var attacking = null;
			} else if (stage === 3) {
				var fortifying = null;
			}
			if (mouse.down && polygonHover === null) {
				polygonSelected = null;
			} else if (mouse.prev && !mouse.down && polygonHover !== null) {
				if (polygonSelected === null) {
					polygonSelected = polygonHover;
				} else if (stage === 2) {
					var attackList = [];
					var c = continents[polygonSelected].connections;
					for (var i = 0; i < c.length; i++) {
						attackList.push(c[i]);
					}
					if (attackList.includes(polygonHover) && continents[polygonHover].owner !== turn && polygonSelected !== null && continents[polygonSelected].owner === turn) {
						attacking = polygonHover;
					} else {
						polygonSelected = polygonHover;
					}
				} else if (stage === 3) {
					var fortifyList = [];
					var c = continents[polygonSelected].connections;
					for (var i = 0; i < c.length; i++) {
						fortifyList.push(c[i]);
					}
					if (fortifyList.includes(polygonHover) && continents[polygonHover].owner === turn && polygonSelected !== null && continents[polygonSelected].armies > 1) {
						fortifying = polygonHover;
					} else {
						polygonSelected = polygonHover;
					}
				}
				clicked = true;
			}
			if (stage !== 2 && stage !== 3) {
				polygonSelected = null;
			}
			
			if (stage === 0) { //initial placing
				var target = polygonHover;
				if (clicked && target !== null) {
					if (ownerOf(target) === turn) {
						// place armies
						placeArmies(target);
					}
				}
				if (toPlace === 0) {
					polygonSelected = null;
					polygonHover = null;
					nextTurn();
					calcPlacing();
					/*
					if (!endTurn.visible) {
						endTurn.visible = true;
						endTurn.hover = null;
					}
					*/
				}
				if (finishTurn) {
					endTurn.visible = false;
					nextTurn();
					calcPlacing();
					finishTurn = false;
					polygonSelected = null;
					polygonHover = null;
				}
			} else if (stage === 1) { //placing stage
				var target = polygonHover;
				if (clicked && target !== null) {
					if (ownerOf(target) === turn) {
						// place armies
						placeArmies(target);
					}
				}
				if (toPlace === 0) {
					stage++;
				}
			} else if (stage === 2) { //attacking
				if (!endTurn.visible) {
					endTurn.visible = true;
					endTurn.hover = null;
				}
				if (!fortify.visible) {
					fortify.visible = true;
					fortify.hover = null;
				}
				if (toPlace > 0) {
					if (clicked) {
						if (polygonHover === defCountry || polygonHover === attCountry) {
							placeArmies(polygonHover);
						}
					}
				} else if (attacking !== null) {
					if (simulateAttack(polygonSelected, attacking, keysDown.includes("Control"))) {
						// we have just gained land
						toPlace = continents[polygonSelected].armies-1;
						continents[polygonSelected].armies = 1;
						attCountry = polygonSelected;
						defCountry = attacking;
						
						checkWin();
					}
				}
				if (toPlace > 0) {
					endTurn.visible = false;
					fortify.visible = false;
				}
				if (finishTurn && toPlace === 0) {
					polygonSelected = null;
					polygonHover = null;
					endTurn.visible = false;
					fortify.visible = false;
					nextTurn();
					calcPlacing();
					finishTurn = false;
				}
				if (fortifyTurn) {
					if (toPlace === 0) {
						stage = 3;
					}
					fortifyTurn = false;
				}
			} else if (stage === 3) { //fortifying
				if (fortify.visible) {
					fortify.visible = false;
				}
				if (!endTurn.visible) {
					endTurn.visible = true;
					endTurn.hover = null;
				}
				if (toPlace > 0) {
					if (clicked) {
						placeArmies(polygonHover);
					}
				} else if (fortifying !== null) {
					if (keysDown.includes("Shift")) {
						continents[polygonHover].armies += continents[polygonSelected].armies-1;
						continents[polygonSelected].armies = 1;
					} else if (keysDown.includes("Control")) {
						continents[polygonHover].armies += Math.min(5, continents[polygonSelected].armies-1);
						continents[polygonSelected].armies -= Math.min(5, continents[polygonSelected].armies-1);
					} else {
						continents[polygonHover].armies++;
						continents[polygonSelected].armies--;
					}
				}
				if (toPlace > 0) {
					endTurn.visible = false;
				}
				if (finishTurn && toPlace === 0) {
					polygonSelected = null;
					polygonHover = null;
					endTurn.visible = false;
					fortify.visible = false;
					nextTurn();
					calcPlacing();
					finishTurn = false;
				}
			}
		} else { //bot memory in form of variables
			clear();
			variableNames = players[turn].variableNames;
			variableValues = players[turn].variableValues;
			variableHooks = players[turn].variableHooks;
			
			var ownerz = "";
			var armiez = "";
			for (var i = 0; i < continents.length-1; i++) {
				ownerz += continents[i].owner + ",";
				armiez += continents[i].armies + ",";
			}
			ownerz += continents[i].owner;
			armiez += continents[i].armies;
			
			//initial placing
			if (stage === 0) {
				runkeyw("call", [[{type: "id", value: "@INITIAL"}], [{type:"str", value:ownerz}], [{type:"str", value:armiez}], [{type:"num", value:toPlace}]], players[turn].tokens);
				finishTurn = true;
			}
			
			//placing stage
			if (stage === 1) {
				runkeyw("call", [[{type: "id", value: "@PLACING"}], [{type:"str", value:ownerz}], [{type:"str", value:armiez}], [{type:"num", value:toPlace}]], players[turn].tokens);
				if (toPlace === 0) {
					stage = 2;
				}
			}
			
			//attacking
			if (stage === 2) {
				runkeyw("call", [[{type: "id", value: "@ATTACKING"}], [{type:"str", value:ownerz}], [{type:"str", value:armiez}]], players[turn].tokens);
				if (toPlace === 0) {
					stage = 3;
				}
			}
			
			//fortifying
			if (stage === 3) {
				runkeyw("call", [[{type: "id", value: "@FORTIFYING"}], [{type:"str", value:ownerz}], [{type:"str", value:armiez}]], players[turn].tokens);
				finishTurn = true;
			}
			
			players[turn].variableNames = JSON.parse(JSON.stringify(variableNames));
			players[turn].variableValues = JSON.parse(JSON.stringify(variableValues));
			players[turn].variableHooks = JSON.parse(JSON.stringify(variableHooks));
			clear();
			
			if (finishTurn) {
				if (toPlace === 0) {
					nextTurn();
					calcPlacing();
				}
				finishTurn = false;
			}
		}
	}
}
function simulateAttack(from, to, allAtOnce) {
	while (continents[from].armies > 1 && continents[to].armies !== 0) {
		var att = continents[from].armies-1;
		var def = continents[to].armies;
		var attDiceCount = Math.min(3, att);
		var defDiceCount = Math.min(2, def);
		var attDice = [];
		for (var i = 0; i < attDiceCount; i++) {
			attDice.push(rand(1, 6));
		}
		var defDice = [];
		for (var i = 0; i < defDiceCount; i++) {
			defDice.push(rand(1, 6));
		}
		attDice.sort();
		defDice.sort();
		var wins = 0;
		var losses = 0;
		for (var i = 0; i < Math.min(attDiceCount, defDiceCount); i++) {
			if (attDice[attDiceCount-i-1] > defDice[defDiceCount-i-1]) {
				wins++;
			} else {
				losses++;
			}
		}
		continents[from].armies -= losses;
		continents[to].armies -= wins;
		if (!allAtOnce) {
			break;
		}
	}
	if (continents[to].armies === 0) {
		var testingPlayer = continents[to].owner;
		continents[to].owner = turn;
		continents[to].armies = attDiceCount;
		continents[from].armies -= attDiceCount;
		checkElimination(testingPlayer);
		return true;
	}
	return false;
}
function checkElimination(player) {
	players[player].eliminated = true;
	for (var i = 0; i < continents.length; i++) {
		if (continents[i].owner === player) {
			players[player].eliminated = false;
			return;
		}
	}
}
function checkWin() {
	var prev = null;
	for (var i = 0; i < continents.length; i++) {
		if (prev !== null) {
			if (prev !== continents[i].owner) {
				gameInProgress = true;
				return;
			}
		}
		prev = continents[i].owner;
	}
	recordHistory();
	gameInProgress = false;
}
function calcPlacing() {
	if (stage === 0) {
		toPlace = iPAmount;
	} else {
		var owned = 0;
		var bonusOwned = [];
		for (var i = 0; i < bonusValues.length; i++) {
			bonusOwned.push([]);
		}
		for (var i = 0; i < continents.length; i++) {
			if (turn === continents[i].owner) {
				owned++;
				bonusOwned[continents[i].region].push(i);
			}
		}
		var bonusWorth = 0;
		for (var i = 0; i < bonusOwned.length; i++) {
			if (bonusOwned[i].length === bonusValues[i].continents.length) {
				bonusWorth += bonusValues[i].value;
			}
		}
		toPlace = Math.max(3, Math.floor(owned/3)) + bonusWorth;
	}
}
function nextTurn() {
	recordHistory();
	// Next turn stuff
	polygonSelected = null;
	turn = (turn+1)%players.length;
	while (players[turn].eliminated) {
		turn = (turn+1)%players.length;
	}
	if (stage === 0) {
		if (turn === startTurn%players.length) {
			iPCounter++;
			if (iPCounter >= iPRounds) {
				stage++;
			}
		}
	} else {
		stage = 1;
	}
}
function recordHistory() {
	// Record History
	var portionsOwned = [];
	for (var i = 0; i < players.length; i++) {
		portionsOwned.push(0);
	}
	var total = 0;
	for (var i = 0; i < continents.length; i++) {
		portionsOwned[continents[i].owner] += continents[i].armies;
		total += continents[i].armies;
	}
	gameHistory.push(portionsOwned);
}
function placeArmies(target) {
	if (toPlace > 0) {
		if (keysDown.includes("Shift")) {
			PlaceAt(target, toPlace);
			toPlace = 0;
		} else if (keysDown.includes("Control")) {
			PlaceAt(target, Math.min(toPlace, 5));
			toPlace -= Math.min(toPlace, 5);
		} else {
			PlaceAt(target, 1);
			toPlace--;
		}
	}
}
function PlaceAt(country, amount) {
	continents[country].armies += amount;
}
function ownerOf(country) {
	return continents[country].owner;
}
function mouseOnWhich() {
	for (var i = 0; i < continents.length; i++) {
		var p = continents[i].polygon;
		if (inPolygon(mouse.x, mouse.y, p)) {
			return i;
		}
	}
	return null;
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

var frame = 0;
function loop() {
	document.body.style.cursor = "default";
	frame++;
	update();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	render();
	mouse.prev = mouse.down;
}

setInterval(loop, 20);










