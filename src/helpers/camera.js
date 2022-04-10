import './gl-matrix-min.js';

export const Camera_Movement = {
	FORWARD : 0,
	BACKWARD : 1,
	LEFT : 2,
	RIGHT : 3
};

const YAW = -90.0;
const PITCH = 0.0;
const SPEED = 2.5;
const SENSITIVITY = 0.1;
const ZOOM = 45.0;

export class Camera {
	
	Position;
	Front;
	Up;
	Right;
	WorldUp;
	Yaw;
	Pitch;
	MovementSpeed;
	MouseSensitivity;
	Zoom;

	constructor() { 
		/*
		this.Position = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
		this.Front = glMatrix.vec3.fromValues(0.0, 0.0, -1.0);
		this.Up = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);	
		this.WorldUp = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);	
		*/

		this.Position = 0;
		this.Front = glMatrix.vec3.create();
		this.Up = glMatrix.vec3.create();
		this.Right = glMatrix.vec3.create();
		this.WorldUp = 0;	

		this.Yaw = YAW;	
		this.Pitch = PITCH;
		this.MovementSpeed = SPEED;
		this.MouseSensitivity = SENSITIVITY;
		this.Zoom = ZOOM;		
	}

	init_1(position = glMatrix.vec3.fromValues(0.0, 0.0, 0.0), up = glMatrix.vec3.fromValues(0.0, 1.0, 0.0), yaw = YAW, pitch = PITCH) {
		this.Position = position;
		this.WorldUp = up;
		this.Yaw = yaw;
		this.Pitch = pitch;		
		this.updateCameraVectors();
	}
	
	init_2(posX, posY, posZ, upX, upY, upZ, yaw, pitch) {
		this.Position = glMatrix.vec3.fromValues(posX, posY, posZ);
		this.WorldUp = glMatrix.vec3.fromValues(upX, upY, upZ);
		this.Yaw = yaw;
		this.Pitch = pitch;
		this.updateCameraVectors();	
	}
	
	GetViewMatrix() {
		let sum = glMatrix.vec3.create();
		glMatrix.vec3.add(sum, this.Position, this.Front);
		let tmpmat4 = glMatrix.mat4.create();
		glMatrix.mat4.lookAt(tmpmat4, this.Position, sum, this.Up);
		return tmpmat4;
	}

	ProcessKeyboard(direction, deltaTime)
	{
		let velocity = this.MovementSpeed * deltaTime;
		if (direction == Camera_Movement.FORWARD) {
			let tmp = glMatrix.vec3.fromValues(velocity, velocity, velocity);
			glMatrix.vec3.mul(tmp, this.Front, tmp);
			glMatrix.vec3.add(this.Position, this.Position, tmp);
		}
		

		if (direction == Camera_Movement.BACKWARD) {
			let tmp = glMatrix.vec3.fromValues(velocity, velocity, velocity);
			glMatrix.vec3.mul(tmp, this.Front, tmp);
			glMatrix.vec3.sub(this.Position, this.Position, tmp);
		}

		if (direction == Camera_Movement.LEFT) {
			let tmp = glMatrix.vec3.fromValues(velocity, velocity, velocity);
			glMatrix.vec3.mul(tmp, this.Right, tmp);
			glMatrix.vec3.sub(this.Position, this.Position, tmp);
		}

		if (direction == Camera_Movement.RIGHT) {
			let tmp = glMatrix.vec3.fromValues(velocity, velocity, velocity);
			glMatrix.vec3.mul(tmp, this.Right, tmp);
			glMatrix.vec3.add(this.Position, this.Position, tmp);
		}
	}

	ProcessMouseMovement(xoffset, yoffset, constrainPitch = true) {
		xoffset *= this.MouseSensitivity;
		yoffset *= this.MouseSensitivity;

		this.Yaw += xoffset;
		this.Pitch += yoffset;

		if (constrainPitch) {
			if (this.Pitch > 89.0) {
				this.Pitch = 89.0;
			}
			
			if (this.Pitch < -89.0) {
				this.Pitch = -89.0;
			}
		}
		this.updateCameraVectors();
	}

	ProcessMouseScroll(yoffset) {
		this.Zoom -= yoffset;
		if (this.Zoom < 1.0) {
			this.Zoom = 1.0;
		}
		if (this.Zoom > 45.0) {
			this.Zoom = 45.0;
		}
	}
	
	updateCameraVectors() {
		const rYaw = glMatrix.glMatrix.toRadian(this.Yaw);
		const rPitch = glMatrix.glMatrix.toRadian(this.Pitch);

		let front = glMatrix.vec3.create();
		front[0] = Math.cos(rYaw) * Math.cos(rPitch);
		front[1] = Math.sin(rPitch);
		front[2] = Math.sin(rYaw) * Math.cos(rPitch);
		glMatrix.vec3.normalize(this.Front, front);
				
		let tmp = glMatrix.vec3.create();
		glMatrix.vec3.cross(tmp, this.Front, this.WorldUp);
		glMatrix.vec3.normalize(this.Right, tmp);

		glMatrix.vec3.cross(tmp, this.Right, this.Front);
		glMatrix.vec3.normalize(this.Up, tmp);
	}

}
