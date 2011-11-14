// class_template.js

(function() {

	// 'node' must be a Rodin.Node3d instance
    Rodin.GridGenerator = function() {
    
		this.nb_cell_x = 10;
		this.nb_cell_y = 10;
		this.cell_size = 1.0;
    }
    
    Rodin.GridGenerator.prototype = {
		
		// convert Array of Rodin.Vector3 into a Float32Array:
		vector3_array_to_float32_array : function(array_of_vector3) {
		
			var vertices_count = array_of_vector3.length;
			var float_array = new Float32Array(vertices_count * 3);
			
			// todo fill float_array
			var each_vertex = null;
			var float_index = 0;
			for (vertex_index = 0; vertex_index != vertices_count; ++vertex_index) {
			
				each_vertex = array_of_vector3[vertex_index];
				
				float_array[float_index++] = each_vertex.x;
				float_array[float_index++] = each_vertex.y;
				float_array[float_index++] = each_vertex.z;
			}
			
			return float_array;
		},
		
		// generate
        generate_mesh : function(test_scene_materials, node) {
			
			// number of vertices:
			var vertices = new Array();
			
			var vertex_count_x = this.nb_cell_x + 1;
			var vertex_count_y = this.nb_cell_y + 1;
			
			// center grid on 0,0
			var offset_x = (this.nb_cell_x * this.cell_size) / -2.0;
			var offset_y = (this.nb_cell_y * this.cell_size) / -2.0;
			
			// generate an array of vertices
			for (vertex_index_y = 0; vertex_index_y != vertex_count_y; ++vertex_index_y) {
			
				for (vertex_index_x = 0; vertex_index_x != vertex_count_x; ++vertex_index_x) {
				
					vertices.push(new Rodin.Vector3 (
						vertex_index_x*this.cell_size + offset_x,
						-2,
						vertex_index_y*this.cell_size +offset_y
					) );
				}
			}
			
			// TEMPORARY:
			var indexes_a = new Array();
			var indexes_b = new Array();
			
			// generate triangles:
			var v00, v01, v10, v11 = +1;
			
			
			var line_first_cell_color = false;
			for (cell_y_index = 0; cell_y_index != this.nb_cell_y; ++cell_y_index) {
			
				line_first_cell_color = ! line_first_cell_color;
				
				var cell_color = line_first_cell_color;
				
				for (cell_x_index = 0; cell_x_index != this.nb_cell_x; ++cell_x_index) {
				
					cell_color = ! cell_color;
					
					v00 = (vertex_count_y*cell_y_index) + cell_x_index;
					v01 = v00 + 1;
					v10 = v00 + vertex_count_y;
					v11 = v10 + 1;
					
					var indexes = (cell_color) ? indexes_a : indexes_b;
					
					// for now
					indexes.push(vertices[v00]);
					indexes.push(vertices[v01]);
					indexes.push(vertices[v10]);
					
					indexes.push(vertices[v10]);
					indexes.push(vertices[v01]);
					indexes.push(vertices[v11]);
				}
			}
			
			// test_scene_materials, node
			var grid_content_a = new Rodin.Content3d();
			var grid_content_b = new Rodin.Content3d();
			
			node.add_content(grid_content_a);
			node.add_content(grid_content_b);

			grid_content_a.shader = test_scene_materials.grid_shader;
			grid_content_b.shader = test_scene_materials.grid_shader;
			
			grid_content_a.shader_parameters = test_scene_materials.grid_color_a;
			grid_content_b.shader_parameters = test_scene_materials.grid_color_b;

			grid_content_a.mesh = new Rodin.Mesh3d();
			grid_content_b.mesh = new Rodin.Mesh3d();
			
			grid_content_a.mesh.vertices = new Rodin.WebGlVertices(this.vector3_array_to_float32_array(indexes_a) );
			grid_content_b.mesh.vertices = new Rodin.WebGlVertices(this.vector3_array_to_float32_array(indexes_b) );
        },
        
    }
    
})()