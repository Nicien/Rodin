 (function() {

    // Usage:
    //      'mode' mst be set
    //      'parent_node' must be set
    //      'origin_button_j' must be set
    Rodin.TraceLineTool = function() {
		
        this.mode = null;
        this.parent_node = null;
        this.origin_button_j = null;
        
        this.target_node = null;
        this.first_vertex = null;
        this.current_vertex = null;
    }
    
    Rodin.TraceLineTool.trace_mode = {
    
        segment     : 0,
        line        : 1
    }
    
    Rodin.TraceLineTool.prototype = {
    
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
        
            this.update_cursor_position(mouse_event);
            
            this.target_node = this.parent_node.add_child();
            this.first_vertex = this.target_node.vertices_storage.move_to(mouse_event.viewport_position);
            this.current_vertex = this.target_node.vertices_storage.line_to(mouse_event.viewport_position);
			
        },
        
        mouse_move: function(mouse_event) {

			
            this.update_cursor_position(mouse_event);
            
            if (this.target_node != null && this.current_vertex != null) {
            
                if (this.mode == Rodin.TraceLineTool.trace_mode.line) {
                
                    this.current_vertex = this.target_node.vertices_storage.line_to(mouse_event.viewport_position);
                }
                else if (this.mode == Rodin.TraceLineTool.trace_mode.segment) {
                
                    this.current_vertex.x = mouse_event.viewport_position.x;
                    this.current_vertex.y = mouse_event.viewport_position.y;
                }
                
            }
            
        },
        
        mouse_up: function(mouse_event) {
        
            this.update_cursor_position(mouse_event);
            
            this.first_vertex = null;
            this.current_vertex = null;
            this.target_node = null;
        },
        
        update_cursor_position: function(mouse_event) {
        
            $("#mouse_position").html(Math.round(mouse_event.viewport_position.x) + ', ' + Math.round(mouse_event.viewport_position.y));
        }
        
    }
    
})()