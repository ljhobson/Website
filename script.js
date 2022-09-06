console.log("You have successfully landed on my website");

var canvas = document.getElementById("overlay");

function updateOverlay() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
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

getHeaders();
setInterval(update, 40);







