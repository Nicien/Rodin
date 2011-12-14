// class_template.js

(function() {
	
	// ---- nested class for each shader:
	Rodin.Shaders.Projection_PlainColor = function() {
		
		this.webgl_shader = new Rodin.WebGlShader(Rodin.Shaders.sources.vertex_shader_projection, Rodin.Shaders.sources.fragment_shader_plain_color);
		
		this.attribute_vertex_position_index = this.webgl_shader.get_attribute("a_position");
		this.uniform_transform_index = this.webgl_shader.get_uniform("u_transform");
		
		this.uniform_plain_color = this.webgl_shader.get_uniform("u_plain_color");
	}
	
	Rodin.Shaders.Projection_PlainColor.prototype = {
	
		draw: function(mesh, view_projection_mat4x4, normal_mat3x3, color) {
			
			var gl = Rodin.gl;
			
			gl.useProgram(this.webgl_shader.shader_program);
			
			// set vertex shader parameters:
			gl.uniformMatrix4fv(this.uniform_transform_index, false, view_projection_mat4x4.buffer);
			gl.uniform3f(this.uniform_plain_color, color.r, color.g, color.b);
			
			// enabled & bind attributes:
			gl.enableVertexAttribArray(this.attribute_vertex_position_index);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertices.buffer);
			gl.vertexAttribPointer(this.attribute_vertex_position_index, 3, gl.FLOAT, false, 0, 0);
			
			if (mesh.indices == null) {
			
				gl.drawArrays(mesh.vertices_type, 0, mesh.vertices.length / 3);	
			}
			else {
			
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices.buffer);
				gl.drawElements(mesh.vertices_type, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
			}
			
			gl.disableVertexAttribArray(this.attribute_vertex_position_index);
		}
	}
	
	
    
})()