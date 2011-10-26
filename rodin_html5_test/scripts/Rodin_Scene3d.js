
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
		this.material = null;
	}
	
	Rodin.Content3d.prototype = {

		draw : function(context, node_transform) {
			
			// TODO: scene_transform * node_transform
			this.shader.draw(this.mesh, context.camera_transform, this.material);
		}
		
	}
	
	// ---------------------
		
    Rodin.Mesh3d = function() {
	
		// todo: alloc Rodin.WebGlVertices
		this.vertices = null;
		this.normals = null;
		this.uv = null;
		this.colors = null;
	}
	
    Rodin.Mesh3d.prorotype = {
	
		//
	}
	
	
})()
