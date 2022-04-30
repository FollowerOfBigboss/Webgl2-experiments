import {Shader} from './../../helpers/shader.js';
import {Camera, Camera_Movement} from './../../helpers/camera.js';
import './../../helpers/gl-matrix-min.js';

// https://stackoverflow.com/questions/9862761/how-to-check-if-character-is-a-letter-in-javascript
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
	return [numArr, (i-bi)];
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


class Model {
	constructor() {
		this.content = null;
		this.vertices = [];
	}
	
	getModelFromUrl(url /*, callback*/) {	
		var request = new XMLHttpRequest();
		const bthis = this;
		request.addEventListener("load", function() {	
			bthis.content = this.responseText;
			if (this.status == 200) {
				bthis.loadModel();
			//	callback(this.responseText);
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
				// console.log(s[0]);
				if (s[0] === 'v') {
			
				//	i+= s[0].length;
					let line = ProcessLineNumbers(this.content, i);
					console.log(s[0], line);
				}
				if (s[0] === 'vt') {
					let line = ProcessLineNumbers(this.content, i);
					console.log(s[0], line);
				}
				
			}
			// console.log(s[1]);
			i+=s[1];

			// const c = this.content[i];
			// const cn = this.content[i+1];
			// if (c == 'v' && cn == ' ') {
				/*
				let str = '';
				var cc = this.content[i];
				let numArr = [];
				while (cc != '\n') {
					cc = this.content[i];
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
				console.log(numArr);
				*/
			//	let g = ProcessLineNumbers(this.content,i);
			//	console.log(g[0]);
			//	i += g[1];
			// }
			//else {
			//	i++;
			//}
		}
	}
}




function main() {
	const url = "https://raw.githubusercontent.com/JoeyDeVries/LearnOpenGL/master/resources/objects/backpack/backpack.obj";
	// const url = "http://paulbourke.net/dataformats/obj/box.obj";

	const buffer = `
#	                Vertices: 8
#	                  Points: 0
#	                   Lines: 0
#	                   Faces: 6
#	               Materials: 1

o 1

# Vertex list

v -0.5 -0.5 0.5
v -0.5 -0.5 -0.5
v -0.5 0.5 -0.5
v -0.5 0.5 0.5
v 0.5 -0.5 0.5
v 0.5 -0.5 -0.5
v 0.5 0.5 -0.5
v 0.5 0.5 0.5

# Point/Line/Face list

usemtl Default
f 4 3 2 1
f 2 6 5 1
f 3 7 6 2
f 8 7 3 4
f 5 8 4 1
f 6 7 8 5

# End of file
`;

	var model = new Model();
	model.getModelFromUrl(url);
//	model.getModelFromBuffer(buffer);
}

main();
