(function() {

	/*
		to change local transform
		node.local_transform
		node.update_absolute_transform();
	*/
    Rodin.Node3d = function() {
    
		this.parent = null;
		this.children = [];
		
		this.local_transform = new Rodin.Mat4x4();
		this.absolute_transform = new Rodin.Mat4x4();
		
		this.content_array = [];
    }
    
    Rodin.Node3d.prototype = {
		
		add_child : function() {
		
			var child = new Rodin.Node3d(this);
			child.set_parent(this);
			return child;
		},
		
		// 'new_parent' parameter can be null
		set_parent : function(new_parent) {
		
			if (new_parent != this.parent) {
			
				// detach from parent
				if (this.parent != null) {
				
					Rodin.assert(arr.indexOf(this) != -1);
					this.parent.children.splice(arr.indexOf(this), 1);
				}
				
				this.parent = new_parent;
				
				// attach to new parent:
				if (this.parent != null) {
				
					this.parent.children.push(this);
				}
				
				this._update_absolute_transform();
			}
		},
		
		set_local_transform : function(new_local_transform) {
		
			this.local_transform = new_local_transform;
			this._update_absolute_transform();
		},
		
		add_content : function(content) {
		
			this.content_array.push(content);
		},
		
		remove_content : function(content) {
		
			this.content_array.splice(arr.indexOf(content), 1);
		},
		
		_update_absolute_transform : function() {
		
			if (this.parent != null) {
				
				this.absolute_transform.set_multiply(this.parent.absolute_transform, this.local_transform);
			}
			else {
			
				this.absolute_transform.assign(this.local_transform);
			}
			
			// update children absolute transform:
			var children_count = this.children.length;
			for (var children_index = 0; children_index != children_count; ++children_index) {
			
				this.children[children_index]._update_absolute_transform();
			}
		},
		
        for_each_node : function(content_manipulator, context) {
		
			var content_count = this.content_array.length;
			for (var content_index = 0; content_index != content_count; ++content_index) {
				
				content_manipulator.process_node_content(context, this.content_array[content_index], this.absolute_transform);
			}
			
			// draw children:
			var children_count = this.children.length;
			for (var children_index = 0; children_index != children_count; ++children_index) {
			
				this.children[children_index].for_each_node(content_manipulator, context);
			}
        }
        
    }
    
})()