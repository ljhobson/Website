var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

function fitCanvas() {
	canvas.width = Math.min(window.innerWidth-50, 500);
	canvas.height = Math.min(window.innerHeight-50, 500);
}

function drawShirt(shirt, x, y, preview) {
	if (shirt.length == 0) {
		return;
	}
	if (preview === undefined) {
		preview = 0;
	}
	
	if (preview) { // draw back
		var topValue = 999999;
		var topMost = null;
		for (var i = 0; i < shirt.length; i++) {
			if (shirt[i][1] < topValue) {
				topValue = shirt[i][1];
				topMost = i;
			}
		}
		ctx.beginPath();
		ctx.moveTo(x + shirt[topMost][0], y + shirt[topMost][1]);
		ctx.quadraticCurveTo(x, y + shirt[topMost][1] + 15, x - shirt[topMost][0], y + shirt[topMost][1]);
		
		for (var i = topMost-1; i >= 0; i--) {
			ctx.lineTo(x - shirt[i][0], y + shirt[i][1]);
		}
		for (var i = 0; i < topMost; i++) {
			ctx.lineTo(x + shirt[i][0], y + shirt[i][1]);
		}
		
		var grd = ctx.createLinearGradient(x, y-70, x, y-30);
		grd.addColorStop(0, "#b09990");
		grd.addColorStop(1, "#a09089");

		ctx.fillStyle = grd;
		
		ctx.fill();
		ctx.stroke();
		
	} else {
		ctx.fillStyle = "#bbb";
		for (var i = 0; i < shirt.length; i++) {
			ctx.beginPath();
			ctx.arc(x + shirt[i][0], y + shirt[i][1], 5, 0, 2*Math.PI);
			ctx.fill();
		}
	}
	
	ctx.beginPath();
	for (var i = 0; i < shirt.length - Number(preview); i++) {
		ctx.lineTo(x + shirt[i][0], y + shirt[i][1]);
	}
	if (preview) {
		ctx.quadraticCurveTo(x + shirt[i-1][0], y + shirt[i][1], x + shirt[i][0], y + shirt[i][1]);
	}
	if (preview) {
		ctx.quadraticCurveTo(x - shirt[shirt.length-2][0], y + shirt[shirt.length-1][1], x - shirt[shirt.length-2][0], y + shirt[shirt.length-2][1]);
	}
	for (var i = shirt.length-2 - Number(preview); i >= 0; i--) {
		ctx.lineTo(x - shirt[i][0], y + shirt[i][1]);
	}
	if (preview) {
		var grd = ctx.createLinearGradient(x-50, y, x+50, y);
		grd.addColorStop(0, "#dcb");
		grd.addColorStop(0.25, "#ddb");
		grd.addColorStop(0.5, "#dcb");
		grd.addColorStop(0.75, "#ddb");
		grd.addColorStop(1, "#dcb");

		ctx.fillStyle = grd;
		ctx.fill();
	}
	ctx.stroke();
}

function render(preview) {
	fitCanvas();
	
	drawShirt(shirt, canvas.width/2, canvas.height/2, preview);
}


var shirt = [];
shirt.push([0, -40]);
shirt.push([20, -50]);
shirt.push([50, -20]);
shirt.push([40, -10]);
shirt.push([30, -20]);
shirt.push([30, 50]);
shirt.push([0, 50]);

render();

var pointSelected = null;
function updateEvents() {
	if (!mouseDown) {
		pointSelected = null;
	} else if (!prevMouse) {
		pointSelected = null;
		for (var i = 0; i < shirt.length; i++) {
			if (distance(shirt[i][0], shirt[i][1], mouseX, mouseY) < 25) {
				pointSelected = i;
			}
		}
		//console.log(pointSelected);
	} else if (pointSelected !== null) {
		shirt[pointSelected][0] = mouseX;
		shirt[pointSelected][1] = mouseY;
		if (pointSelected % (shirt.length-1) === 0) {
			shirt[pointSelected][0] = 0;
		}
	}
	
	render();
	prevMouse = mouseDown;
}


var mouseDown = false;
var prevMouse = false;
var mouseX = 0;
var mouseY = 0;
document.onmousemove = function(event) {
	mouseX = event.clientX - canvas.width/2;
	mouseY = event.clientY - canvas.height/2;
	
	updateEvents();
}

document.onmousedown = function(event) {
	mouseDown = true;
	updateEvents();
}

document.onmouseup = function(event) {
	mouseDown = false;
	updateEvents();
}

function distance(x1, y1, x2, y2) {
	dx = x2-x1;
	dy = y2-y1;
	return dx*dx + dy*dy;
}

document.onkeydown = function(event) {
	if (event.key === " ") {
		shirt.splice(1, 0, [0, 0]);
	}
	if (event.key === "d") {
		render(true);
	}
	if (event.key === "s") {
		save();
	}
	if (event.key === "e") {
		createExport();
	}
}





function save() {
	localStorage.shirt = JSON.stringify(shirt);
}

function load() {
	if (localStorage.shirt === undefined) {
		localStorage.shirt = "[[0,-15],[5,-38],[10,-36],[15,-42],[20,-57],[37,-50],[54,-39],[45,-13],[32,-21],[30,15],[30,35],[30,37],[0,45]]";
	}
	shirt = JSON.parse(localStorage.shirt);
}

load();


var logoImage = new Image();
logoImage.src = "icon.png";

function createExport() {
	var pdf = new jsPDF();
	var pageHeight = pdf.internal.pageSize.height;
	var pageWidth = pdf.internal.pageSize.width;
	var margin = 10;
	var pageNumber = 0;
	function drawHeader() {
		pageNumber++;
		pdf.setTextColor(0,0,0);
		pdf.text(margin, margin, "Tech Pack (" + pageNumber + ")");
		pdf.setTextColor(255,0,0);
		pdf.text(pageWidth-margin - pdf.getTextWidth("Confidential Property of Louis Hobson"), margin, "Confidential Property of Louis Hobson");
		pdf.line(margin, margin+2, pageWidth-margin, margin+2);
		pdf.setTextColor(0,0,0);
	}
	//pdf.addImage(logoImage, 'JPEG', 0, 0);
	
	pdf.setFont('Times New Roman');
	pdf.setFontSize('8');
	
	drawHeader();
	
	pdf.setFont('Times New Roman');
	pdf.setFontSize('8');
	
	// do stuff
	pdf.addPage();
	
	drawHeader();
	
	pdf.save("epicshirtmaker_test.pdf");
}








