function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2");
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	const vertexShaderSource = `#version 300 es
		layout (location = 0) in vec3 aPos;
		void main() {
			gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
		}
	`;
	
	const fragmentShaderSource = `#version 300 es
		precision highp float;
		out vec4 FragColor;
		void main() {
			FragColor = vec4(1.0, 0.5, 0.2, 1.0);
		}
	`;
	
	const vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vertexShaderSource);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vshader));
		return;
	}

	const fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fragmentShaderSource);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fshader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("An error occurred compiling the program: " + gl.getProgramInfoLog(program));	
		return;
	}
	
	gl.deleteShader(vshader);
	gl.deleteShader(fshader);

	const firstTriangle = [
		-0.9, -0.5, 0.0,
		-0.0, -0.5, 0.0,
		-0.45, 0.5, 0.0,
	];

	const secondTriangle = [
		 0.0, -0.5, 0.0,
		 0.9, -0.5, 0.0,
		 0.45, 0.5, 0.0
	];
	
	var VAO = gl.createVertexArray();
	var VAO2 = gl.createVertexArray();
	var VBO = gl.createBuffer();
	var VBO2 = gl.createBuffer();

	gl.bindVertexArray(VAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangle), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);

	gl.bindVertexArray(VAO2);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondTriangle), gl.STATIC_DRAW);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(0);		

	function render(now)
	{
		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		gl.useProgram(program);

		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		gl.bindVertexArray(VAO2);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = main;
