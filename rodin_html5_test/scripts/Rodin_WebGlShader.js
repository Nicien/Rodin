(function() {

    Rodin.WebGlShader = function(gl, vertex_shader_source, fragment_shader_source) {
    
        this.gl = gl;
        
        // compil shader
        var vertex_shader = this.compile_shader( vertex_shader_source, this.gl.VERTEX_SHADER );
        var fragment_shader = this.compile_shader( fragment_shader_source, this.gl.FRAGMENT_SHADER );
        this.shader_program = this.link_shader_program( vertex_shader, fragment_shader );
        
        // get vertex_position param index:
        gl.useProgram(this.shader_program);            
        this.vertex_position_attribute = gl.getAttribLocation(this.shader_program, "aVertexPosition");            
        gl.enableVertexAttribArray(this.vertex_position_attribute);
    }
    
    Rodin.WebGlShader.prototype = {
    
        compile_shader: function(shader_source, shader_type) {
        
            var shader = this.gl.createShader(shader_type);
            this.gl.shaderSource(shader, shader_source);
            this.gl.compileShader(shader);
            
            if (! this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            
                alert("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
                this.gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        },
        
        link_shader_program: function(vertex_shader, fragment_shader) {
        
            var shader_program = this.gl.createProgram();
            
            this.gl.attachShader(shader_program, vertex_shader);
            this.gl.attachShader(shader_program, fragment_shader);
            this.gl.linkProgram(shader_program);
            
            return shader_program;
        }

    }
    
})()