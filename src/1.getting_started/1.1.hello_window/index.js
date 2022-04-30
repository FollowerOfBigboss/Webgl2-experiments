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
}

window.onload = main;
