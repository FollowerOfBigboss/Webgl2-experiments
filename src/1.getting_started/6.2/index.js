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
	gl.enable(gl.DEPTH_TEST);

	var ourShader = new Shader(gl, "vertex", "fragment");
 
	const vertices = [
	  -0.5, -0.5, -0.5,  0.0, 0.0,
           0.5, -0.5, -0.5,  1.0, 0.0,
           0.5,  0.5, -0.5,  1.0, 1.0,
           0.5,  0.5, -0.5,  1.0, 1.0,
          -0.5,  0.5, -0.5,  0.0, 1.0,
          -0.5, -0.5, -0.5,  0.0, 0.0,
  
          -0.5, -0.5,  0.5,  0.0, 0.0,
           0.5, -0.5,  0.5,  1.0, 0.0,
           0.5,  0.5,  0.5,  1.0, 1.0,
           0.5,  0.5,  0.5,  1.0, 1.0,
          -0.5,  0.5,  0.5,  0.0, 1.0,
          -0.5, -0.5,  0.5,  0.0, 0.0,
  
          -0.5,  0.5,  0.5,  1.0, 0.0,
          -0.5,  0.5, -0.5,  1.0, 1.0,
          -0.5, -0.5, -0.5,  0.0, 1.0,
          -0.5, -0.5, -0.5,  0.0, 1.0,
          -0.5, -0.5,  0.5,  0.0, 0.0,
          -0.5,  0.5,  0.5,  1.0, 0.0,
  
           0.5,  0.5,  0.5,  1.0, 0.0,
           0.5,  0.5, -0.5,  1.0, 1.0,
           0.5, -0.5, -0.5,  0.0, 1.0,
           0.5, -0.5, -0.5,  0.0, 1.0,
           0.5, -0.5,  0.5,  0.0, 0.0,
           0.5,  0.5,  0.5,  1.0, 0.0,
  
          -0.5, -0.5, -0.5,  0.0, 1.0,
           0.5, -0.5, -0.5,  1.0, 1.0,
           0.5, -0.5,  0.5,  1.0, 0.0,
           0.5, -0.5,  0.5,  1.0, 0.0,
          -0.5, -0.5,  0.5,  0.0, 0.0,
          -0.5, -0.5, -0.5,  0.0, 1.0,
  
         -0.5,  0.5, -0.5,  0.0, 1.0,
          0.5,  0.5, -0.5,  1.0, 1.0,
          0.5,  0.5,  0.5,  1.0, 0.0,
          0.5,  0.5,  0.5,  1.0, 0.0,
         -0.5,  0.5,  0.5,  0.0, 0.0,
         -0.5,  0.5, -0.5,  0.0, 1.0	
	];
	
	var VAO = gl.createVertexArray();
	var VBO = gl.createBuffer();

	gl.bindVertexArray(VAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
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
		
		ourShader.use();

		let model = glMatrix.mat4.create();		
		let view  = glMatrix.mat4.create();
		let projection = glMatrix.mat4.create();
		glMatrix.mat4.rotate(model, model, Date.now() / 1000, glMatrix.vec3.fromValues(0.5, 1.0, 0.0));
		glMatrix.mat4.translate(view, view, glMatrix.vec3.fromValues(0.0, 0.0, -3.0));
		glMatrix.mat4.perspective(projection, glMatrix.glMatrix.toRadian(45.0), 800/600, 0.1, 100.0);
		
		const modelLoc = gl.getUniformLocation(ourShader.program, "model");	
		const viewLoc = gl.getUniformLocation(ourShader.program, "view");

		gl.uniformMatrix4fv(modelLoc, false, model);
		gl.uniformMatrix4fv(viewLoc, false, view);
		gl.uniformMatrix4fv(gl.getUniformLocation(ourShader.program, "projection"), false, projection);
	
		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
