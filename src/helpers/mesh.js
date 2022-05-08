import './gl-matrix-min.js';

const {vec2, vec3} = glMatrix;


export class Vertex {	
	constructor() {
		this.Position = vec3.create();
		this.Normal = vec3.create();
		this.TexCoords = vec2.create();
	}
	length() {
		const PositionSize = this.Position.length * Float32Array.BYTES_PER_ELEMENT;
		const NormalSize = this.Normal.length * Float32Array.BYTES_PER_ELEMENT;
		const TexSize = this.TexCoords.length * Float32Array.BYTES_PER_ELEMENT;
		return (PositionSize + NormalSize + TexSize);
	}
	
	pack() {
		let packit = new Float32Array(8);
		packit.set(this.Position);
		packit.set(this.Normal, 3);
		packit.set(this.TexCoords, 6);
		return packit;
	}
}

export class Texture {
	constructor() {
		this.id = 0;
		this.type = "";
		this.path = "";
	}
}


export class Mesh {
	constructor(gl) {
		this.vertices = [];
		this.indices = [];
		this.textures = [];

		this.gl = gl;
		
		this.VAO = 0;
		this.VBO = 0;
		this.EBO = 0;
		this.setupMesh();
	}
	
	Draw() {
		
	}

	setupMesh() {
		this.VAO = this.gl.createVertexArray();
		this.VBO = this.gl.createBuffer();
		this.EBO = this.gl.createBuffer();

		this.gl.bindVertexArray(this.VAO);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
		/*
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(0);
		*/
		
	}

}
