// class_template.js

(function() {

	// ---------------------- Content3d ---------------------
		
    Rodin.Content3d = function() {

		this.mesh = null;
		this.shader = null;
		this.shader_parameters = null;
	}
	
	// --------------------- Mesh3d ---------------------
		
    Rodin.Mesh3d = function() {
	
		// optional, if 'indices' is null gl.drawArrays is used, else gl.drawElements
		this.indices = null;  // Rodin.WebGlIndices
		
		// optional, if sub_mesh is null, the entire buffer is drawn.
		// Else use this format: [ {first:0, count:10}, {first:0, count:5} ];
		this.sub_mesh = null;
		
		
		this.vertices = null; // Rodin.WebGlVertices
		this.normals = null;  // Rodin.WebGlVertices
		this.uvs = null;		  // Rodin.WebGlVertices
		this.colors = null;   // Rodin.WebGlVertices
		
		// POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
		this.vertices_type = Rodin.gl.TRIANGLES;
	}
	
    Rodin.Mesh3d.prorotype = {
	
		//
	}
    
})()