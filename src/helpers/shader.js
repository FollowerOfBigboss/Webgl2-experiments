export class Shader
{
	gl;
	program;
	constructor(gl, vertexShaderID, fragmentShaderID) {
		const vs = document.getElementById(vertexShaderID);
		const fs = document.getElementById(fragmentShaderID);
		this.gl = gl;	
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
          	this.gl.shaderSource(vertexShader, vs.text);
          	this.gl.compileShader(vertexShader);
   		this.checkCompileErrors(vertexShader);
	
          	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          	this.gl.shaderSource(fragmentShader, fs.text);
          	this.gl.compileShader(fragmentShader);
 		this.checkCompileErrors(fragmentShader); 
		  
          	this.program = this.gl.createProgram();
          	this.gl.attachShader(this.program, vertexShader);
          	this.gl.attachShader(this.program, fragmentShader);
          	this.gl.linkProgram(this.program);
		this.checkCompileErrors(this.program, true);
		
		this.gl.deleteShader(vertexShader);
		this.gl.deleteShader(fragmentShader);
	}
	
	use() {
		this.gl.useProgram(this.program);

	}
	
	setBool(name, value) {
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform1i(loc, value);				
	}
	
	setInt(name, value) {
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform1i(loc, value);				
	}
	
	setFloat(name, value) {
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform1f(loc, value);				
	}
	
	setVec3(name, x, y, z) {
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform3f(loc, x, y, z);
	}

	setVec3v(name, vec) {
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniform3f(loc, vec[0], vec[1], vec[2]);
	}
	
	setMat4(name, value){
		const loc = this.gl.getUniformLocation(this.program, name);
		this.gl.uniformMatrix4fv(loc, false, value);
	}


	checkCompileErrors(shader, isItProgram = false) {
		if (isItProgram == false) {
			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                		alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
          		}
		}
		else {
			if (!this.gl.getProgramParameter(shader, this.gl.LINK_STATUS)) {
                  		alert("An error occurred compiling the program: " + this.gl.getProgramInfoLog(shaderProgram));
          		}
		}
	}
}
