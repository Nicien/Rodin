
(function() {

	// TODO: le cache de la requ�te ajax est d�sactiv�
    
    Rodin.Object3dLoader = function(shaders) {
    
		this.shaders = shaders;
		this.current_ajax_request = null;
		this.loaded = null;
    }
    
    Rodin.Object3dLoader.prototype = {
    
        load_object3d: function(node_3d, object_name) {
            
			if (this.current_ajax_request != null) {
			
				this.current_ajax_request.abort();
				this.current_ajax_request = null;
			}
			
			var loader = this;
			this.current_ajax_request = $.ajax({
				url: '/obj_name/'+object_name,
				context: document.body,
				cache  : false,
				success: function(data, textStatus, jqXHR) { loader._on_mesh_download_success(node_3d, data, textStatus, jqXHR); },
				error  : function(jqXHR, textStatus, errorThrown) { loader._on_mesh_download_error(jqXHR, textStatus, errorThrown); }
			});
			
        },
		
		_on_mesh_download_success: function(node_3d, data, textStatus, jqXHR) {
		
			if (ajax_error !== false) {
			
				$( "div.log" ).text("server return error: "+ajax_error);
				return;
			}
			
			//console.log(data); //data returned
			//console.log(textStatus); //success
			
			var group_count = object3d.mesh_groups.length;
			for (var group_index=0; group_index != group_count; ++group_index) {
				
				var each_group = object3d.mesh_groups[group_index];
				
				var mesh_count = each_group.meshes.length;
				for (var mesh_index = 0; mesh_index != mesh_count; ++mesh_index) {
				
					var mesh = each_group.meshes[mesh_index];
					
					var mesh_manipulator = new Rodin.MeshManipulator();
					mesh_manipulator.set_arrays(mesh.indices, mesh.vertices, mesh.normals, mesh.uvs);
					
					mesh = null; // javascript garbage collector can release the mesh... we don't need it anymore
					
					// scale object
					var c = mesh_manipulator.vertices.length;
					for (var ii = 0; ii != c; ++ii) {
					
						mesh_manipulator.vertices[ii] /= 3.0;
					}
					
					// generate normals if needed:
					if (mesh_manipulator.normals.length == 0) {
					
						mesh_manipulator.recompute_normals();
					}
					// build a mesh:
					var content3d = new Rodin.Content3d();
					content3d.mesh = mesh_manipulator.make_mesh_3d();
					content3d.shader = this.shaders.soft_directional_lighting;
					content3d.shader_parameters = { r:1.0, g:0.2, b:0.2, a:1.0 };
					
					console.log('triangles length = '+mesh_manipulator.indices.length/3);
					console.log('vertices length = '+mesh_manipulator.vertices.length/3);
					console.log('normals length = '+mesh_manipulator.normals.length/3);
					console.log('textureCoords length = '+mesh_manipulator.uvs.length/2);
					
					node_3d.add_content(content3d);
				}
				
			}
			
			if (this.loaded != null) {
			
				this.loaded();
			}
			
		},
		
		_on_mesh_download_error: function(jqXHR, textStatus, errorThrown) {
		
			$( "div.log" ).text("ajax error: "+textStatus+' '+errorThrown);
			
			if (jqXHR == this.current_ajax_request) {
			
				this.current_ajax_request = null;
			}
		}
        
    }
    
})()