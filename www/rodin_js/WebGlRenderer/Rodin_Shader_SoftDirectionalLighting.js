// class_template.js

(function() {


	// ---------------------------- SoftDirectionalLighting Shader
	
	Rodin.Shaders.SoftDirectionalLighting = function() {
	
		this.webgl_shader = new Rodin.WebGlShader(Rodin.Shaders.sources.vertex_shader_vertex_normal, Rodin.Shaders.sources.frament_shader_soft_directional_lighting);
		
		this.uniform_plain_color = this.webgl_shader.get_uniform("u_plain_color");
		this.uniform_vertex_transform_index = this.webgl_shader.get_uniform("u_vertex_transform");
		this.uniform_normal_transform_index = this.webgl_shader.get_uniform("u_normal_transform");
		
		this.attribute_position_index = this.webgl_shader.get_attribute("a_position");
		this.attribute_normal_index = this.webgl_shader.get_attribute("a_normal");
	}
	
	Rodin.Shaders.SoftDirectionalLighting.prototype = {
	
		draw: function(mesh, view_projection_mat4x4, normal_mat3x3, color) {
			
			var gl = Rodin.gl;
			
			gl.useProgram(this.webgl_shader.shader_program);
			
			// set vertex shader parameters:
			gl.uniformMatrix4fv(this.uniform_vertex_transform_index, false, view_projection_mat4x4.buffer);
			gl.uniformMatrix3fv(this.uniform_normal_transform_index, false, normal_mat3x3.buffer);
			
			// set fragment shader parameters:
			gl.uniform3f(this.uniform_plain_color, color.r, color.g, color.b);
			
			// enabled & bind attributes:
			gl.enableVertexAttribArray(this.attribute_position_index);
			gl.enableVertexAttribArray(this.attribute_normal_index);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertices.buffer);
			gl.vertexAttribPointer(this.attribute_position_index, 3, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normals.buffer);
			gl.vertexAttribPointer(this.attribute_normal_index, 3, gl.FLOAT, false, 0, 0);
			
			if (mesh.indices == null) {
			
				gl.drawArrays(mesh.vertices_type, 0, mesh.vertices.length / 3);	
			}
			else {
			
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indices.buffer);
				gl.drawElements(mesh.vertices_type, mesh.indices.length, gl.UNSIGNED_SHORT, 0);				
			}
			
			gl.disableVertexAttribArray(this.attribute_position_index);
			gl.disableVertexAttribArray(this.attribute_normal_index);
		}
	}
})()