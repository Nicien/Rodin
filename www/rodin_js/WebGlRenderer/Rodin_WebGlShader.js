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
	
		get_attribute: function(attribute_name) {
		
			// get vertex_position parameter index
			var attribute_index = Rodin.gl.getAttribLocation(this.shader_program, attribute_name);
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
            
			var link_status = Rodin.gl.getProgramParameter(shader_program, Rodin.gl.LINK_STATUS);
            if (!link_status) {
                alert("Could not initialise shaders (link fail):\n"+Rodin.gl.getProgramInfoLog(shader_program));
            }
        
            return shader_program;
        }
		
    }
	
	
})()

