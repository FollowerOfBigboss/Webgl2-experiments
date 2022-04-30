import {Shader} from './../../helpers/shader.js';
import {Camera, Camera_Movement} from './../../helpers/camera.js';
import './../../helpers/gl-matrix-min.js';

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
		-0.5, -0.5, -0.5,
		0.5, -0.5, -0.5, 
		0.5,  0.5, -0.5, 
		0.5,  0.5, -0.5, 
		-0.5,  0.5, -0.5,
		-0.5, -0.5, -0.5,

		-0.5, -0.5,  0.5,
		0.5, -0.5,  0.5, 
		0.5,  0.5,  0.5, 
		0.5,  0.5,  0.5, 
		-0.5,  0.5,  0.5,
		-0.5, -0.5,  0.5,

		-0.5,  0.5,  0.5,
		-0.5,  0.5, -0.5,
		-0.5, -0.5, -0.5,
		-0.5, -0.5, -0.5,
		-0.5, -0.5,  0.5,
		-0.5,  0.5,  0.5,

		0.5,  0.5,  0.5, 
		0.5,  0.5, -0.5, 
		0.5, -0.5, -0.5, 
		0.5, -0.5, -0.5, 
		0.5, -0.5,  0.5, 
		0.5,  0.5,  0.5, 

		-0.5, -0.5, -0.5,
		0.5, -0.5, -0.5, 
		0.5, -0.5,  0.5, 
		0.5, -0.5,  0.5, 
		-0.5, -0.5,  0.5,
		-0.5, -0.5, -0.5,

		-0.5,  0.5, -0.5,
		0.5,  0.5, -0.5, 
		0.5,  0.5,  0.5, 
		0.5,  0.5,  0.5, 
		-0.5,  0.5,  0.5,
		-0.5,  0.5, -0.5,
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
	var lightingShader  = new Shader(gl, "colors_vs", "colors_fs");
	var lightCubeShader = new Shader(gl, "light_cube_vs", "light_cube_fs");

	var cubeVAO = gl.createVertexArray();
	var VBO = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);		

	gl.bindVertexArray(cubeVAO);

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);
	
	var lightCubeVAO = gl.createVertexArray();
	gl.bindVertexArray(lightCubeVAO);

	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);	

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);


	var lightPos = glMatrix.vec3.fromValues(1.2, 1.0, 2.0);
	function render(now)
	{
		const currentFrame = Date.now() / 1000;
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		processInput();

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	

		lightingShader.use();
		lightingShader.setVec3("objectColor", 1.0, 0.5, 0.31);
		lightingShader.setVec3("lightColor" , 1.0, 1.0, 1.0);

		let projection = glMatrix.mat4.create();	
		glMatrix.mat4.perspective(projection, glMatrix.glMatrix.toRadian(camera.Zoom), 800/600, 0.1, 100.0);	
		let view = camera.GetViewMatrix();
		lightingShader.setMat4("projection", projection);
		lightingShader.setMat4("view", view);
		
		let model = glMatrix.mat4.create();
		lightingShader.setMat4("model", model);

		gl.bindVertexArray(cubeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	
		lightCubeShader.use();
		lightCubeShader.setMat4("projection", projection);
		lightCubeShader.setMat4("view", view);	
		glMatrix.mat4.translate(model, model, lightPos);
		glMatrix.mat4.scale(model, model, glMatrix.vec3.fromValues(0.2, 0.2, 0.2));
		lightCubeShader.setMat4("model", model);	
		gl.bindVertexArray(lightCubeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();
