

var whitespace = [' ','\t','\n'];
var operators = ['*','/','%','+','-','==','!=','<','>','<=','>=','&','|','!','$','#'];
var opParamCount = [2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1];
var order = [0,0,0,1,-2,2,2,2,2,2,2,3,3,-1,-1,-1];
function priOf(op) {
	return order[operators.indexOf(op)];
}

function isConstant(string) {
	var constants = ['0','1','2','3','4','5','6','7','8','9'];
	var decimalCount = 0;
	var valid = false;
	for (var i = 0; i < string.length; i++) {
		if (constants.includes(string[i])) {
			valid = true;
		} else if (string[i] === ".") {
			decimalCount++;
			valid = false;
			if (decimalCount > 1 || i === 0) {
				break;
			}
		} else {
			valid = false;
			break;
		}
	}
	return(valid);
}

var tokens = [',','=',';','(',')',':','{','}','[',']'];
var functions = ['@NAME',"@COLOUR",'@SETUPINFO','@OWNED','@REGION','@CONNECTIONS','@INITIAL','@PLACING','@ATTACKING','@FORTIFYING','@PLACE','@ATTACK','@FORTIFY'];
var keywords = ['input','end','return','break','insert','remove','chop','derail','tag','goto','if','else','elseif','while','for','call','set','print','import'];
var condition; // make a function to clear this stuff.
var answer = [0];
var answerAt = 0;
var inputs;
var variableNames = []; // make a bot array with bot objects for all this
var variableValues = [];
var variableHooks = []
var returnValue = {type: "num", value: 0}; // reset this
var itterations = []; // clear this
function runkeyw(keyw, params, tokenList) {
	if (keyw === 'print') {
		var msg = [];
		for (var i = 0; i < params.length; i++) {
			msg.push(calculate(toRPN(params[i]), variableNames, variableValues).value);
		}
		printLn(msg);
	} else if (keyw === 'set') {
		for (var i = 0; i < params.length/2; i++) {
			setVar(params[i][0].value, calculate(toRPN(params[params.length/2+i]), variableNames, variableValues));
		}
	} else if (keyw === 'call') {
		returnValue = {type: "num", value: 0};
		pushScope();
		inputs = [];
		for (var i = 1; i < params.length; i++) {
			inputs.push(calculate(toRPN(params[i]), variableNames, variableValues));
		}
		evaluateTokens(tokenList, calculate(toRPN(params[0]), variableNames, variableValues).value+1);
		popScope();
	} else if (keyw === 'if') {
		condition = toRPN(params[0]);
		answer[answerAt] = calculate(condition, variableNames, variableValues).value;
		if (answer[answerAt] === 1) {
			answerAt++;
			evaluateTokens(tokenList, calculate(toRPN(params[1]), variableNames, variableValues).value+1);
			answerAt--;
		}
	} else if (keyw === 'elseif') {
		if (answer[answerAt] !== 1) {
			condition = toRPN(params[0]);
			answer[answerAt] = calculate(condition, variableNames, variableValues).value;
			if (answer[answerAt] === 1) {
				answerAt++;
				evaluateTokens(tokenList, calculate(toRPN(params[1]), variableNames, variableValues).value+1);
				answerAt--;
			}
		}
	} else if (keyw === 'else') {
		if (answer[answerAt] !== 1) {
			answerAt++;
			evaluateTokens(tokenList, calculate(toRPN(params[0]), variableNames, variableValues).value+1);
			answerAt--;
		}
	} else if (keyw === 'while') {
		itterations.push(0);
		condition = toRPN(params[0]);
		answer[answerAt] = calculate(condition, variableNames, variableValues).value;
		while (answer[answerAt] === 1) {
			answerAt++;
			itterations[itterations.length-1]++;
			if (itterations[itterations.length-1] > getVar('@MaximumIterations', variableNames, variableValues).value) {
				throwError("Maximum iteration error");
				break;
			}
			inputs = [{type: "num", value: itterations[itterations.length-1]}];
			evaluateTokens(tokenList, calculate(toRPN(params[1]), variableNames, variableValues).value+1);
			condition = toRPN(params[0]);
			answerAt--;
			answer[answerAt] = calculate(condition, variableNames, variableValues).value;
		}
		itterations.pop();
	} else if (keyw === 'for') {
		itterations.push(0);
		pushScope();
		for (var i = calculate(toRPN(params[0]), variableNames, variableValues).value; i < calculate(toRPN(params[1]), variableNames, variableValues).value; i += calculate(toRPN(params[2]), variableNames, variableValues).value) {
			itterations[itterations.length-1]++;
			if (itterations[itterations.length-1] > getVar('@MaximumIterations', variableNames, variableValues).value) {
				throwError("Maximum iteration error");
				break;
			}
			inputs = [{type: "num", value: i}];
			evaluateTokens(tokenList, calculate(toRPN(params[3]), variableNames, variableValues).value+1);
		}
		itterations.pop();
		popScope();
	} else if (keyw === 'input') {
		for (var i = 0; i < Math.min(inputs.length, params.length); i++) {
			setVar(params[i][0].value, inputs[i]);
		}
	} else if (keyw === 'return') {
		returnValue = calculate(toRPN(params[0]), variableNames, variableValues);
	} else if (keyw === 'import') {
		var libName = calculate(toRPN(params[0]), variableNames, variableValues);
		if (libName.type === "str") {
			if (igNames.includes(libName.value)) {
				importLib(libName.value);
			} else {
				throwError(libName.value + " does not exist.");
			}
		} else if (libName.type === "num") {
			if (Number(libName.value) < igNames.length) {
				importLib(igNames[libName.value]);
			} else {
				throwError(libName.value + " does not exist.");
			}
		}
	} else if (keyw === '') {
		
	} else {
		
	}
}
function setVar(name, value) {
	if (variableNames.includes(name)) {
		variableValues[variableNames.indexOf(name)] = value;
	} else {
		variableNames.push(name);
		variableValues.push(value);
	}
}
function getVar(name, names, values) {
	if (names.includes(name)) {
		return values[names.indexOf(name)];
	} else {
		return {type: "num", value: 0};
	}
}
function pushScope() {
	variableHooks.push(variableNames.length);
}
function popScope() {
	while (variableNames.length > variableHooks[variableHooks.length-1]) {
		variableNames.pop();
		variableValues.pop();
	}
	variableHooks.pop();
}

setVar('@MaximumStack', {type: "num", value: 100}); // locally
functions.push('@MaximumStack');
setVar('@MaximumIterations', {type: "num", value: 100});
functions.push('@MaximumIterations');

var igLibs = ['GREET_hi: {\n\tprint \"hi\";\n};\nGREET_hello: {\n\tprint \"Hello\";\n};',
"LIST_gapToken: \" \";\nLIST_new: {\n\tinput LIST_raw;\n\tLIST_f: \"[\";\n\tLIST_rawLen: #LIST_raw;\n\tfor 0 LIST_rawLen 1 { input LIST_i;\n\t\tif LIST_raw*LIST_i == \",\" {\n\t\t\tLIST_f: LIST_f+ LIST_gapToken;\n\t\t}; else {\n\t\t\tLIST_f: LIST_f+ LIST_raw*LIST_i;\n\t\t};\n\t};\n\tLIST_f: LIST_f+ \"]\";\n\treturn LIST_f;\n};\nLIST_length: {\n\tinput LIST_f;\n\tif LIST_f == \"[]\" {\n\t\treturn 0;\n\t}; else {\n\t\tLIST_rawLen: #LIST_f;\n\t\tLIST_count: 1;\n\t\tfor 0 LIST_rawLen 1 { input LIST_i;\n\t\t\tif LIST_f*LIST_i == LIST_gapToken {\n\t\t\t\tLIST_count: LIST_count + 1;\n\t\t\t};\n\t\t};\n\t\treturn LIST_count;\n\t};\n};\nLIST_item: {\n\tinput LIST_f LIST_stopI;\n\tif LIST_f == \"[]\" {\n\t\treturn -1;\n\t}; else {\n\t\tLIST_count: 0;\n\t\tLIST_value: \"\";\n\t\twhile LIST_count <= LIST_stopI & LIST_f*LIST_i != \"]\" { input LIST_i;\n\t\t\tif LIST_f*LIST_i == LIST_gapToken {\n\t\t\t\tLIST_count: LIST_count + 1;\n\t\t\t\tif LIST_count <= LIST_stopI {\n\t\t\t\t\tLIST_value: \"\";\n\t\t\t\t};\n\t\t\t}; else {\n\t\t\t\tLIST_value: LIST_value + LIST_f*LIST_i;\n\t\t\t};\n\t\t\tset LIST_i LIST_i+1;\n\t\t};\n\t\tif LIST_f*LIST_i == \"]\" & LIST_count < LIST_stopI {\n\t\t\tLIST_value: -1;\n\t\t};\n\t\treturn LIST_value;\n\t};\n};\nLIST_indexOf: {\n\tinput LIST_f LIST_element;\n\tLIST_count: 0;\n\tLIST_position: -1;\n\tLIST_value: \"\";\n\tLIST_i: 1;\n\twhile !(LIST_value == LIST_element & LIST_f*LIST_i == LIST_gapToken) & LIST_f*LIST_i != \"]\" {\n\t\tif LIST_f*LIST_i == LIST_gapToken {\n\t\t\tLIST_value: \"\";\n\t\t\tLIST_count: LIST_count + 1;\n\t\t}; else {\n\t\t\tLIST_value: LIST_value + LIST_f*LIST_i;\n\t\t};\n\t\tLIST_i: LIST_i+1;\n\t};\n\tif LIST_value == LIST_element {\n\t\tLIST_position: LIST_count;\n\t};\n\treturn LIST_position;\n};\nLIST_append: {\n\tinput LIST_f LIST_element;\n\treturn LIST_f%1 + LIST_gapToken + LIST_element + \"]\";\n};\nLIST_pop: {\n\tinput LIST_f;\n\tLIST_i: #LIST_f-2;\n\twhile LIST_f*LIST_i != \"[\" & LIST_f*LIST_i != LIST_gapToken {\n\t\tset LIST_i LIST_i-1;\n\t};\n\tif LIST_f*LIST_i == \"[\" {\n\t\treturn \"[]\";\n\t}; else {\n\t\treturn LIST_f%(#LIST_f-LIST_i) + \"]\";\n\t};\n};\nLIST_unshift: {\n\tinput LIST_f LIST_element;\n\treturn \"[\" + LIST_element + LIST_gapToken + 1%LIST_f;\n};\nLIST_shift: {\n\tinput LIST_f;\n\tLIST_i: 1;\n\twhile LIST_f*LIST_i != \"]\" & LIST_f*LIST_i != LIST_gapToken {\n\t\tset LIST_i LIST_i+1;\n\t};\n\tif LIST_f*LIST_i == \"]\" {\n\t\treturn \"[]\";\n\t}; else {\n\t\treturn \"[\" + (LIST_i+1)%LIST_f;\n\t};\n};\nLIST_setItem: {\n\tinput LIST_f LIST_stopI LIST_element;\n\tif LIST_stopI != 0 {\n\t\tLIST_count: 0;\n\t\twhile LIST_count < LIST_stopI & LIST_f*LIST_i != \"]\" { input LIST_i;\n\t\t\tif LIST_f*LIST_i == LIST_gapToken {\n\t\t\t\tset LIST_count LIST_count+1;\n\t\t\t};\n\t\t\tset LIST_i LIST_i+1;\n\t\t};\n\t\tLIST_start: LIST_i;\n\t}; else {\n\t\tLIST_start: 1;\n\t};\n\twhile LIST_f*LIST_i != LIST_gapToken & LIST_f*LIST_i != \"]\" {\n\t\tset LIST_i LIST_i+1;\n\t};\n\treturn LIST_f%(#LIST_f-LIST_start) + LIST_element + (LIST_i)%LIST_f;\n};\nLIST_help: {\n\tprint \"LIST_\";\n\tprint \"  help\";\n\tprint \"  new (raw)\";\n\tprint \"  length (base)\";\n\tprint \"  item (base) (index)\";\n\tprint \"  indexOf (base) (item)\";\n\tprint \"  append (base) (item)\";\n\tprint \"  pop (base)\";\n\tprint \"  unshift (base) (item)\";\n\tprint \" shift (base)\";\n\tprint \"  setItem (base) (index) (item)\";\n};",
"iLIB_init: {\ncode: \"getVar=function(name,names,values){if(name===\\'iLIB_ask\\'){return {type:\\'str\\',value:prompt(getVar(\\'iLIB_question\\',variableNames,variableValues).value)};}else if(names.includes(name)){return values[names.indexOf(name)];}else{return{type:\\'num\\',value:0};}};functions.push(\\'iLIB_program\\');functions.push(\\'iLIB_question\\');functions.push(\\'iLIB_ask\\');tL=tokenize(editor.value);overlay.innerHTML=highlight(editor.value,tL);output.innerHTML=\\'<span style=\\\\\\'color:blue\\\\\\'> > iLIB_program</span><br>\\';evaluateTokens(tL,getVar(\\'iLIB_program\\',variableNames,variableValues).value+1);output.innerHTML+=\\'<span style=\\\\\\'color:blue\\\\\\'> > iLIB_END </span>\\'+returnValue.value+\\'<br>\\';\";\nprint \"<a style='color:blue'><br> > Welcome to iLIB<br> > <button onclick=\"eval('\"+code+\"')\">Run in iLIB</button></a>\";\n};"];
var igNames = ['GREET','LIST','iLIB'];
var libsIncluded = []; //local
function addLib(name) {
	igNames.push(name);
	igLibs.push(editor.value);
}
var headerValue = ''; //again, local
function importLib(name) {
	if (!libsIncluded.includes(name)) {
		libsIncluded.push(name);
		headerValue += igLibs[igNames.indexOf(name)];
		throwError(name + " loaded click Run");
	}
}

function addToken(str, index) {
	var length = str.length;
	var type = null;
	if (operators.includes(str)) {
		type = "op";
	} else if (tokens.includes(str)) {
		type = "tok";
	} else if (keywords.includes(str)) {
		type = "keyw";
	} else if (functions.includes(str)) {
		type = "func";
	} else if (str[0] === '"') {
		type = "str";
		str = str.substring(1);
		length += 2;
		index += 1;
	} else if (isConstant(str)) {
		type = "num";
	} else {
		type = "id";
	}
	if (((!whitespace.includes(str)&& str !== '') || type === "str") && !isComment) {
		tokenList.push({value: str, type: type, start: index-length, end: index-1});
	}
	string = "";
	strIndex = index;
}
var string; // I don't know why this stuff is global
var strIndex;
var inString;
var isComment;
function tokenize(code) {
	tokenList = [];
	strIndex = 0;
	inString = false;
	string = "";
	isComment = false;
	for (var i = 0; i < code.length; i++) {
		if (inString) {
			if (code[i] === '\\') {
				i++;
				string += code[i];
			} else if (code[i] === '"') {
				addToken(string, i);
				inString = false;
			} else {
				string += code[i];
			}
		} else {
			if (code[i] === '/' && code[i+1] === '/') {
				isComment = true;
			} if (code[i] === '"') {
				addToken(string, i);
				string += '"';
				inString = true;
			} else if (whitespace.includes(code[i])) {
				addToken(string, i);
				if (code[i] === '\n') {
					isComment = false
				}
			} else if (operators.includes(code[i]+code[i+1])) {
				addToken(string, i);
				addToken(code[i]+code[i+1], i+2);
				i++;
			} else if (operators.includes(code[i])) {
				addToken(string, i);
				addToken(code[i], i+1);
			} else if (tokens.includes(code[i])) {
				addToken(string, i);
				addToken(code[i], i+1);
			} else {
				string += code[i];
			}
		}
	}
	addToken(string, i);
	return tokenList;
}

function toRPN(tokenList) {
	// Group + -
	var simpList = [];
	var inPM = false;
	var odd = 0;
	for (var i = 0; i < tokenList.length; i++) {
		var t = tokenList[i];
		if (tokenList[i].type === "op" && ['+','-'].includes(t.value)) {
			inPM = true;
			if (t.value === '-') {
				odd++;
			}
		} else {
			if (inPM) {
				simpList.push({value: ['+','-'][odd%2], type: "op"});
				inPM = false;
				odd = 0;
			}
			simpList.push(t);
		}
	}
	// Add in Pluses
	var prevType = null;
	var prevTk = null;
	for (var i = 0; i < simpList.length; i++) {
		if (simpList[i].type === prevType && prevType === "num") {
			throwError("Error: 2 litterals in a row at [" +i + "]: '"+prevTk+"' and '"+simpList[i].value+"'");
		} else if (false) { // error check later;
			
		} else if (simpList[i].type === "op" && simpList[i].value === '-') {
			simpList.splice(i, 0, {value: '+', type: "op"});
			i += 2;
		}
		prevType = simpList[i].type;
		prevTk = simpList[i].value;
	}
	if (simpList[0].type === "op" && simpList[0].value === "+") {
		simpList.shift();
	}
	for (var i = 0; i < simpList.length; i++) {
		if (simpList[i].type === "tok" && simpList[i].value === "(") {
			if (simpList[i+1].type === "op" && simpList[i+1].value === "+") {
				simpList.splice(i+1, 1);
			}
		}
	}
	/*
	var msg = "";
	for (var i = 0; i < simpList.length; i++) {
		msg += simpList[i].value;
	}
	console.log(msg);
	*/
	
	// Convert to RPN
	function unwind() {
		rpn.push(opStack[opStack.length-1]);
		opStack.pop();
	}
	var rpn = [];
	var opStack = [];
	for (var i = 0; i < simpList.length; i++) {
		if (simpList[i].type === "op") {
			while (opStack.length > 0 && priOf(opStack[opStack.length-1].value) <= priOf(simpList[i].value)) {
				unwind();
			}
			opStack.push(simpList[i]);
		} else if (simpList[i].type === "tok") {
			if (simpList[i].value === '(') {
				opStack.push(simpList[i]);
			} else if (simpList[i].value === ')') {
				while (opStack.length > 0 && opStack[opStack.length-1].value !== '(') {
					unwind();
				}
				opStack.pop();
			}
		} else {
			rpn.push(simpList[i]);
		}
	}
	while (opStack.length > 0) {
		unwind();
	}
	
	return rpn;
}

function calculate(rpn, variableNames, variableValues) {
	/*
	console.log("RPN: {");
	for (var i = 0; i < rpn.length; i++) {
		console.log("\t>" + rpn[i].value, rpn[i].type + "<");
	}
	console.log("}");
	*/
	
	function actOp(op) { // '*','/','%','+','-','==','!=','<','>','<=','>=','&','|'
		var count = opParamCount[operators.indexOf(op)];
		var params = [];
		var paramTypes = [];
		for (var p = 0; p < count; p++) {
			params.unshift(stack[stack.length-1].value);
			paramTypes.unshift(stack[stack.length-1].type);
			stack.pop();
		}
		var returning;
		var tpe;
		switch (op) {
			case '*':
				if (paramTypes[0] === paramTypes[1] && paramTypes[0] === "num") {
					returning = Number(params[0]) * Number(params[1]);
					tpe = "num";
				} else if (paramTypes[0] === "str" && paramTypes[1] === "num") {
					returning = params[0][Number(params[1])];
					tpe = "str";
				} else {
					returning = 0;
					tpe = "num";
				}
			break;
			case '/':
				if (paramTypes[0] === paramTypes[1] && paramTypes[0] === "num") {
					returning = Number(params[0]) / Number(params[1]);
					tpe = "num";
				} else {
					returning = 0;
					tpe = "num";
				}
			break;
			case '%':
				if (paramTypes[0] === paramTypes[1] && paramTypes[0] === "num") {
					returning = Number(params[0]) % Number(params[1]);
					tpe = "num";
				} else if (paramTypes[0] === "str" && paramTypes[1] === "num") {
					returning = params[0].slice(0, params[0].length - Number(params[1]));
					tpe = "str";
				} else if (paramTypes[0] === "num" && paramTypes[1] === "str") {
					returning = params[1].slice(Number(params[0]));
					tpe = "str";
				}  else {
					returning = 0;
					tpe = "num";
				}
			break;
			case '+':
				if (paramTypes[0] === paramTypes[1] && paramTypes[0] === "num") {
					returning = Number(params[0]) + Number(params[1]);
					tpe = "num";
				} else {
					returning = params[0] + params[1];
					tpe = "str";
				}
			break;
			case '-':
				if (paramTypes[0] === "num") {
					returning = -Number(params[0]);
					tpe = "num";
				} else {
					returning = 0;
					tpe = "num";
				}
			break;
			case '==':
				returning = [0,1] [Number(params[0] == params[1])];
				tpe = "num";
			break;
			case '!=':
				returning = [0,1] [Number(params[0] != params[1])];
				tpe = "num";
			break;
			case '<':
				returning = [0,1] [Number(Number(params[0]) < Number(params[1]))];
				tpe = "num";
			break;
			case '>':
				returning = [0,1] [Number(Number(params[0]) > Number(params[1]))];
				tpe = "num";
			break;
			case '<=':
				returning = [0,1] [Number(Number(params[0]) <= Number(params[1]))];
				tpe = "num";
			break;
			case '>=':
				returning = [0,1] [Number(Number(params[0]) >= Number(params[1]))];
				tpe = "num";
			break;
			case '&':
				returning = Number(params[0]) * Number(params[1]);
				tpe = "num";
			break;
			case '|':
				returning = Number(params[0]) || Number(params[1]);
				tpe = "num";
			break;
			case '!':
				if (paramTypes[0] === "num") {
					returning = Number(Number(params[0]) !== 1);
					tpe = "num";
				} else {
					returning = 0;
					tpe = "num";
				}
			break;
			case '$':
				if (params[0] === "num") {
					returning = Number(params[1]);
					if (returning === NaN) {
						returning = 0;
					}
					tpe = "num";
				} else if (params[0] === "str") {
					returning = String(params[1]);
					tpe = "str";
				}
			break;
			case '#':
				returning = String(params[0]).length;
				tpe = "num";
			break;
		}
		if (returning === undefined || returning === NaN) {
			returning = 0;
			tpe = "num";
		}
		return {type: tpe, value: returning};
	}
	var stack = [];
	var storage = null;
	for (var i = 0; i < rpn.length; i++) {
		if (rpn[i].type === "op") {
			stack.push(actOp(rpn[i].value));
		} else if (rpn[i].type === "num") {
			stack.push(rpn[i]);
		} else if (rpn[i].type === "str") {
			stack.push(rpn[i]);
		} else if (rpn[i].type === "id" || rpn[i].type === "func") {
			var varval = getVar(rpn[i].value, variableNames, variableValues);
			stack.push(varval);
		}
	}
	if (stack[0].type === "num") {
		stack[0].value = Number(stack[0].value);
	}
	return stack[0];
}

function gap(prevToken, token) {
	var newParam = false;
	if (prevToken !== null) { //check for a gap
		if (["num","str","id","func"].includes(prevToken.type) && ["num","str","id","func"].includes(token.type)) {
			newParam = true;
		} else if (prevToken.type !== "op" && !(prevToken.type === "tok" && (prevToken.value === "(" || prevToken.value === "{" || prevToken.value === "[[")) && token.type === "tok" && (token.value === "(" || token.value === "{" || prevToken.value === "[[")) {
			newParam = true;
		} else if (token.type !== "op" && !(token.type === "tok" && (token.value === ")" || token.value === "}" || token.value === "]]")) && prevToken.type === "tok" && (prevToken.value === ")" || prevToken.value === "}" || token.value === "]]")) {
			newParam = true;
		}
	}
	return newParam;
}

var maximumStack = 0; // this stuff we clear
var stackError = false;
function evaluateTokens(tokenList, initialIndex) {
	maximumStack++;
	if (maximumStack > getVar('@MaximumStack', variableNames, variableValues).value+1) {
		throwError("Stack call size error!");
		stackError = true;
	}
	if (stackError) {
		maximumStack--;
		if (maximumStack === 0) {
			stackError = false;
		}
		return;
	}
	if (initialIndex === undefined) {
		initialIndex = 0;
	}
	var stage = 0;
	var parameters = [];
	var parameter = [];
	var prevToken = null;
	var keyw;
	var inBlock = false;
	var blockScope = 0;
	var blockId = null;
	var callParams = [];
	var paramCount = [];
	for (var i = initialIndex; i < tokenList.length; i++) {
		var token = tokenList[i];
		if (tokenList[i].type === "tok" && tokenList[i].value === "{") {
			blockScope++;
			if (!inBlock) {
				blockId = i;
			}
			inBlock = true;
		} else if (tokenList[i].type === "tok" && tokenList[i].value === "}") {
			blockScope--;
			if (blockScope === 0) {
				inBlock = false;
				token = {type: "num", value: blockId};
			} else if (blockScope < 0) {
				break;
			}
		}
		if (inBlock) {
			continue;
		}
		// function notation
		if (tokenList[i].type === "tok" && tokenList[i].value === "[") {
			if (paramCount.length === 0) {
				if (parameter.length > 0) {
					parameters.push(parameter);
				}
			} else if (parameter.length > 0) {
				callParams.push(parameter);
				paramCount[paramCount.length-1]++;
			}
			paramCount.push(0);
			prevToken = null;
			parameter = [];
			continue;
		} else if (tokenList[i].type === "tok" && tokenList[i].value === "]") {
			// upload final parameter if needed
			if (parameter.length !== 0) {
				paramCount[paramCount.length-1]++;
				callParams.push(parameter);
			}
			parameter = [];
			var callNow = [];
			var allParams = callParams.length-1;
			//var msg = ""; for (var k in callParams) {msg+=callParams[k][0].value+" "}; console.log(msg, paramCount);
			for (var j = allParams; j > allParams-paramCount[paramCount.length-1]; j--) {
				callNow.unshift(callParams[j]);
				callParams.pop();
			}
			paramCount.pop();
			//var msg = ""; for (var k in callNow) {msg+=callNow[k][0].value+" "}; console.log(msg);
			runkeyw("call", callNow, tokenList);
			prevToken = null;
			parameter = [];
			if (paramCount.length > 0) {
				paramCount[paramCount.length-1]++;
				callParams.push([returnValue]);
				continue;
			} else {
				token = returnValue;
			}
		} else if (paramCount.length > 0) { // function - gap / comma
			if (token.type === "tok" && token.value === ",") {
				// upload parameter
				if (parameter.length !== 0) {
					paramCount[paramCount.length-1]++;
					callParams.push(parameter);
				}
				parameter = [];
			} else {
				if (gap(prevToken, token)) {
					// upload parameter
					if (parameter.length !== 0) {
						paramCount[paramCount.length-1]++;
						callParams.push(parameter);
					}
					parameter = [];
				}
				parameter.push(token);
			}
			prevToken = token;
			continue;
		}
		// end function notation
		// set notation and keyw params
		if (stage === 0) {
			if (token.type === "keyw") {
				keyw = token.value;
				stage = 1;
				parameters = [];
				parameter = [];
				prevToken = null;
			} else if (token.type === "tok" && token.value === ":") { // set variable name parameters
				keyw = "set";
				stage = 1;
				// upload last parameter
				parameters.push(parameter);
				parameter = [];
			} else if (token.type === "tok" && token.value === ",") {
				// upload parameter
				parameters.push(parameter);
				parameter = [];
			} else {
				if (gap(prevToken, token)) {
					// upload parameter
					if (parameter.length > 0) {
						parameters.push(parameter);
						parameter = [];
					}
				}
				parameter.push(token);
			}
			if (token.type !== "keyw") {
				prevToken = token;
			}
		} else { // keyword parameters / set values
			if (token.type === "tok" && token.value === ";") {
				// upload last parameter
				parameters.push(parameter);
				parameter = [];
				stage = 0;
				//console.log(keyw, parameters);
				runkeyw(keyw, parameters, tokenList);
				parameters = [];
				prevToken = null;
			} else if (token.type === "tok" && token.value === ",") {
				// upload parameter
				parameters.push(parameter);
				parameter = [];
			} else {
				if (gap(prevToken, token)) {
					// upload parameter
					if (parameter.length > 0) {
						parameters.push(parameter);
						parameter = [];
					}
				}
				parameter.push(token);
			}
			prevToken = token;
		}
	}
	maximumStack--;
	return; // return value
}

var editor = document.getElementById("editor"); // this stuff we won't need
var overlay = document.getElementById("overlay");
var underlay = document.getElementById("underlay");
var output = document.getElementById("output");
var header = document.getElementById("header");
editor.style.width = window.innerWidth-400+"px";
overlay.style.width = editor.style.width;
underlay.style.width = editor.style.width;
output.style.left = editor.style.width;
output.style.width = window.innerWidth - Number(editor.style.width.slice(0, -2)) + "px";
editor.style.height = window.innerHeight-40+"px";
overlay.style.height = editor.style.height
underlay.style.height = editor.style.height
overlay.style.top = 40-editor.scrollTop+"px";
underlay.style.top = 40-editor.scrollTop+"px";
output.style.height = editor.style.height
header.style.width = window.innerWidth-8;
editor.addEventListener("mouseup", function() {
	overlay.style.width = editor.style.width;
	underlay.style.width = editor.style.width;
	output.style.left = editor.style.width;
	output.style.width = window.innerWidth - Number(editor.style.width.slice(0, -2)) + "px";
});
editor.onscroll = function(event) {
	overlay.style.top = 40-editor.scrollTop+"px";
	underlay.style.top = 40-editor.scrollTop+"px";
}

window.onresize = function() {
	editor.style.height = window.innerHeight-40+"px";
	overlay.style.height = editor.style.height;
	underlay.style.height = editor.style.height;
	output.style.height = editor.style.height;
	output.style.left = editor.style.width;
	output.style.width = window.innerWidth - Number(editor.style.width.slice(0, -2)) + "px";
	header.style.width = window.innerWidth-8;
}
var fontSize = 32;
editor.style.fontSize = fontSize+"px";
overlay.style.fontSize = fontSize+"px";
underlay.style.fontSize = fontSize+"px";

function changeFont(font) {
	editor.style.fontFamily = font;
	overlay.style.fontFamily = font;
	underlay.style.fontFamily = font;
	output.style.fontFamily = font;
}

if (localStorage.editor !== undefined) {
	editor.value = localStorage.editor;
}

editor.oninput = function(event) {
	// auto semicolons
	if (event.data === '}') {
		var starts = this.selectionStart;
		var end = this.selectionEnd;
		if (this.value[starts-2] === '\t') {
			this.value = this.value.substring(0, starts-2) + '}' + this.value.substring(end);
			this.selectionStart = starts-1;
			this.selectionEnd = end-1;
		}
	}
	tL = tokenize(editor.value);
	for (var i = tL.length-1; i > 0; i--) {
		if (tL[i].start < this.selectionStart) {
			var start = this.selectionStart;
			if (tL[i].type === "keyw") {
				if (tL[i-1].value !== ';' && !(tL[i-1].type === 'tok' && tL[i-1].value === '{')) {
					editor.value = editor.value.slice(0, tL[i-1].end+1) + ';' + editor.value.slice(tL[i-1].end+1);
					editor.selectionStart = start+1;
					editor.selectionEnd = start+1;
				}
			} else if (tL[i].type === "tok" && tL[i].value === '}') {
				if (tL[i-1].value !== ';' && !(tL[i-1].type === 'tok' && tL[i-1].value === '{')) {
					editor.value = editor.value.slice(0, tL[i-1].end+1) + ';' + editor.value.slice(tL[i-1].end+1);
					editor.selectionStart = start+1;
					editor.selectionEnd = start+1;
				}
			} else if (tL[i].type === "tok" && tL[i].value === ':' && i > 1) {
				if (tL[i-2].value !== ';' && !(tL[i-2].type === 'tok' && tL[i-2].value === '{')) {
					editor.value = editor.value.slice(0, tL[i-2].end+1) + ';' + editor.value.slice(tL[i-2].end+1);
					editor.selectionStart = start+1;
					editor.selectionEnd = start+1;
				}
			}
			break;
		}
	}
	
	
	localStorage.editor = editor.value;
	tL = tokenize(editor.value);
	
	overlay.innerHTML = highlight(editor.value, tL);
	underlay.innerHTML = highlight(editor.value, tL);
}

tL = tokenize(editor.value); // we won't need this.
/*
console.log("TOKENS: {");
for (var i = 0; i < tL.length; i++) {
	console.log("\t>" + tL[i].value, tL[i].type + "<");
}
console.log("}");
*/

overlay.innerHTML = highlight(editor.value, tL);
underlay.innerHTML = highlight(editor.value, tL);

function printLn(msg) {
	output.innerHTML += "<span style='color:#0b0;'> \> </span>" + msg[0];
	for (var i = 1; i < msg.length; i++) {
		output.innerHTML += "<span style='color:#0b0;'>, </span>" + msg[i];
	}
	output.innerHTML += '\n';
}

function throwError(error) {
	output.innerHTML += " <span style='color:#b00;'>" + error + "</span>\n";
}

function highlight(code, tokens) {
	var cols = [];
	var indexes = [];
	for (var i = 0; i < tokens.length; i++) {
		cols.push(["keyw","func","tok","str","num","tok","op","id"].indexOf(tokens[i].type));
		indexes.push(tokens[i].start);
		indexes.push(tokens[i].end);
	}
	string = "";
	var output = "";
	var indexSlot = 0;
	for (var i = 0; i < code.length; i++) {
		string += code[i];
		if (indexes[2*indexSlot] === i+1) {
			output += string;
			string = "";
		}
		if (indexes[2*indexSlot+1] === i) {
			output += "<span style='color:" + ["#f90","#f4c","#3df","#0f4","#0f4","#f90","#eee","#eee"][cols[indexSlot]] + ";'>" + string + "</span>";
			string = "";
			indexSlot++;
		}
	}
	//console.log(indexes);
	output += string;
	return(output);
}

editor.addEventListener('keydown', function(e) {
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
				var index = editor.selectionStart;
				for (var i = index; i < editor.value.length; i++) {
					if (editor.value[i] === '\n') {
						break;
					}
				}
				var end = i;
				for (i--; i > 0; i--) {
					if (editor.value[i] === '\n') {
						i++;
						break;
					}
				}
				var start = i;
				var line = editor.value.slice(start, end);
				editor.value = editor.value.slice(0, end) + '\n' + line + editor.value.slice(end);
				editor.selectionStart = end+line.length+1;
				editor.selectionEnd = end+line.length+1;
			}
		}
		if (e.key === "s") {
			e.preventDefault();
		}
		if (e.key === "r") { //run
			e.preventDefault();
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
			overlay.style.top = 40-this.scrollTop+"px";
		}
	}
	
	localStorage.editor = this.value;
	tL = tokenize(editor.value);
	overlay.innerHTML = highlight(editor.value, tL);
});

editor.onclick = function(event) {
	if (event.ctrlKey) {
		var index = editor.selectionStart;
		for (var i = index; i < editor.value.length; i++) {
			if (editor.value[i] === '\n') {
				break;
			}
		}
		editor.selectionEnd = i;
		for (i--; i > 0; i--) {
			if (editor.value[i] === '\n') {
				i++;
				break;
			}
		}
		editor.selectionStart = i;
	}
}

editor.focus();

var headerValue = ''; // reset.
var headerTL;
function run() {
	output.innerHTML = "";
	headerTL = tokenize(headerValue);
	tL = tokenize(editor.value);
	stackError = false;
	pushScope();
	evaluateTokens(headerTL.concat(tL));
	popScope();
	printLn(["<span style='color:#0b0;'>END </span>"+ returnValue.value]);
}




