
(function() {
    
	/*
		note: nodes can't be shared between different scenes
	*/
	// ---------------------- 
	
    Rodin.Scene3d = function() {
    
		this.root = new Rodin.Node3d();
		this.root.debug_name = 'root';
    }
    
    
    Rodin.Scene3d.prototype = {
    
        draw : function(renderer, context) {
            
			context.renderer = renderer;
			renderer.prepare_rendering();
			this.root.for_each_node(this, context);
        },
		
		// scene act as a renderer for now
		process_node_content : function(context, content3d, absolute_transform) {
		
			// TODO: scene_transform * node_transform
			content3d.shader.draw(content3d.mesh, context.camera_transform, content3d.shader_parameters);
		}
        
    }
	
	// ----------------------
	
	
    Rodin.Content3d = function() {

		this.mesh = null;
		this.shader = null;
		this.shader_parameters = null;
	}
	
	// ---------------------
		
    Rodin.Mesh3d = function() {
	
		// optional, if 'indices' is null gl.drawArrays is used, else gl.drawElements
		this.indices = null;  // Rodin.WebGlIndices
		
		// optional, if sub_mesh is null, the entire buffer is drawn.
		// Else use this format: [ {first:0, count:10}, {first:0, count:5} ];
		this.sub_mesh = null;
		
		
		this.vertices = null; // Rodin.WebGlVertices
		this.normals = null;  // Rodin.WebGlVertices
		this.uv = null;		  // Rodin.WebGlVertices
		this.colors = null;   // Rodin.WebGlVertices
		
		// POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN
		this.vertices_type = Rodin.gl.TRIANGLES;
	}
	
    Rodin.Mesh3d.prorotype = {
	
		//
	}
	
	
})()
