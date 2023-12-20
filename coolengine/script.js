

function fitScreen() {
	var header = document.getElementById("header");
	var canvas = document.getElementById("canvas");
	var code = document.getElementById("code");
	var highlight = document.getElementById("highlight");
	
	var headerHeight = 50;
	var halfway = Math.floor(window.innerWidth/2);
	
	header.style.height = headerHeight + "px";
	header.style.lineHeight = headerHeight + "px";
	
	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = headerHeight + "px";
	
	canvas.width = halfway;
	canvas.height = Math.floor((window.innerWidth/2) * window.innerHeight / window.innerWidth);
	
	code.style.position = "fixed";
	code.style.left = halfway + "px";
	code.style.top = headerHeight + "px";
	
	code.style.width = window.innerWidth - halfway + "px";
	code.style.height = window.innerHeight + "px";
	
	highlight.style.position = "fixed";
	highlight.style.left = halfway + 2 + "px";
	highlight.style.top = headerHeight + 2 + "px";
	
	highlight.style.width = window.innerWidth - halfway + "px";
	highlight.style.height = window.innerHeight + "px";
}

window.onload = function(event) {
	fitScreen();
	
	var code = document.getElementById("code");
	code.addEventListener('keydown', function(e) {
		if (e.key == 'Tab') {
			e.preventDefault();
			var start = this.selectionStart;
			var end = this.selectionEnd;
			this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
			this.selectionStart =
			this.selectionEnd = start + 1;
		}
		if (e.ctrlKey) {
			if (e.key === "d") { //duplicate line
				e.preventDefault();
				if (event.ctrlKey) {
					var index = this.selectionStart;
					for (var i = index; i < this.value.length; i++) {
						if (this.value[i] === '\n') {
							break;
						}
					}
					var end = i;
					for (i--; i > 0; i--) {
						if (this.value[i] === '\n') {
							i++;
							break;
						}
					}
					var start = i;
					var line = this.value.slice(start, end);
					this.value = this.value.slice(0, end) + '\n' + line + this.value.slice(end);
					this.selectionStart = end+line.length+1;
					this.selectionEnd = end+line.length+1;
				}
			}
			if (e.key === "s") {
				e.preventDefault();
			}
			if (e.key === "r") { //run
				//e.preventDefault();
				run();
			}
		}
		if (e.key == 'Enter') {
			e.preventDefault();
			var start = this.selectionStart;
			var end = this.selectionEnd;
			var tabCount = 0;
			var tabs = "";
			for (var i = start-1; -1 <= i; i--) {
				if (this.value[i] === "\n" || i === -1) {
					for (var j = i+1; this.value[j] === "\t" && j !== start; j++) {
						tabCount++;
						tabs += "\t";
					}
					break;
				}
			}
			if (this.value[this.selectionStart-1] === "{") {
				tabCount++;
				tabs += "\t";
			}
			this.value = this.value.substring(0, start) + "\n" + tabs + this.value.substring(end);
			this.selectionStart =
			this.selectionEnd = start + tabCount+1;
			if (this.selectionEnd === this.value.length) {
				this.scrollTop += 32;
			}
		}
		if (e.key === '}') {
			var starts = this.selectionStart;
			var end = this.selectionEnd;
			if (this.value[starts-1] === '\t') {
				this.value = this.value.substring(0, starts-1) + this.value.substring(end);
				this.selectionStart = starts-1;
				this.selectionEnd = end-1;
			}
		}
		
		localStorage.this = this.value;
	});

	code.onclick = function(event) { // select current line, might delete later :3
		if (event.ctrlKey) {
			var index = this.selectionStart;
			for (var i = index; i < this.value.length; i++) {
				if (this.value[i] === '\n') {
					break;
				}
			}
			this.selectionEnd = i;
			for (i--; i > 0; i--) {
				if (this.value[i] === '\n') {
					i++;
					break;updateHighlight
				}
			}
			this.selectionStart = i;
		}
	}
	
	code.oninput = function() {
		updateHighlight();
	}
	
	code.focus();
	
	updateHighlight();
	
	run();
}

window.onresize = function(event) {
	fitScreen();
}




function updateHighlight() {
	var code = document.getElementById("code").value;
	var interpreter = new Interpreter(code);
	
	interpreter.tokenize();
	
	var cols = [];
	for (var i = 0; i < interpreter.tokens.length; i++) {
		cols.push(["keyw","id","punc","op","str","num"].indexOf(interpreter.tokens[i].type)); // update later
	}
	string = "";
	var output = "";
	var indexSlot = 0;
	for (var i = 0; i < code.length; i++) {
		string += code[i];
		if (interpreter.tokenIndex[2*indexSlot] === i+1) {
			output += string;
			string = "";
		}
		if (interpreter.tokenIndex[2*indexSlot+1] === i) {
			output += "<span style='color:" + ["#f90","#eee","#3df","#3df","#0f4","#0f4"][cols[indexSlot]] + ";'>" + string + "</span>";
			string = "";
			indexSlot++;
		}
	}
	output += string;
	
	highlight.innerHTML = output;
}

function run() {
	var interpreter = new Interpreter(document.getElementById("code").value);
	
	interpreter.tokenize();
	
//	console.log("Tokens");
//	for (var i = 0; i < interpreter.tokens.length; i++) {
//		console.log(interpreter.tokens[i]);
//	}
	
	//console.log(interpreter.tokenIndex);
	
	interpreter.toRPN();
	
	console.log("RPN Tree");
	for (var i = 0; i < interpreter.rpn.length; i++) {
		console.log(interpreter.rpn[i]);
	}
	
	var result = interpreter.evaluateRPN(interpreter.rpn);
	
	console.log(result);
	console.log(result[0].value);
}










































