import {Shader} from './../../helpers/shader.js';
import {Camera, Camera_Movement} from './../../helpers/camera.js';
import {Model} from './../../helpers/model.js';
import './../../helpers/gl-matrix-min.js';


var keysPressed = {};
var mouseLocked = false;
function GetGLContextAndRegisterEvents(CanvasId, MouseMoveEvent = null, WheelEvent = null) {
	const canvas = document.getElementById(CanvasId);
	const gl = canvas.getContext("webgl2", {alpha: false});	
	if (gl == null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return null;
	}

	// https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript
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
			mouseLocked = document.pointerLockElement === canvas ? true : false;
		}, false);
	}
	document.addEventListener('pointerlockerror', () => { 
		mouseLocked = false;
	}, false);

	
	canvas.onclick = function(event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		canvas.requestPointerLock();
		mouseLocked = true;
	};

	if (WheelEvent != null) {
		canvas.addEventListener('wheel', WheelEvent);
	}

	if (MouseMoveEvent != null) {
		document.addEventListener("mousemove", MouseMoveEvent, false);
	}
	
	return gl;
}

function loadTexture(gl, path, flipY = true) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
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



function processInput(camera) {	
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


var deltaTime = 0.0;
var lastFrame = 0.0;

var vertices;
var indices;

const buffer = `
# Blender v3.1.2 OBJ File: ''
# www.blender.org
o Cube_Cube.001
v -1.000000 -1.000000 1.000000
v -1.000000 1.000000 1.000000
v -1.000000 -0.221318 -1.000000
v -1.000000 0.221318 -1.000000
v 1.000000 -1.000000 1.000000
v 1.000000 1.000000 1.000000
v 1.000000 -0.221318 -1.000000
v 1.000000 0.221318 -1.000000
s off
f 2 3 1
f 4 7 3
f 8 5 7
f 6 1 5
f 7 1 3
f 4 6 8
f 2 4 3
f 4 8 7
f 8 6 5
f 6 2 1
f 7 5 1
f 4 2 6
`;


function main() {
	var camera = new Camera();
	camera.init_1(glMatrix.vec3.fromValues(0.0, 0.0, 3.0));
	
	const gl = GetGLContextAndRegisterEvents("glctx", (event) => {
		// No lock no processing
		if (mouseLocked != true)
			return;

		let xoffset = event.movementX;
		// Revert y axis
		let yoffset = -event.movementY;
		camera.ProcessMouseMovement(xoffset, yoffset);	
	}, (event) => {
		const wheelDelta = event.deltaY > 0 ? -1 : 1;
		camera.ProcessMouseScroll(wheelDelta);
	});
	
	var model = new Model();
	/*
	model.getModelFromBuffer(buffer);
	vertices = model.positions;
	indices = model.indices;
	*/
	
	gl.enable(gl.DEPTH_TEST);

	var ourShader = new Shader(gl, "vertex", "fragment");
	var VAO = gl.createVertexArray();
	var VBO = gl.createBuffer();
	var EBO = gl.createBuffer();

	var model = new Model();
	var loaded = false;
	model.getModelFromUrl("./backpack.obj", (tthis) => {
	
		vertices = tthis.positions;
		indices = tthis.indices;

		gl.bindVertexArray(VAO);
		gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(0);
		
		loaded = true;
	});
	
	/*
	gl.bindVertexArray(VAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(0);
    	*/
	function render(now)
	{
		const currentFrame = Date.now() / 1000;
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;
	
		processInput(camera);
		
		gl.clearColor(0.2, 0.3, 0.3, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		ourShader.use();


		let projection = glMatrix.mat4.create();
		glMatrix.mat4.perspective(projection, glMatrix.glMatrix.toRadian(camera.Zoom), 800/600, 0.1, 100.0);
		ourShader.setMat4("projection", projection);

		let view = camera.GetViewMatrix();
		ourShader.setMat4("view", view);
		let model = glMatrix.mat4.create();

		if (loaded) {
			gl.bindVertexArray(VAO);
			ourShader.setMat4("model", model);
			gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);	
		}

		requestAnimationFrame(render);	
	}
	requestAnimationFrame(render);
}

main();
