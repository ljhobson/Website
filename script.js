// Louis Hobson
console.log("You have successfully landed on my website!");

// General Setup
const FLAKE_SIZE = 200;
const FLAKE_SPIN = 20; 	// lower numbers faster
const FLAKE_SPEED = 40; // lower numbers faster
const TRAIL_LENGTH = 100;


function rand(a, b) { // only deals with ints
	return a + (b-a) * Math.random();
}
// Setup the canvas overlay
var mouse = {
	x: undefined,
	y: undefined,
};
var mouseTrail = [];
document.onmousemove = function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}
document.onmousedown = function(event) {
	nyanCats.push({
		x: -150,
		y: mouse.y
	});
}
var nyanCats = [];
// OVERLAY CANVAS
var overlay = document.getElementById("overlay");
var ctx = overlay.getContext("2d");
ctx.imageSmoothingEnabled = false;

// UNDERLAY CANVAS
var underlay = document.getElementById("underlay");
var bgx = underlay.getContext("2d");
bgx.imageSmoothingEnabled = false;

// Load Images
var snowflakeImage = new Image();
snowflakeImage.src = "img/snowflake.png";
var trailEffect = new Image();
trailEffect.src = "img/trail.png";
var nyanCat = new Image();
nyanCat.src = "img/nyancat.gif";

class Flake {
	constructor() {
		this.size = rand(15, 50)*2;
		this.x = rand(0, overlay.width);
		this.y = -this.size;
	}
}
var flakes = [];
function updateOverlay() {
	overlay.width = window.innerWidth;
	overlay.height = window.innerHeight;
	underlay.width = window.innerWidth;
	underlay.height = window.innerHeight;
	
	// Create Snowflakes
	if (frame % 20 === 1) {
		flakes.push(new Flake());
	}
	// Draw and update Snowflakes
	for (var i = 0; i < flakes.length; i++) {
		var f = flakes[i]
		f.y += Number(f.size/FLAKE_SPEED);
		if (f.y > window.innerHeight) {
			flakes.splice(i, 1);
			i--;
			continue;
		}
		var perc = Math.sin((frame+f.size)/FLAKE_SPIN);
		if (f.size > 50) {
			ctx.drawImage(snowflakeImage, 0, 0, 200, 200, f.x-f.size/2*perc, f.y - window.scrollY*f.size/200, f.size*perc, f.size);
		} else {
			bgx.drawImage(snowflakeImage, 0, 0, 200, 200, f.x-f.size/2*perc, f.y - window.scrollY*f.size/200, f.size*perc, f.size);
		}
	}
	
	// Draw and update Mouse Trail
	mouseTrail.push({...mouse, life: 0});
	if (mouseTrail.length >= TRAIL_LENGTH) {
		mouseTrail.shift();
	}
	for (var i = 0; i < mouseTrail.length; i++) {
		mouseTrail[i].life += 0.01;
		mouseTrail[i].y += mouseTrail[i].life;
		ctx.globalAlpha = 1-mouseTrail[i].life;
		ctx.drawImage(trailEffect, mouseTrail[i].x, Math.floor(mouseTrail[i].y));
		ctx.globalAlpha = 1;
	}
	
	// Draw Nyan Cat
	for (var i = 0; i < nyanCats.length; i++) {
		var cat = nyanCats[i];
		cat.x += 3;
		if (cat.x > window.innerWidth) {
			nyanCats.splice(i, 1);
			i--;
			continue;
		}
		bgx.drawImage(nyanCat, 300*(Math.floor(frame/5) % 5), 0, 300, 138, cat.x, cat.y-34, 150, 69);
	}
}

var frame = 0;
function update() { frame++;
	// update loop which keeps the lights flashing
	updateOverlay();
	
	// update headers
	var rainbows = document.getElementsByClassName("rainbow");
	for (var i = 0; i < rainbows.length; i++) {
		var e = rainbows[i];
		e.innerHTML = rainbowText(rainbowHeaders[i]);
	}
}

function rainbowText(text) {
	var output = "";
	for (var i = 0; i < text.length; i++) {
		var hue = String((i*Math.floor(360/text.length) - frame) % 360);
		var offset = Math.min(5, Math.abs((frame-i)%80-40))-5;
		output += `<a style="color:hsl(${hue},100%,50%);position:relative;top:${offset}px">${text[i]}</a>`;
	}
	return output;
}

var rainbowHeaders = [];
function getHeaders() {
	var headers = document.getElementsByClassName("rainbow");
	for (var i = 0; i < headers.length; i++) {
		rainbowHeaders.push(headers[i].innerHTML);
	}
}

function setColors() {
	var paragraphs = document.getElementsByTagName("p");
	var cols = ["#ff0","#0ff","#0f0"];
	var shad = ["#f00","#00f","#00f","#f0f"];
	for (var i = 0; i < paragraphs.length; i++) {
		paragraphs[i].style.color = cols[i%cols.length];
		paragraphs[i].style.textShadow = "2px 2px " + shad[i%shad.length];
	}
}

getHeaders();
setColors();
setInterval(update, 40);







