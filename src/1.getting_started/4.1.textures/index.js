import {Shader} from './../../helpers/shader.js';

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2");
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	
	var ourShader = new Shader(gl, "vertex", "fragment");
			 
	const vertices = [
		 0.5,  0.5, 0.0,  1.0, 0.0, 0.0,  1.0, 1.0,
	 	 0.5, -0.5, 0.0,  0.0, 1.0, 0.0,  1.0, 0.0,
		-0.5, -0.5, 0.0,  0.0, 0.0, 1.0,  0.0, 0.0,
		-0.5,  0.5, 0.0,  1.0, 1.0, 0.0,  0.0, 1.0
	];

	const indices = [
		0, 1, 3,
		1, 2, 3
	];
	
	var VAO = gl.createVertexArray();
	var VBO = gl.createBuffer();
	var EBO = gl.createBuffer();

	gl.bindVertexArray(VAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);

	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(1);
	
	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(2);

	const texture = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	
	const level = 0;
  	const internalFormat = gl.RGBA;
  	const width = 1;
  	const height = 1;
  	const border = 0;
  	const srcFormat = gl.RGBA;
  	const srcType = gl.UNSIGNED_BYTE;
  	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  	const image = new Image();
  	image.onload = function() {
    		gl.bindTexture(gl.TEXTURE_2D, texture);
    		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
       		gl.generateMipmap(gl.TEXTURE_2D);
  	};
  	image.src = "../../tex/container.jpg";
	
	function render(now)
	{
		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);	

		gl.bindTexture(gl.TEXTURE_2D, texture);		
		ourShader.use();
		gl.bindVertexArray(VAO);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
