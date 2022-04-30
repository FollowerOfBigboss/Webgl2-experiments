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
	gl.enable(gl.DEPTH_TEST);

	var ourShader = new Shader(gl, "vertex", "fragment");

	var cameraPos = glMatrix.vec3.fromValues(0.0, 0.0, 3.0);
	var cameraFront = glMatrix.vec3.fromValues(0.0, 0.0, -1.0);
	var cameraUp = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
	
	var deltaTime = 0.0;
	var lastFrame = 0.0;
 
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
	
	const cubePositions = [
		glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
		glMatrix.vec3.fromValues(2.0, 5.0, -15.0),		
        	glMatrix.vec3.fromValues(-1.5, -2.2, -2.5),
        	glMatrix.vec3.fromValues(-3.8, -2.0, -12.3),
        	glMatrix.vec3.fromValues(2.4, -0.4, -3.5),
        	glMatrix.vec3.fromValues(-1.7, 3.0, -7.5),
        	glMatrix.vec3.fromValues(1.3, -2.0, -2.5),
        	glMatrix.vec3.fromValues(1.5, 2.0, -2.5),
        	glMatrix.vec3.fromValues(1.5,  0.2, -1.5),
        	glMatrix.vec3.fromValues(-1.3,  1.0, -1.5)				
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

	
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
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

		
//	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
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

	var yaw = -90.0;
	var pitch = 0;
	var fov = 45.0;	
	var mouseLocked = false;

	// https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript
	let keysPressed = {};
	document.addEventListener('keydown', (event) => {
                keysPressed[event.key] = true;
	});
	document.addEventListener('keyup', (event) => {
                keysPressed[event.key] = false;
	});

	// pointerlock things
	const pointerlockchangeexist = ("onpointerlockchange" in document)==true;
	if (pointerlockchangeexist) {
		document.addEventListener('pointerlockchange', () => {
			if(document.pointerLockElement === canvas) {
				mouseLocked = true;
    				// console.log('The pointer lock status is now locked');
  			} else {
				mouseLocked = false;
    				// console.log('The pointer lock status is now unlocked');
  			}
		}, false);
        }
	document.addEventListener('pointerlockerror', () => { 
		// console.log('Pointerlock failed!');
		mouseLocked = false; 
	}, false);
	
	canvas.onclick = function(event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		canvas.requestPointerLock();
		mouseLocked = true;	
	};
	
	canvas.addEventListener('wheel', (event) => {
		const wheelDelta = event.deltaY > 0 ? -1 : 1;
		fov -= wheelDelta;
		if (fov < 1.0) {
			fov = 1.0;
		} 
		if (fov > 45.0 ){
			fov = 45.0;
		}
	});

	document.addEventListener("mousemove", (event) => {	
		// No lock no processing
		if (mouseLocked != true)
			return;
		
		let xoffset = event.movementX;
		// Revert y axis
		let yoffset = -event.movementY;		

		const sensivity = 0.1;
		xoffset *= sensivity;
		yoffset *= sensivity;
	
		yaw   += xoffset;
		pitch += yoffset;
		
		if (pitch > 89.0) {
			pitch = 89.0;
		} 
		if (pitch < -89.0 ){
			pitch = -89.0;
		}
		
		const rYaw = glMatrix.glMatrix.toRadian(yaw);
		const rPitch = glMatrix.glMatrix.toRadian(pitch);

		const x = Math.cos(rYaw) * Math.cos(rPitch);
		const y = Math.sin(rPitch);
		const z = Math.sin(rYaw) * Math.cos(rPitch);
		
		let front = glMatrix.vec3.fromValues(x,y,z);
		glMatrix.vec3.normalize(cameraFront, front); 
	}, false);
   


 
	function processInput()
	{	
		var cameraSpeed = 2.5 * deltaTime;

		if (keysPressed['w'] === true) {
			let calc = glMatrix.vec3.create();
			glMatrix.vec3.scale(calc, cameraFront, cameraSpeed);
			glMatrix.vec3.add(cameraPos, cameraPos, calc);		
		}
		if (keysPressed['s'] === true) {
			let calc = glMatrix.vec3.create();
			glMatrix.vec3.scale(calc, cameraFront, cameraSpeed);
			glMatrix.vec3.subtract(cameraPos, cameraPos, calc);
		}
		if (keysPressed['a'] === true) {
			const cross = glMatrix.vec3.create();
			glMatrix.vec3.cross(cross, cameraFront, cameraUp);
			glMatrix.vec3.normalize(cross, cross);
			glMatrix.vec3.scale(cross, cross, cameraSpeed);
			glMatrix.vec3.subtract(cameraPos, cameraPos, cross);
		}
		if (keysPressed['d'] === true) {	
			const cross = glMatrix.vec3.create();
			glMatrix.vec3.cross(cross, cameraFront, cameraUp);
			glMatrix.vec3.normalize(cross, cross);
			glMatrix.vec3.scale(cross, cross, cameraSpeed);
			glMatrix.vec3.add(cameraPos, cameraPos, cross);
		}
	}

	function render(now)
	{
		const currentFrame = Date.now() / 1000;
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		processInput();

		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		
		ourShader.use();


		let projection = glMatrix.mat4.create();	
		glMatrix.mat4.perspective(projection, glMatrix.glMatrix.toRadian(fov), 800/600, 0.1, 100.0);
		ourShader.setMat4("projection", projection);
	
		let view  = glMatrix.mat4.create();
		var cv = glMatrix.vec3.create();
		glMatrix.vec3.add(cv, cameraPos, cameraFront)
		glMatrix.mat4.lookAt(view, cameraPos, cv, cameraUp);
		ourShader.setMat4("view", view);		
		
		gl.bindVertexArray(VAO);
		for (let i = 0; i < cubePositions.length; i++) {
			let model = glMatrix.mat4.create();
			glMatrix.mat4.translate(model, model, cubePositions[i]);
			let angle = 20.0 * i;
			
			glMatrix.mat4.rotate(model, model, glMatrix.glMatrix.toRadian(angle), glMatrix.vec3.fromValues(1.0, 0.3, 0.5));
			ourShader.setMat4("model", model);
			gl.drawArrays(gl.TRIANGLES, 0, 36);
		}
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
