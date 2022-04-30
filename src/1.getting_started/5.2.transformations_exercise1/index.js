import {Shader} from './../../helpers/shader.js';
import './../../helpers/gl-matrix-min.js';

function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2", { alpha: false });
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	var mixValue = 0.2;	
	var ourShader = new Shader(gl, "vertex", "fragment");
			 
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if (keyName === 'ArrowUp') {
			mixValue += 0.001;
			if (mixValue >= 1.0) {
				mixValue = 1.0;
			}	
			// console.log(mixValue);
		}
		
		if (keyName === 'ArrowDown') {
			mixValue -= 0.001;
			if (mixValue <= 0.0) {
				mixValue = 0.0;
			}
			// console.log(mixValue);
		}

	}, false);

	

	const vertices = [
		 0.5,  0.5, 0.0,  1.0, 1.0,
	 	 0.5, -0.5, 0.0,  1.0, 0.0,
		-0.5, -0.5, 0.0,  0.0, 0.0,
		-0.5,  0.5, 0.0,  0.0, 1.0
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
	
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);
	
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(1);

	const texture1 = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  	const image1 = new Image();
  	image1.src = "../../tex/container.jpg";
  	image1.onload = function() {
    		gl.bindTexture(gl.TEXTURE_2D, texture1);
    		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
       		gl.generateMipmap(gl.TEXTURE_2D);
  	};

		
	const texture2 = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture2);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  	const image2 = new Image();
  	image2.src = "../../tex/awesomeface.png";
  	image2.onload = function() {
    		gl.bindTexture(gl.TEXTURE_2D, texture2);
    		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
       		gl.generateMipmap(gl.TEXTURE_2D);
  	};
	
	ourShader.use();
	ourShader.setInt("texture1", 0);
	ourShader.setInt("texture2", 1);
		
	function render(now)
	{
		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);	

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		
		let transform = glMatrix.mat4.create();
		
		glMatrix.mat4.rotate(transform, transform, Date.now() / 1000, glMatrix.vec3.fromValues(0.0, 0.0, 1.0));	
		glMatrix.mat4.translate(transform, transform, glMatrix.vec3.fromValues(0.5, -0.5, 0.0));
		
		ourShader.use();
		const loc = gl.getUniformLocation(ourShader.program, "transform");	
		gl.uniformMatrix4fv(loc, false, transform);	
		
		gl.bindVertexArray(VAO);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
