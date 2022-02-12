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
		layout (location = 1) in vec3 aColor;
		out vec3 ourColor;
		void main() {
			gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
			ourColor = aColor;
		}
	`;
	
	const fragmentShaderSource = `#version 300 es
		precision highp float;
		out vec4 FragColor;
		in vec3 ourColor;
		void main() {
			FragColor = vec4(ourColor, 1.0);
		}
	`;
		
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	var shaderProgram = gl.createProgram();

	gl.shaderSource(vertexShader, vertexShaderSource);
	gl.compileShader(vertexShader);
	
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                  alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader));
                  return;
	}

	
	gl.shaderSource(fragmentShader, fragmentShaderSource);
	gl.compileShader(fragmentShader);
	
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                  alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader));
                  return;
	}
	
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("An error occurred compiling the program: " + gl.getProgramInfoLog(shaderProgram));
		return;
	}

 
	const firstTriangle = [
		 0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
	 	-0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
		 0.0,  0.5, 0.0, 0.0, 0.0, 1.0
	];
	
	var VAO = gl.createVertexArray();
	var VBO = gl.createBuffer();

	gl.bindVertexArray(VAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangle), gl.STATIC_DRAW);

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);

	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(1);

	function render(now)
	{
		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		gl.useProgram(shaderProgram);
		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = main;
