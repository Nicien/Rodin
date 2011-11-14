
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
    
        draw : function(context) {
            
			this.root.draw(context);
        }
        
    }
	
	// ----------------------
	
	
    Rodin.Content3d = function() {

		this.mesh = null;
		this.shader = null;
		this.shader_parameters = null;
	}
	
	Rodin.Content3d.prototype = {

		draw : function(context, node_transform) {
			
			// TODO: scene_transform * node_transform
			this.shader.draw(this.mesh, context.camera_transform, this.shader_parameters);
		}
		
	}
	
	// ---------------------
		
    Rodin.Mesh3d = function() {
	
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
