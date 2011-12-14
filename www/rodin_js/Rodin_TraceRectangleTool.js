 (function() {

    // Usage:
    //      'parent_node' must be set
    //      'origin_button_j' must be set
    Rodin.TraceRectangleTool = function() {
    
        this.parent_node = null;
        this.origin_button_j = null;
        
        this.target_node = null;
    }
    
    Rodin.TraceRectangleTool.prototype = {
		
    	accept_event: function(mouse_event) {
		
			return mouse_event.is_floorplan();
		},
		
        activate: function() {
            
            this.origin_button_j.addClass("trace_button_selected");
			Rodin.cursor_mgr.set_standard_cursor(Rodin.viewport_type.floorplan, 'crosshair');
        },
        
        desactivate: function() {
        
            this.origin_button_j.removeClass("trace_button_selected");
			Rodin.cursor_mgr.reset_cursor(Rodin.viewport_type.floorplan);
        },
        
        mouse_down: function(mouse_event) {
        
            this._update_cursor_position(mouse_event);
            
            this.target_node = this.parent_node.add_child();
            this.target_node.visible = false;
            
            var vertices_storage = this.target_node.vertices_storage;
            var f = vertices_storage.move_to(mouse_event.viewport_position);
            vertices_storage.line_to(f.x, 0);
            vertices_storage.line_to(0, 0);
            vertices_storage.line_to(0, f.y);
            
            vertices_storage.close_path();
            //vertices_storage.line_to(f);
        },
        
        mouse_move: function(mouse_event) {
        
            this._update_cursor_position(mouse_event);
            
            if (this.target_node != null) {
            
                this.target_node.visible = true;
                
                var vertices = this.target_node.vertices_storage.vertices;
                
                vertices[1].y = mouse_event.viewport_position.y;
                
                vertices[2].x = mouse_event.viewport_position.x;
                vertices[2].y = mouse_event.viewport_position.y;
                
                vertices[3].x = mouse_event.viewport_position.x;
            }
            
        },
        
        mouse_up: function(mouse_event) {
        
            this._update_cursor_position(mouse_event);
            
            this.target_node = null;
        },
        
        _update_cursor_position: function(mouse_event) {
        
            $("#mouse_position").html(Math.round(mouse_event.viewport_position.x) + ', ' + Math.round(mouse_event.viewport_position.y));
        }
        
    }
    
})()