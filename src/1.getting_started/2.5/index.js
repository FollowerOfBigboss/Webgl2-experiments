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
	
	const fragmentShader2Source = `#version 300 es
		precision highp float;
		out vec4 FragColor;
		void main() {
			FragColor = vec4(1.0, 1.0, 0.0, 1.0);
		}
	`;
	
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	const fragmentShaderOrange = gl.createShader(gl.FRAGMENT_SHADER);
	const fragmentShaderYellow = gl.createShader(gl.FRAGMENT_SHADER);
	var shaderProgramOrange = gl.createProgram();
	var shaderProgramYellow = gl.createProgram();
	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);
	gl.shaderSource(fragmentShaderOrange, fragmentShaderSource);
	gl.compileShader(fragmentShaderOrange);
	gl.shaderSource(fragmentShaderYellow, fragmentShader2Source);
	gl.compileShader(fragmentShaderYellow);
	// 	
	
	gl.attachShader(shaderProgramOrange, vertexShader);
	gl.attachShader(shaderProgramOrange, fragmentShaderOrange);
	gl.linkProgram(shaderProgramOrange);
	// 
	gl.attachShader(shaderProgramYellow, vertexShader);
	gl.attachShader(shaderProgramYellow, fragmentShaderYellow);
	gl.linkProgram(shaderProgramYellow);	

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
		
		gl.useProgram(shaderProgramOrange);
		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		gl.useProgram(shaderProgramYellow);
		gl.bindVertexArray(VAO2);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = main;
