(function() {

    Rodin.WebGlShader = function(gl, vertex_shader_source, fragment_shader_source) {
    
        this.gl = gl;
        
        // compil shader
        var vertex_shader = this._compile_shader( vertex_shader_source, this.gl.VERTEX_SHADER );
        var fragment_shader = this._compile_shader( fragment_shader_source, this.gl.FRAGMENT_SHADER );
        this.shader_program = this._link_shader_program( vertex_shader, fragment_shader );
        
        // get vertex_position param index:
        gl.useProgram(this.shader_program);            
        this.vertex_position_attribute = gl.getAttribLocation(this.shader_program, "aVertexPosition");            
        gl.enableVertexAttribArray(this.vertex_position_attribute);
    }
    
    Rodin.WebGlShader.prototype = {
    
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
            
            return shader_program;
        },
        
        draw: function(webgl_vertices, projection_matrix, model_matrix) {
        
            var gl = this.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, webgl_vertices.buffer);
            gl.vertexAttribPointer(this.vertex_position_attribute, 3, gl.FLOAT, false, 0, 0);
            
            // set uniform matrix:
            var pUniform = gl.getUniformLocation(this.shader_program, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, projection_matrix);
            
            var mvUniform = gl.getUniformLocation(this.shader_program, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, model_matrix);
            
            // render !
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, webgl_vertices.length / 3);
        }

    }
    
    Rodin.WebGlVertices = function(gl, vertices) {
        
        this.gl = gl;
        this.length = vertices.length;
        
        this.buffer = gl.createBuffer();
        this.gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
    
    Rodin.WebGlVertices.prototype = {
    
    }
    
})()