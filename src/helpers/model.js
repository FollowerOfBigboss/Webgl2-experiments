function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

function ProcessLineNumbers(content, i) {
	let str = '';
	const bi = i;
	var cc = content[i];
	let numArr = [];
	while (cc != '\n') {
		cc = content[i];
		if ((cc >= '0' && cc <= '9') || cc=='.' || cc=='-') {
			str += cc;
		}
		if (cc == ' ') {
			if (str.length > 0) {
				numArr.push(parseFloat(str));
				str = '';
			}
		}
		i++;
	}
	if (str.length > 0) {
		numArr.push(parseFloat(str));
		str = '';
	}
	return numArr;
}

function ProcessToken(content, i) {
	const bi = i;
	var cc = content[i];
	let str = '';

	if (cc == ' ' || cc == '\n' || cc == '\t' || cc == '\r') {
		i++;
		return [str, (i-bi)];
	}

	while (cc != '\n') {
		cc = content[i];
		if (cc == ' ' || cc == '\t') {
			do {
				cc = content[i];
				i++;
			} while(cc != '\n');
			break;
		}
		str += cc;
		i++;
	}

	return [str, (i-bi)];
}

export class Model {
	constructor() {
		this.content = null;
		this.positions = [];
		this.indices = [];
	}
	
	getModelFromUrl(url /*, callback*/) {
		var request = new XMLHttpRequest();
		const bthis = this;
			request.addEventListener("load", function() {
			bthis.content = this.responseText;
			if (this.status == 200) {
				bthis.loadModel();
				//      callback(this.responseText);
			}
		});
		request.open("GET", url);
		request.send();
	}

	getModelFromBuffer(buffer) {
		this.content = buffer;
		this.loadModel();
	}

	loadModel() {
		let sLength = this.content.length;
		let i = 0;
 
		while (i < sLength) {
			let s = ProcessToken(this.content, i);
			if (s[0].length > 0) {
				if (s[0] === 'v') {
					let line = ProcessLineNumbers(this.content, i);
					this.positions.push(line[0], line[1], line[2]);
					// console.log(s[0], line);
				}
	
				if (s[0] === 'vt') {
					let line = ProcessLineNumbers(this.content, i);
					// console.log(s[0], line);
				}
 
				if (s[0] === 'vn') {
					let line = ProcessLineNumbers(this.content, i);
					// console.log(s[0], line);
				}

				if (s[0] === 'f') {
					let line = ProcessLineNumbers(this.content, i);
					this.indices.push(line[0], line[1], line[2], line[3]);
				}
			}
			i+=s[1];
		}
	}

}
                                                                                                                                                                                                                          
