function main() {
	const canvas = document.querySelector("#glctx");
	const gl = canvas.getContext("webgl2");
	
	if (gl == null)
	{
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	function render(now)
	{
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
		
//	gl.clearColor(0.0, 0.0, 0.0, 1.0);
//	gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;
