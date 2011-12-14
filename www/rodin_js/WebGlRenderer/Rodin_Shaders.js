// class_template.js

(function() {
	
	Rodin.Shaders = function() {
	
	}
	
	Rodin.Shaders.prototype = {
	
		load_all_shaders: function() {
			
			Rodin.Shaders.sources = {
			
				vertex_shader_projection: document.getElementById("vertex_shader_projection").text,
				fragment_shader_plain_color: document.getElementById("frament_shader_plain_color").text,
				
				vertex_shader_vertex_normal : document.getElementById("vertex_shader_vertex_normal").text,
				frament_shader_soft_directional_lighting : document.getElementById("frament_shader_soft_directional_lighting").text,
				
			}
			
			this.projection_plain_color = new Rodin.Shaders.Projection_PlainColor();
			this.soft_directional_lighting = new Rodin.Shaders.SoftDirectionalLighting();
		}
		
	}
    
})()