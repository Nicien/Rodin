
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
		process_node_content : function(context, content3d, model_transform) {
		
			// TODO: context.camera_transform * model_transform
			var view_transform = context.camera_transform;
			
			var normal_transform = Rodin.Scene3d.make_normal_transform(model_transform);
		
			content3d.shader.draw(content3d.mesh, view_transform, normal_transform, content3d.shader_parameters);
		}
        
    }
	
    Rodin.Scene3d._tmp_mat_3x3 = { buffer : new Float32Array(3*3) }
	
	Rodin.Scene3d.make_normal_transform = function(model_transform) {
	
		// Doc: http://learningwebgl.com/blog/?p=3322
		// Dans les commentaires, il y a TOUT sur les matrices de transformations de normals:
		// en bref, si model_transform n'a pas de scaling ou un scalng uniform:
		// 	- option1: modifier le shader: vec4 transformedNormal = uMVMatrix * vec4(aVertexNormal, 0.0);
		//  - option2: simplement extraire la matrice 3x3
		// si model_transform a un scaling non uniform:
		//  - extraire la matrice 3x3, puis inverse et transpose
		
		var mat3x3 = Rodin.Scene3d._tmp_mat_3x3;
		
		var r = mat3x3.buffer;
		var m = model_transform.buffer;
		
		r[0] = m[0]; r[1] = m[1]; r[2] = m[2];
		r[3] = m[4]; r[4] = m[5]; r[5] = m[6];
		r[6] = m[8]; r[7] = m[9]; r[8] = m[10];
		
		// TODO: inverse + transpose
		return mat3x3;
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
