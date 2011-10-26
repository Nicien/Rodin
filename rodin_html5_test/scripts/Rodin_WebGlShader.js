(function() {	
	
    Rodin.WebGlShader = function(gl, vertex_shader_source, fragment_shader_source) {
    
        this.gl = gl;
        
        // compil shader
        var vertex_shader = this._compile_shader( vertex_shader_source, this.gl.VERTEX_SHADER );
        var fragment_shader = this._compile_shader( fragment_shader_source, this.gl.FRAGMENT_SHADER );
        this.shader_program = this._link_shader_program( vertex_shader, fragment_shader );
        
        gl.useProgram(this.shader_program);
        if (this.gl.getError() != this.gl.NO_ERROR) { alert(this.gl.getError()); }
    }
    
    Rodin.WebGlShader.prototype = {
	
		get_and_active_attribute: function(attribute_name) {
		
			// get vertex_position parameter index
			var attribute_index = this.gl.getAttribLocation(this.shader_program, attribute_name);            
			this.gl.enableVertexAttribArray(attribute_index);
			return attribute_index;
		},
		
		get_uniform: function(uniform_name) {
		
			return this.gl.getUniformLocation(this.shader_program, uniform_name);
		},
    
        _compile_shader: function(shader_source, shader_type) {
        
            var shader = this.gl.createShader(shader_type);
            this.gl.shaderSource(shader, shader_source);
            this.gl.compileShader(shader);
            
            if (! this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            
                var shater_type_str = (shader_type == this.gl.VERTEX_SHADER) ? "vertex_shader" : "fragment_shader";
                alert("An error occurred compiling the shaders of type '" + shater_type_str + "' : " + this.gl.getShaderInfoLog(shader) + "\n" + shader_source);
                this.gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        },
        
        _link_shader_program: function(vertex_shader, fragment_shader) {
        
            var shader_program = this.gl.createProgram();
            
            this.gl.attachShader(shader_program, vertex_shader);
            this.gl.attachShader(shader_program, fragment_shader);
            this.gl.linkProgram(shader_program);
            
            if (!this.gl.getProgramParameter(shader_program, this.gl.LINK_STATUS)) {
                alert("Could not initialise shaders (link fail)");
            }
        
            return shader_program;
        }
		
    }
	
	
	// ---------------------------- Shaders
	
	Rodin.Shaders = function(gl) {
	
		this.gl = gl;
	}
	
	Rodin.Shaders.prototype = {
	
		load_all_shaders: function() {
			
			Rodin.Shaders.sources = {
			
				vertex_shader_projection: document.getElementById("vertex_shader_projection").text,
				fragment_shader_plain_color: document.getElementById("frament_shader_plain_color").text
			}
			
			this.projection_plain_color = new Rodin.Shaders.Projection_PlainColor(this.gl);
		}
		
	}
	
	// ---- nested class for each shader:
	Rodin.Shaders.Projection_PlainColor = function(gl) {
		
		this.gl = gl;
		this.webgl_shader = new Rodin.WebGlShader(this.gl, Rodin.Shaders.sources.vertex_shader_projection, Rodin.Shaders.sources.fragment_shader_plain_color);
		
		this.attribute_vertex_position_index = this.webgl_shader.get_and_active_attribute("a_vertex_position");
		this.uniform_transform_index = this.webgl_shader.get_uniform("u_transform");
		
		this.uniform_plain_color = this.webgl_shader.get_uniform("u_plain_color");
	}
	
	Rodin.Shaders.Projection_PlainColor.prototype = {
	
		draw: function(mesh, projection_mat4x4, color) {
			
			var gl = this.gl;
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertices.buffer);
			
			gl.vertexAttribPointer(this.attribute_vertex_position_index, 3, gl.FLOAT, false, 0, 0);
			
			gl.uniformMatrix4fv(this.uniform_transform_index, false, projection_mat4x4.buffer);
			gl.uniform3f(this.uniform_plain_color, color.r, color.g, color.b);
			
			// render !
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, mesh.vertices.length / 3);
		}
	}
	
	
	
	// ---------------------------- WebGlVertices
	
    Rodin.WebGlVertices = function(gl, vertices) {
        
        this.gl = gl;
        this.length = vertices.length;
        
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    }
    
    Rodin.WebGlVertices.prototype = {
    
    }
	
})()

