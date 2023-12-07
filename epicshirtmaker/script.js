var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

function fitCanvas() {
	canvas.width = Math.min(window.innerWidth-50, 500);
	canvas.height = Math.min(window.innerHeight-50, 500);
}

function drawShirt(shirt, x, y, preview, colScale) {
	var neckWidth = 10;
	if (shirt.length == 0) {
		return;
	}
	if (preview === undefined) {
		preview = 0;
	}
	if (colScale === undefined) {
		colScale = 1;
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
		
		var grd = ctx.createLinearGradient(x, y-70*colScale, x, y-30*colScale);
		grd.addColorStop(0, "#b09990");
		grd.addColorStop(1, "#a09089");

		ctx.fillStyle = grd;
		
		ctx.fill();
		ctx.stroke();
		
		// draw the back collar
		ctx.beginPath();
		ctx.moveTo(x + shirt[topMost][0], y + shirt[topMost][1]+neckWidth);
		ctx.quadraticCurveTo(x, y + shirt[topMost][1] + neckWidth + 15, x - shirt[topMost][0], y + shirt[topMost][1] + neckWidth);
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
		var grd = ctx.createLinearGradient(x-50*colScale, y, x+50*colScale, y);
		grd.addColorStop(0, "#dcb");
		grd.addColorStop(0.25, "#ddb");
		grd.addColorStop(0.5, "#dcb");
		grd.addColorStop(0.75, "#ddb");
		grd.addColorStop(1, "#dcb");

		ctx.fillStyle = grd;
		ctx.fill();
	}
	ctx.stroke();
	
	if (preview) { // extra detail
		ctx.beginPath();
		ctx.lineWidth = 1;
		for (var i = topMost; i > 0; i--) {
			var vec1 = addVecs(1, shirt[i], -1, shirt[i-1]);
			var vec2 = addVecs(1, shirt[i], -1, shirt[i+1]);
			
			var offset1 = [-vec1[1], vec1[0]];
			var offset2 = [vec2[1], -vec2[0]];
			
			offset1 = addVecs(neckWidth/vecSize(offset1), offset1, 0, [0, 0]);
			offset2 = addVecs(neckWidth/vecSize(offset2), offset2, 0, [0, 0]);
			
			vec1 = addVecs(neckWidth/vecSize(vec1), vec1, 0, [0, 0]);
			vec2 = addVecs(neckWidth/vecSize(vec2), vec2, 0, [0, 0]);
			
			var t = (offset2[0] - offset1[0]) / (vec1[0] - vec2[0]);
			if (i === topMost) {
				t = (offset2[0]) / (vec1[0] - vec2[0]);
			}
			var newPoint = addVecs(1, offset1, t, vec1);
			
			ctx.lineTo(x - shirt[i][0] - newPoint[0], y + shirt[i][1] + newPoint[1]);
		}
		// flat v neck end
		ctx.lineTo(x - shirt[0][0] - neckWidth/2, y + shirt[0][1] + neckWidth);
		ctx.lineTo(x - shirt[0][0] + neckWidth/2, y + shirt[0][1] + neckWidth);
		
		for (var i = 1; i <= topMost; i++) {
			var vec1 = addVecs(1, shirt[i], -1, shirt[i-1]);
			var vec2 = addVecs(1, shirt[i], -1, shirt[i+1]);
			
			var offset1 = [-vec1[1], vec1[0]];
			var offset2 = [vec2[1], -vec2[0]];
			
			offset1 = addVecs(neckWidth/vecSize(offset1), offset1, 0, [0, 0]);
			offset2 = addVecs(neckWidth/vecSize(offset2), offset2, 0, [0, 0]);
			
			vec1 = addVecs(neckWidth/vecSize(vec1), vec1, 0, [0, 0]);
			vec2 = addVecs(neckWidth/vecSize(vec2), vec2, 0, [0, 0]);
			
			var t = (offset2[0] - offset1[0]) / (vec1[0] - vec2[0]);
			var t = (offset2[0] - offset1[0]) / (vec1[0] - vec2[0]);
			if (i === topMost) {
				t = (offset2[0]) / (vec1[0] - vec2[0]);
			}
			var newPoint = addVecs(1, offset1, t, vec1);
			
			if (i === topMost) {
				ctx.fillStyle = "#0a0";
				//ctx.fillRect(x + shirt[i][0] + offset1[0], y + shirt[i][1] + offset1[1], 3, 3);
				//ctx.fillRect(x + shirt[i][0] + offset2[0], y + shirt[i][1] + offset2[1], 3, 3);
				
				ctx.fillStyle = "#f00";
				//ctx.fillRect(x + shirt[i][0] + newPoint[0] - 2, y + shirt[i][1] + newPoint[1] - 2, 3, 3);
			}
			
			ctx.lineTo(x + shirt[i][0] + newPoint[0], y + shirt[i][1] + newPoint[1]);
		}
		ctx.stroke();
	}
}

function render(preview) {
	fitCanvas();
	var scale = 1 + 1*Number(preview === true);
	
	var previewShirt = [];
	for (var i = 0; i < shirt.length; i++) {
		previewShirt.push([1 * shirt[i][0], 1 * shirt[i][1]]);
	}
	
	drawShirt(previewShirt, canvas.width/2, canvas.height/2, preview, scale);
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

function addVecs(sa, a, sb, b) {
	return [sa*a[0] + sb*b[0], sa*a[1] + sb*b[1]];
}

function dotProd(a, b) {
	return a[0]*b[0] + a[1]*b[1];
}

function determ(a, b) {
	return a[0]*b[1] - a[1]*b[0];
}

function vecSize(vec) {
	return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
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
		localStorage.shirt = "[[0,-30],[10,-76],[20,-72],[30,-84],[40,-114],[74,-100],[108,-78],[90,-26],[64,-42],[60,30],[60,70],[60,74],[0,90]]";
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
	function drawTable(x, y, r, c, content, width, gapH, alignC, alignR) {
		if (width === undefined) {
			width = pageWidth-2*x;
		}
		if (gapH === undefined) {
			gapH = gapH = 8;
		}
		if (alignC === undefined) {
			alignC = false;
		}
		if (alignR === undefined) {
			alignR = false;
		}
		// fill table
		for (var i = 0; i < r; i++) {
			if (i % 2 === 0) {
				pdf.setFillColor("#eec");
			} else {
				pdf.setFillColor("#e0e0e0");
			}
			pdf.rect(x, y + i*gapH, width, gapH, 'F')
		}
		// end fill
		for (var i = 0; i < r+1; i++) {
			pdf.line(x, y + i*gapH, x+width, y + i*gapH);
		}
		
		var widthsList = [];
		var totalWidth = 0;
		for (var i = 0; i < content.length; i++) {
			var column = content[i];
			var maxWidth = 0;
			for (var j = 0; j < column.length; j++) {
				var text = String(column[j]);
				maxWidth = Math.max(maxWidth, pdf.getTextWidth(text));
			}
			totalWidth += maxWidth;
			widthsList.push(maxWidth);
		}
		var textGap = 0.5 * (width - totalWidth) / c;
		
		var height = r*gapH;
		var gapOffset = 0;
		for (var i = 0; i < c+1; i++) {
			var gapW = width / c;
			pdf.line(x + gapOffset, y, x + gapOffset, y + height);
			gapOffset += widthsList[i] + 2*textGap;
		}
		
		gapOffset = 1;
		for (var i = 0; i < content.length; i++) {
			var column = content[i];
			if (i === 0 && alignC) {
				pdf.setFontType("bold");
				for (var j = 0; j < column.length; j++) {
					var text = String(column[j]);
					pdf.text(x + gapOffset + (widthsList[i] + textGap*2 - pdf.getTextWidth(text)) - 2, y + j*gapH + 0.5*(gapH + pdf.getTextDimensions(text).h), text);
				}
				pdf.setFontType("normal");
			} else {
				for (var j = 0; j < column.length; j++) {
					var text = String(column[j]);
					if (j === 0 && alignR) {
						pdf.setFontType("bold");
						pdf.text(x + gapOffset + (widthsList[i] + textGap*2 - pdf.getTextWidth(text))/2 - 1, y + j*gapH + 0.5*(gapH + pdf.getTextDimensions(text).h), text);
						pdf.setFontType("normal");
					} else {
						pdf.text(x + gapOffset, y + j*gapH + 0.5*(gapH + pdf.getTextDimensions(text).h), text);
					}
				}
			}
			gapOffset += widthsList[i] + textGap*2;
		}
	}
	//pdf.addImage(logoImage, 'JPEG', 0, 0);
	
	pdf.setFont('Times New Roman');
	pdf.setFontSize('8');
	
	drawHeader();
	
	pdf.setFont('Times New Roman');
	pdf.setFontSize('8');
	
	var labels = ["Item", "Fabric", "Composition", "Weight", "Washing", "Fit / Length"];
	/* capatilize them
	for (var i = 0; i < labels.length; i++) {
		labels[i] = labels[i].toUpperCase();
	}
	*/
	var labels2 = ["Cool Shirt", "Cotton Canvas", "100% Cotton", "270 GSM", "Garmet Wash", "One Size Fits All"];
	
	render(true);
	drawTable(pageWidth-100-margin, margin + 18, labels.length, 2, [labels, labels2], 100, 6, true, false);
	
	
	pdf.addImage(canvas.toDataURL("image/png"), 'PNG', 0, 0, 100, 100);
	
	// new page
	pdf.addPage();
	
	drawHeader();
	
	pdf.save("epicshirtmaker_test.pdf");
}








