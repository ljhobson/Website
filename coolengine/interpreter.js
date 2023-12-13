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
		this.order = [0,0,0,1,-2,2,2,2,2,2,2,3,3,-1,-1,-1];
		
		this.validDigits = ['0','1','2','3','4','5','6','7','8','9'];
		
		this.keywords = ['input','return','break','if','else','elseif','while','for','call','set','print','import'];

		
		this.stringToken = '"';
		this.stringEscapeChar = '\\';
		this.escapeFunction = function(char) {
			return char;
		}
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
}




























