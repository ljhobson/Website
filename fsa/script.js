var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var input = document.getElementById("inp");
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight-30;
} resize();

var keysDown = [];
document.body.onkeydown = function (event) { if (!keysDown.includes(event.key) ) { keysDown.push(event.key); } }
document.body.onkeyup = function (event) { keysDown.splice(keysDown.indexOf(event.key),1); }

var mouseX;
var mouseY;

document.onmousemove = function(event) {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
}

var clickTimer = 90;
var doubleClick = null;
var mouseDown = false;
var prevMouse = false;
document.onmousedown = function(event) {
	doubleClick = clickTimer;
	clickTimer = 0;
	if (event.which === 1) {
		mouseDown = true;
	}
}
document.onmouseup = function(event) {
	if (event.which === 1) {
		mouseDown = false;
	}
}

function distance(x1, y1, x2, y2) {
	return(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)));
}

setInterval(update, 20);

var initialState = 0;
var states = [{x: 100, y:100, S: "I"}];
var transitions = [[]];
var acceptingStates = [0];

function createState(x, y, S, A) {
	states.push({x: x, y:y, S: S});
	transitions.push([]);
}

function addTransition(i, t, o) {
	transitions[i].push({t: t, o: o});
	testInput();
}

function save() {
	localStorage.initialState = JSON.stringify(initialState);
	localStorage.states = JSON.stringify(states);
	localStorage.transitions = JSON.stringify(transitions);
	localStorage.acceptingStates = JSON.stringify(acceptingStates);
}

function load() {
	initialState = JSON.parse(localStorage.initialState);
	states = JSON.parse(localStorage.states);
	transitions = JSON.parse(localStorage.transitions);
	acceptingStates = JSON.parse(localStorage.acceptingStates);
	testInput();
}
//load();

function matches(character, template) {
	var word = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var digit = "0123456789";
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lower = "abcdefghijklmnopqrstuvwxyz";
	if (template === 'w') {
		return word.includes(character);
	}
	if (template === 'W') {
		return !word.includes(character);
	}
	if (template === 'd') {
		return digit.includes(character);
	}
	if (template === 'D') {
		return !digit.includes(character);
	}
	if (template === 'u') {
		return upper.includes(character);
	}
	if (template === 'U') {
		return !upper.includes(character);
	}
	if (template === 'l') {
		return lower.includes(character);
	}
	if (template === 'L') {
		return !lower.includes(character);
	}
	return character === template;
}

function testValid(string) {
	var state = initialState;
	var history = [];
	var historyJ = [];
	var connJ = 0;
	for (var i = 0; i < string.length; i++) {
		// Loop through all the connections
		var valid = false;
		for (var j = connJ; j < transitions[state].length; j++) {
			// If there is a valid transition
			if (matches(string[i], transitions[state][j].o)) {
				valid = true;
				connJ = j;
				break;
			}
		}
		if (valid) {
			// then first record the current state and connection,
			history.push(state);
			historyJ.push(connJ);
			// then move to the new one
			state = transitions[state][connJ].t
			connJ = 0;
			// is it the end?
			if (i === string.length-1) {
				// is it on an accepting state?
				if (acceptingStates.includes(state)) {
					return true;
				} else {
					// GO BACK CODE
					// (is there a state to go back to?)
					if (history.length > 0) {
						// Else we want to go back to the previous state
						i = history.length - 2;
						state = history[history.length-1];
						connJ = historyJ[historyJ.length-1] + 1;
						// and pop from the 2 history arrays
						history.pop();
						historyJ.pop();
					} else {
						// there is no possible path
						return false;
					}
				}
			}
		} else {
			// GO BACK CODE
			// (is there a state to go back to?)
			if (history.length > 0) {
				// Else we want to go back to the previous state
				i = history.length - 2;
				state = history[history.length-1];
				connJ = historyJ[historyJ.length-1] + 1;
				// and pop from the 2 history arrays
				history.pop();
				historyJ.pop();
			} else {
				// there is no possible path
				return false;
			}
		}
	}
	// is it right straight away?
	if (string.length === 0) {
		// is it on an accepting state?
		if (acceptingStates.includes(state)) {
			return true;
		}
	}
}

function testInput() {
	if (testValid(input.value)) {
		input.style.color = "#0f0";
		input.style.borderColor = "#0f0";
		input.style.outlineColor = "#0f0";
	} else {
		input.style.color = "#f00";
		input.style.borderColor = "#f00";
		input.style.outlineColor = "#f00";
	}
}
input.oninput = function() {
	testInput();
}

var selected = null;
var dragging = null;
var dragTime = 0;
function update() { clickTimer++;
	resize();
	// Move
	if (mouseDown) {
		if (!prevMouse && (doubleClick < 20)) { // Double Click
			clickTimer = 90;
			var touching = null;
			for (var i = 0; i < states.length; i++) {
				if (distance(mouseX, mouseY, states[i].x, states[i].y) < 30) {
					touching = i;
					break;
				}
			}
			if (touching === null) { // Create New State
				createState(mouseX, mouseY, "S"+states.length, false);
				dragging = states.length-1;
			} else {
				if (keysDown.length === 0) { // Change Accepting State
					if (acceptingStates.includes(touching)) {
						acceptingStates.splice(acceptingStates.indexOf(touching), 1);
					} else {
						acceptingStates.push(touching);
					}
					testInput();
				} else { // Add Transition
					addTransition(selected, touching, keysDown[keysDown.length-1]);
				}
			}
		} else {
			if (dragging !== null) {
				states[dragging].x = mouseX;
				states[dragging].y = mouseY;
				dragTime++;
				if (dragTime > 20) {
					selected = dragging;
				}
			} else if (!prevMouse) {
				for (var i = 0; i < states.length; i++) {
					if (distance(mouseX, mouseY, states[i].x, states[i].y) < 30) {
						dragging = i;
						break;
					}
				}
			}
		}
	} else {
		dragging = null;
		dragTime = 0;
	}
	
	// Render
	for (var i = 0; i < states.length; i++) {
		if (selected === i) {
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#5af";
			ctx.fillStyle = "#5af";
		} else {
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#17e";
			ctx.fillStyle = "#17e";
		}
		drawState(states[i].x, states[i].y, states[i].S, acceptingStates.includes(i));
		// Transitions
		for (var j = 0; j < transitions[i].length; j++) {
			var t = transitions[i][j].t;
			var label = transitions[i].o;
			var d = (t>i);
			var dir = 50*(1-2*(t>i));
			ctx.beginPath();
			ctx.moveTo(states[i].x, states[i].y-dir);
			ctx.quadraticCurveTo((states[i].x+states[t].x)/2, (states[i].y+states[t].y)/2-2*dir, states[t].x, states[t].y-dir);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(states[t].x, states[t].y-dir, 10, (0.5+d)*Math.PI, (1.5-d)*Math.PI);
			ctx.fill();
			
			ctx.fillText(transitions[i][j].o, (states[i].x+states[t].x)/2, (states[i].y+states[t].y)/2-2*dir+10);
		}
	}
	
	// Key Down
	ctx.font = "32px Monospace";
	ctx.fillStyle = "#000";
	if (keysDown.length > 0) {
		ctx.fillText(keysDown[keysDown.length-1], canvas.width-ctx.measureText(keysDown[keysDown.length-1]).width, canvas.height-2)
	}
	prevMouse = mouseDown;
}

function drawState(x, y, S, A) {
	ctx.beginPath();
	ctx.arc(x, y, 30, 0, 2*Math.PI);
	ctx.stroke();
	if (A) {
		ctx.beginPath();
		ctx.arc(x, y, 38, 0, 2*Math.PI);
		ctx.stroke();
	}
	
	ctx.font = "32px Monospace";
	ctx.fillText(S, x-ctx.measureText(S).width/2, y+10)
}








