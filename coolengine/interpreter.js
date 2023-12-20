const Types = {
	keyw: "keyw",
	id: "id",
	punc: "punc",
	op: "op",
	num: "num",
	str: "str"
};

class Interpreter {
	constructor(code) {
		this.code = code;
		this.whitespace = [' ', '\t', '\n'];
		this.punctuals = [',','=',';','(',')','{','}','[',']'];
		this.operators = ['*','/','%','+','-','==','!=','<','>','<=','>=','&','|','!','$','#'];
		this.opParamCount = [2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1];
		this.isPrefix = function(operator) {
			return this.opParamCount[this.operators.indexOf(operator)] === 1;
		};
		this.priorityOf = function(operator) {
			if (operator.type === Types.punc && operator.value === '(') {
				return -2;
			}
			return this.order[this.operators.indexOf(operator)];
		};
		this.order = [0,0,0,1,-1,2,2,2,2,2,2,3,3,-1,-1,-1];
		
		this.validDigits = ['0','1','2','3','4','5','6','7','8','9'];
		
		this.keywords = ['input','return','break','if','else','elseif','while','for','call','set','print','import'];
		
		this.stringToken = '"';
		this.stringEscapeChar = '\\';
		this.escapeFunction = function(char) {
			return char;
		}
		
		this.funcNames = [];
		this.funcValues = [];
		this.addFunc('+', function(p) {
			if (p) {
			return [self.createNumber(p[0].value + p[1].value)];
		});
		
		this.errorLogs = [];
	}
	throwError(error) {
		this.errorLogs.push(error);
	}
	compileRPN() {
		this.tokenize();
		this.toRPN();
	}
	evaluate() {
		this.tokenize();
		this.toRPN();
	}
	isConstant(string) {
		var decimalCount = 0;
		var valid = false;
		for (var i = 0; i < string.length; i++) {
			if (this.validDigits.includes(string[i])) {
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
	tokenize() {
		this.tokens = [];
		this.tokenIndex = [];
		
		var self = this;
		
		var inString = false;
		var inComment = false;
		var stringStart = null;
		
		var string = "";
		function addToken(value, index, overwrite, stringStart) {
			var startIndex = index - value.length;
			var endIndex = index - 1;
			var type = null;
			if (overwrite) {
				type = Types.str;
				startIndex = stringStart;
				endIndex = index;
			} else if (self.punctuals.includes(value)) {
				type = Types.punc;
			} else if (self.operators.includes(value)) {
				type = Types.op;
			} else if (self.isConstant(value)) {
				type = Types.num;
			} else if (self.keywords.includes(value)) {
				type = Types.keyw;
			} else {
				type = Types.id;
			}
			if (overwrite || value.length > 0 && !self.whitespace.includes(value)) {
				self.tokens.push({type: type, value: value});
				self.tokenIndex.push(startIndex);
				self.tokenIndex.push(endIndex);
			}
			string = "";
		}
		
		for (var i = 0; i < this.code.length; i++) {
			if (inString) {
				if (this.code[i] === this.stringToken) {
					inString = false;
					addToken(string, i, true, stringStart);
				} else if (this.code[i] === this.stringEscapeChar) {
					i++;
					string += this.escapeFunction(this.code[i]);
				} else {
					string += this.code[i];
				}
				continue;
			} else if (this.code[i] === this.stringToken) {
				addToken(string, i);
				inString = true;
				stringStart = i;
				continue;
			}
			if (this.operators.includes(this.code[i] + this.code[i+1])) { // 2 length operators
				addToken(string, i);
				addToken(this.code[i] + this.code[i+1], i+2);
				i++;
			} else if (this.operators.includes(this.code[i])) {
				addToken(string, i);
				addToken(this.code[i], i+1);
			} else if (this.punctuals.includes(this.code[i])) {
				addToken(string, i);
				addToken(this.code[i], i+1);
			} else if (this.whitespace.includes(this.code[i])) {
				addToken(string, i);
			} else {
				string += this.code[i];
			}
		}
		addToken(string, i);
	}
	preRPN() {
		this.grouped = [];
		var odd = 0;
		var prevPM = false;
		var addPlus = false;
		var prevToken = {type: Types.punc, value: '('};
		
		var self = this;
		
		function addOperator() {
			if (prevPM) {
				if (addPlus) {
					self.grouped.push({type: Types.op, value: '+'});
				}
				if (odd%2 === 1) {
					self.grouped.push({type: Types.op, value: '-'});
				}
				prevPM = false;
			}
		}
		for (var i = 0; i < this.tokens.length; i++) {
			if (this.tokens[i].type === Types.op && (this.tokens[i].value === '-' || this.tokens[i].value === '+')) {
				if (!prevPM) {
					odd = 0;
					prevPM = true;
					if ([Types.id, Types.num, Types.str].includes(prevToken.type) || (prevToken.type === Types.punc && (prevToken.value === ')' || prevToken.value === ';'))) {
						addPlus = true;
					} else {
						addPlus = false;
					}
				}
				if (this.tokens[i].value === '-') {
					odd++;
				}
			} else {
				if (prevPM) {
					addOperator();
				}
				this.grouped.push(this.tokens[i]);
			}
			prevToken = this.tokens[i];
		}
		if (prevPM) {
			addOperator();
		}
		
	}
	toRPN() {
		this.preRPN(); // group + - symbols
		
		this.rpn = [];
		
		var opStack = [];
		for (var i = 0; i < this.grouped.length; i++) {
			var token = this.grouped[i];
			
			if (token.type === Types.keyw) {
				opStack.push(token);
			} else if (token.type === Types.punc) {
				if (token.value === '(') {
					opStack.push(token);
				} else if (token.value === ')') {
					while (opStack.length > 0 && !(opStack[opStack.length-1].type === Types.punc && opStack[opStack.length-1].value === '(')) {
						this.rpn.push(opStack.pop());
					}
					if (opStack.length > 0 && opStack[opStack.length-1].type === Types.punc && opStack[opStack.length-1].value === '(') {
						opStack.pop();
					}
				}
			} else if (token.type === Types.op) {
				if (this.isPrefix(token.value)) { // prefix operators take priority // compare w keyword priority
					opStack.push(token);
				} else {
					while (opStack.length > 0 && this.priorityOf(opStack[opStack.length - 1].value) <= this.priorityOf(token.value)) { // if the opstack operator is higher or equal to priority as current token, pop it and add it to the tree
						this.rpn.push(opStack.pop());
					}
					opStack.push(token);
				}
			} else {
				this.rpn.push(token);
			}
		}
		// unwind all remaining operators
		while (opStack.length > 0) {
			this.rpn.push(opStack.pop());
		}
		
	}
	createNumber(value) {
		return {type: Types.num, value: value};
	}
	addFunc(name, func, paramCount, priority) {
		this.funcNames.push(name);
		this.funcValues.push(func);
		if (!this.operators.includes(name)) {
			this.operators.push(name);
			this.opParamCount.push(paramCount);
			this.order.push(priority);
		}
	}
	actFunc(func, parameters) {
		var functionIndex = this.funcNames.indexOf(func.value);
		if (functionIndex === -1) {
			this.throwError("'" + func.value + "' not yet implemented");
			return [];
		}
		self = this;
		return this.funcValues[functionIndex](parameters);
	}
	evaluateRPN(rpn) {
		var stack = [];
		for (var i = 0; i < rpn.length; i++) {
			if (rpn[i].type === Types.op) {
				var count = this.opParamCount[this.operators.indexOf(rpn[i].value)];
				var parameters = [];
				for (var j = 0; j < count; j++) {
					parameters.unshift(stack.pop());
				}
				var result = this.actFunc(rpn[i], parameters);
				for (var j = 0; j < result.length; j++) {
					stack.push(result[j]);
				}
			} else {
				stack.push(rpn[i]);
			}
		}
		return stack;
	}
}




























