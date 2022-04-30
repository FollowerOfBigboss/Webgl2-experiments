import {Shader} from './../../helpers/shader.js';

function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2");
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	
	var ourShader = new Shader(gl, "vertex", "fragment");
			 
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
		
		ourShader.use();
		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

window.onload = main;
