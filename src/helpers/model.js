
function GetLine(buffer, pos = 0) {
  const backupPos = pos;
  let i = backupPos;
  let line = "";
  while (buffer[i] != '\n') {
    line += buffer[i];
    i++;
  }
  return {str:line, diff:(i-backupPos)+1};
}

export class Model {
  constructor() {
    this.content = null;

    this.positions = [];
    this.texcoords = [];
    this.normals = [];

    this.indices = [];
    this.texindices = [];
    this.normindices = [];
 }
	
  getModelFromUrl(url , callback) {
    var request = new XMLHttpRequest();
    const bthis = this;

    request.addEventListener("load", function() {
      bthis.content = this.responseText;
      if (this.status == 200) {
        bthis.loadModel();
        callback(bthis);
      }
    });

    request.open("GET", url);
    request.send();
 }

 getModelFromBuffer(buffer) {
   this.content = buffer;
   this.loadModel();  
 }

  loadModel() {
    const contentLength = this.content.length;
    let i = 0;
 
    while (i < contentLength) {
      const line = GetLine(this.content, i);
      this.processTokens(line["str"]);
      i += line["diff"];
    }
  }

  processTokens(rawLine) {
    const tokens = rawLine.split(' ');
    const tokenCount = tokens.length;

    if (tokens[0] === 'v') {
      const positionCount = tokenCount - 1;
      if (positionCount > 3) {
        this.positions.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), parseFloat(tokens[4]));
      } 
      else { 
        this.positions.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
      }
    }
	
    if (tokens[0] === 'vt') {
      const texcoordsCount = tokenCount - 1;
      this.texcoords.push(parseFloat(tokens[1]), parseFloat(tokens[2]));
    }
 
    if (tokens[0] === 'vn') {
      this.normals.push(tokens[1], tokens[2], tokens[3]);
    }

    if (tokens[0] === 'f') {
      const indicesCount = tokenCount - 1;
      
      // (TODO): Triangulate square face
      if (indicesCount > 3) {
      }
      else {
        for (let i = 1; i < 4; i++) {
          const x = tokens[i].split('/');
          const l = x.length;
       					
          if (l === 1) {
            this.indices.push(x[0]-1);
          }
          if (l === 2) {	
            this.indices.push(x[0]-1);
            this.texindices.push(x[1]-1);
          }
          if (l === 3) {
            this.indices.push(x[0]-1);	
            this.texindices.push(x[1]-1);
            this.normindices.push(x[2]-1);
          }	
        }
      }
    }

    // Reindex faces?
   
  }
}


