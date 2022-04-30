import {Shader} from './../../helpers/shader.js';
import {Camera, Camera_Movement} from './../../helpers/camera.js';
import './../../helpers/gl-matrix-min.js';

function loadTexture(gl, path) {

 	// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	const texture1 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture1);
 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

	const image1 = new Image();
	image1.src = path;
	image1.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
		gl.generateMipmap(gl.TEXTURE_2D);
	};

	return texture1;
}


function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2", { alpha: false });
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	var camera = new Camera();
	camera.init_1(glMatrix.vec3.fromValues(0.0, 0.0, 3.0));
	
	var deltaTime = 0.0;
	var lastFrame = 0.0;
 
	const vertices = [	
		// positions          // normals           // texture coords
		-0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,
		 0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  0.0,
		 0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
		 0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  1.0,  1.0,
		-0.5,  0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  1.0,
		-0.5, -0.5, -0.5,  0.0,  0.0, -1.0,  0.0,  0.0,

		-0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,
		 0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  0.0,
		 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
		 0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  1.0,  1.0,
		-0.5,  0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  1.0,
		-0.5, -0.5,  0.5,  0.0,  0.0,  1.0,  0.0,  0.0,

		-0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,
		-0.5,  0.5, -0.5, -1.0,  0.0,  0.0,  1.0,  1.0,
		-0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
		-0.5, -0.5, -0.5, -1.0,  0.0,  0.0,  0.0,  1.0,
		-0.5, -0.5,  0.5, -1.0,  0.0,  0.0,  0.0,  0.0,
		-0.5,  0.5,  0.5, -1.0,  0.0,  0.0,  1.0,  0.0,

		 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,
		 0.5,  0.5, -0.5,  1.0,  0.0,  0.0,  1.0,  1.0,
		 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
		 0.5, -0.5, -0.5,  1.0,  0.0,  0.0,  0.0,  1.0,
		 0.5, -0.5,  0.5,  1.0,  0.0,  0.0,  0.0,  0.0,
		 0.5,  0.5,  0.5,  1.0,  0.0,  0.0,  1.0,  0.0,

		-0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,
		 0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  1.0,  1.0,
		 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
		 0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  1.0,  0.0,
		-0.5, -0.5,  0.5,  0.0, -1.0,  0.0,  0.0,  0.0,
		-0.5, -0.5, -0.5,  0.0, -1.0,  0.0,  0.0,  1.0,

		-0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0,
		 0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  1.0,  1.0,
		 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
		 0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  1.0,  0.0,
		-0.5,  0.5,  0.5,  0.0,  1.0,  0.0,  0.0,  0.0,
		-0.5,  0.5, -0.5,  0.0,  1.0,  0.0,  0.0,  1.0
	];

	const cubePositions = [
		glMatrix.vec3.fromValues(0.0,  0.0,  0.0),	
		glMatrix.vec3.fromValues(2.0,  5.0, -15.0),
		glMatrix.vec3.fromValues(-1.5, -2.2, -2.5),
		glMatrix.vec3.fromValues(-3.8, -2.0, -12.3),
		glMatrix.vec3.fromValues(2.4, -0.4, -3.5),
		glMatrix.vec3.fromValues(-1.7,  3.0, -7.5),
		glMatrix.vec3.fromValues(1.3, -2.0, -2.5),
		glMatrix.vec3.fromValues(1.5,  2.0, -2.5),
		glMatrix.vec3.fromValues(1.5,  0.2, -1.5),
		glMatrix.vec3.fromValues(-1.3,  1.0, -1.5),
	];

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
		camera.ProcessMouseScroll(wheelDelta);
	});

	document.addEventListener("mousemove", (event) => {	
		// No lock no processing
		if (mouseLocked != true)
			return;
		
		let xoffset = event.movementX;
		// Revert y axis
		let yoffset = -event.movementY;		
		camera.ProcessMouseMovement(xoffset, yoffset);
		
	}, false);
    
	function processInput()
	{	
		if (keysPressed['w'] === true) { 
			camera.ProcessKeyboard(Camera_Movement.FORWARD, deltaTime);	
		}
		if (keysPressed['s'] === true) { 
			camera.ProcessKeyboard(Camera_Movement.BACKWARD, deltaTime);
		}
		if (keysPressed['a'] === true) {
			camera.ProcessKeyboard(Camera_Movement.LEFT, deltaTime);
		}
		if (keysPressed['d'] === true) {
			camera.ProcessKeyboard(Camera_Movement.RIGHT, deltaTime);
		}
	}


	gl.enable(gl.DEPTH_TEST);
	var lightingShader  = new Shader(gl, "lighting_casters_vs", "lighting_casters_fs");
	var lightCubeShader = new Shader(gl, "light_cube_vs", "light_cube_fs");

	var cubeVAO = gl.createVertexArray();
	var VBO = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);		

	gl.bindVertexArray(cubeVAO);

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);

	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(1);

	gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(2);
	
	var lightCubeVAO = gl.createVertexArray();
	gl.bindVertexArray(lightCubeVAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);

	const diffuseMap  = loadTexture(gl, "../../tex/container2.png");
	const specularMap = loadTexture(gl, "../../tex/container2_specular.png");

	lightingShader.use();
	lightingShader.setInt("material.diffuse", 0);
	lightingShader.setInt("material.specular", 1);
	
	var lightPos = glMatrix.vec3.fromValues(1.2, 1.0, 2.0);
	function render(now)
	{
		const currentFrame = Date.now() / 1000;
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		processInput();

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// be sure to activate shader when setting uniforms/drawing objects
		lightingShader.use();
		lightingShader.setVec3v("light.position", camera.Position);
		lightingShader.setVec3v("light.direction", camera.Front);
		lightingShader.setFloat("light.cutOff", Math.cos(glMatrix.glMatrix.toRadian(12.5)));
		lightingShader.setVec3v("viewPos", camera.Position);
		
		// light properties
		lightingShader.setVec3("light.ambient", 0.1, 0.1, 0.1);
		// we configure the diffuse intensity slightly higher; the right lighting conditions differ with each li    ghting method and environment.
		// each environment and lighting type requires some tweaking to get the best out of your environment.
		lightingShader.setVec3("light.diffuse", 0.8, 0.8, 0.8);
		lightingShader.setVec3("light.specular", 1.0, 1.0, 1.0);
		lightingShader.setFloat("light.constant", 1.0);
		lightingShader.setFloat("light.linear", 0.09);
		lightingShader.setFloat("light.quadratic", 0.032);

		// material properties
		lightingShader.setFloat("material.shininess", 32.0);
	
		let projection = glMatrix.mat4.create();
		glMatrix.mat4.perspective(projection, glMatrix.glMatrix.toRadian(camera.Zoom), 800/600, 0.1, 100.0);
		
		// view/projection transformations
		let view = camera.GetViewMatrix();
		lightingShader.setMat4("projection", projection);
		lightingShader.setMat4("view", view);
		
		// world transformation
		let model = glMatrix.mat4.create();
		lightingShader.setMat4("model", model);

		// bind diffuse map 
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, diffuseMap);
		// bind specular map
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, specularMap);
		
		gl.bindVertexArray(cubeVAO);	
		for (let i = 0; i < 10; i++) {
			// calculate the model matrix for each object and pass it to shader before drawing
			let model = glMatrix.mat4.create();
			glMatrix.mat4.translate(model, model, cubePositions[i]);
			let angle = 20.0 * i;
			glMatrix.mat4.rotate(model, model, glMatrix.glMatrix.toRadian(angle), glMatrix.vec3.fromValues(1.0, 0.3, 0.5));
			
			lightingShader.setMat4("model", model);
			gl.drawArrays(gl.TRIANGLES, 0, 36);
		}

		/*
		lightCubeShader.use();
		lightCubeShader.setMat4("projection", projection);
		lightCubeShader.setMat4("view", view);	
		glMatrix.mat4.translate(model, model, lightPos);
		glMatrix.mat4.scale(model, model, glMatrix.vec3.fromValues(0.2, 0.2, 0.2));
		lightCubeShader.setMat4("model", model);	
		gl.bindVertexArray(lightCubeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
		*/
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
