(function() {	
	
    Rodin.WebGlShader = function(vertex_shader_source, fragment_shader_source) {
    
        // compil shader
        var vertex_shader = this._compile_shader( vertex_shader_source, Rodin.gl.VERTEX_SHADER );
        var fragment_shader = this._compile_shader( fragment_shader_source, Rodin.gl.FRAGMENT_SHADER );
        this.shader_program = this._link_shader_program( vertex_shader, fragment_shader );
        
        Rodin.gl.useProgram(this.shader_program);
        if (Rodin.gl.getError() != Rodin.gl.NO_ERROR) { alert(Rodin.gl.getError()); }
    }
    
    Rodin.WebGlShader.prototype = {
	
		get_and_active_attribute: function(attribute_name) {
		
			// get vertex_position parameter index
			var attribute_index = Rodin.gl.getAttribLocation(this.shader_program, attribute_name);            
			Rodin.gl.enableVertexAttribArray(attribute_index);
			return attribute_index;
		},
		
		get_uniform: function(uniform_name) {
		
			return Rodin.gl.getUniformLocation(this.shader_program, uniform_name);
		},
    
        _compile_shader: function(shader_source, shader_type) {
        
            var shader = Rodin.gl.createShader(shader_type);
            Rodin.gl.shaderSource(shader, shader_source);
            Rodin.gl.compileShader(shader);
            
            if (! Rodin.gl.getShaderParameter(shader, Rodin.gl.COMPILE_STATUS)) {
            
                var shater_type_str = (shader_type == Rodin.gl.VERTEX_SHADER) ? "vertex_shader" : "fragment_shader";
                alert("An error occurred compiling the shaders of type '" + shater_type_str + "' : " + Rodin.gl.getShaderInfoLog(shader) + "\n" + shader_source);
                Rodin.gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        },
        
        _link_shader_program: function(vertex_shader, fragment_shader) {
        
            var shader_program = Rodin.gl.createProgram();
            
            Rodin.gl.attachShader(shader_program, vertex_shader);
            Rodin.gl.attachShader(shader_program, fragment_shader);
            Rodin.gl.linkProgram(shader_program);
            
            if (!Rodin.gl.getProgramParameter(shader_program, Rodin.gl.LINK_STATUS)) {
                alert("Could not initialise shaders (link fail)");
            }
        
            return shader_program;
        }
		
    }
	
	
	// ---------------------------- Shaders
	
	Rodin.Shaders = function() {
	
	}
	
	Rodin.Shaders.prototype = {
	
		load_all_shaders: function() {
			
			Rodin.Shaders.sources = {
			
				vertex_shader_projection: document.getElementById("vertex_shader_projection").text,
				fragment_shader_plain_color: document.getElementById("frament_shader_plain_color").text
			}
			
			this.projection_plain_color = new Rodin.Shaders.Projection_PlainColor();
		}
		
	}
	
	// ---- nested class for each shader:
	Rodin.Shaders.Projection_PlainColor = function() {
		
		this.webgl_shader = new Rodin.WebGlShader(Rodin.Shaders.sources.vertex_shader_projection, Rodin.Shaders.sources.fragment_shader_plain_color);
		
		this.attribute_vertex_position_index = this.webgl_shader.get_and_active_attribute("a_vertex_position");
		this.uniform_transform_index = this.webgl_shader.get_uniform("u_transform");
		
		this.uniform_plain_color = this.webgl_shader.get_uniform("u_plain_color");
	}
	
	Rodin.Shaders.Projection_PlainColor.prototype = {
	
		draw: function(mesh, projection_mat4x4, color) {
			
			var gl = Rodin.gl;
			
			// set vertex shader parameters:
			gl.uniformMatrix4fv(this.uniform_transform_index, false, projection_mat4x4.buffer);
			gl.uniform3f(this.uniform_plain_color, color.r, color.g, color.b);
			
			// bind vertex buffer:
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertices.buffer);
			gl.vertexAttribPointer(this.attribute_vertex_position_index, 3, gl.FLOAT, false, 0, 0);
			
			if (mesh.indices == null) {
			
				gl.drawArrays(mesh.vertices_type, 0, mesh.vertices.length / 3);	
			}
			else {
			
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices.buffer);
				gl.drawElements(mesh.vertices_type, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
			}
		}
	}
	
})()

