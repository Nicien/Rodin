// MeshManipulator.js

(function() {

    
    Rodin.MeshManipulator = function() {
    
		this.indices = null; // Uint16Array
		this.vertices = null; // Float32Array
		this.normals = null; // Float32Array
		this.uvs = null; // Float32Array
    }
    
    
    Rodin.MeshManipulator.prototype = {
    
        set_arrays: function(indices, vertices, normals, uvs) {
		
			// convert classic array to webgl array:
			this.indices = new Uint16Array(indices);
			this.vertices = new Float32Array(vertices);
			this.normals = new Float32Array(normals);
			this.uvs = new Float32Array(uvs);
        },
		
		make_mesh_3d: function() {
		
			var mesh = new Rodin.Mesh3d();
			
			mesh.indices = new Rodin.WebGlIndices(this.indices);
			mesh.vertices = new Rodin.WebGlVertices(this.vertices);
			mesh.normals = new Rodin.WebGlVertices(this.normals);
			mesh.uvs = new Rodin.WebGlVertices(this.uvs);
			
			return mesh;
		},
		
		get_vertex: function(index, v3_out) {
		
			var float_index = index * 3;
			v3_out.set( this.vertices[float_index+0], this.vertices[float_index+1], this.vertices[float_index+2] );
		},
		
		get_normal: function(index, v3_out) {
		
			var float_index = index * 3;
			v3_out.set( this.normals[float_index+0], this.normals[float_index+1], this.normals[float_index+2] );
		},
		
		set_vertex: function(index, v3) {
		
			var float_index = index * 3;
			this.vertices[float_index+0] = n.x;
			this.vertices[float_index+1] = n.y;
			this.vertices[float_index+2] = n.z;
		},
		
		set_normal: function(index, n) {
		
			var float_index = index * 3;
			this.normals[float_index+0] = n.x;
			this.normals[float_index+1] = n.y;
			this.normals[float_index+2] = n.z;
		},
		
		recompute_normals: function() {
		
			this.normals = new Float32Array(this.vertices.length);
			
			var face_count = this.indices.length;
			// ASSERT( (face_count % 3) == 0 );
			face_count -= face_count % 3;
			
			var v0_index, v1_index, v2_index;
			var v0 = new Rodin.Vector3();
			var v1 = new Rodin.Vector3();
			var v2 = new Rodin.Vector3();
			var v1_v0 = new Rodin.Vector3();
			var v2_v0 = new Rodin.Vector3();
			var n = new Rodin.Vector3();
			
			var float_index;
			for (var face_index = 0; face_index != face_count; face_index += 3) {
				
				v0_index = this.indices[face_index+0];
				v1_index = this.indices[face_index+1];
				v2_index = this.indices[face_index+2];
				
				// get vertices:
				this.get_vertex(v0_index, v0);
				this.get_vertex(v1_index, v1);
				this.get_vertex(v2_index, v2);
				
				// Vector3 normal = (pt1 - pt0).crossProduct(pt2 - pt0);
				v1.sub(v0, v1_v0);
				v2.sub(v0, v2_v0);
				v1_v0.cross_product(v2_v0, n);
				
				n.normalize();
				
				this.set_normal(v0_index, n);
				this.set_normal(v1_index, n);
				this.set_normal(v2_index, n);
			}
		}
        
    }
    
})()