// class_template.js

(function() {

	// 'node' must be a Rodin.Node3d instance
    Rodin.GridGenerator = function() {
    
		this.nb_cell_x = 10;
		this.nb_cell_y = 10;
		this.cell_size = 1.0;
    }
    
    Rodin.GridGenerator.prototype = {
		
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
				
					vertices.push(vertex_index_x * this.cell_size + offset_x);
					vertices.push(0);
					vertices.push(vertex_index_y * this.cell_size + offset_y);
				}
			}
			
			var indexes_a = new Array();
			var indexes_b = new Array();
			
			// generate triangles:
			var v00, v01, v10, v11 = +1;
			
			
			var indexes = null;
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
					indexes.push(v00);
					indexes.push(v01);
					indexes.push(v10);
					
					indexes.push(v10);
					indexes.push(v01);
					indexes.push(v11);
				}
			}
			
			// test_scene_materials, node
			var grid_content_a = new Rodin.Content3d();
			var grid_content_b = new Rodin.Content3d();
			
			node.add_content(grid_content_a);
			//node.add_content(grid_content_b);

			grid_content_a.shader = test_scene_materials.grid_shader;
			grid_content_b.shader = test_scene_materials.grid_shader;
			
			grid_content_a.shader_parameters = test_scene_materials.grid_color_a;
			grid_content_b.shader_parameters = test_scene_materials.grid_color_b;

			grid_content_a.mesh = new Rodin.Mesh3d();
			grid_content_b.mesh = new Rodin.Mesh3d();
			
			// note: vertice buffer is shared
			var webgl_vertices =  new Rodin.WebGlVertices( new Float32Array(vertices) );
			grid_content_a.mesh.vertices = webgl_vertices;
			grid_content_a.mesh.indices = new Rodin.WebGlIndices( new Uint16Array(indexes_a) );
			
			grid_content_b.mesh.vertices = webgl_vertices;
			grid_content_b.mesh.indices = new Rodin.WebGlIndices( new Uint16Array(indexes_b) );
			
			var indices = grid_content_a
			[ {first:0, count:10}, {first:0, count:5} ];
			
        },
        
    }
    
})()