 (function() {

    // ----  
    // Usage: 'parent_node' must be set
    Rodin.TraceRectangleTool = function() {
    
        this.tracing = false;
        this.parent_node = null;
        
        this.target_node = null;
        this.first_point = null;
        this.current_point = null;
    }
    
    Rodin.TraceRectangleTool.prototype = {
    
        activate: function(mouse_event) {
            
            $("#trace_rectangle_button").addClass("trace_button_selected");
            $("#floorplan").css('cursor', 'crosshair');
        },
        
        desactivate: function(mouse_event) {
        
            $("#floorplan").css('cursor', '');
            $("#trace_rectangle_button").removeClass("trace_button_selected");
        },
        
        mouse_down: function(mouse_event) {
        
            $("#mouse_position").html(mouse_event.viewport_position.x + ', ' + mouse_event.viewport_position.y);
            
            this.target_node = this.parent_node.add_child();
            
            this.first_point = this.target_node.vertices.add_move_to(mouse_event.viewport_position.x, mouse_event.viewport_position.y);
            
            this.current_point = this.target_node.vertices.add_line_to(mouse_event.viewport_position.x, mouse_event.viewport_position.y);
        },
        
        mouse_move: function(mouse_event) {
        
            $("#mouse_position").html(mouse_event.viewport_position.x + ', ' + mouse_event.viewport_position.y);
            
            if (this.target_node != null && this.current_point != null) {
            
                this.current_point.x = mouse_event.viewport_position.x;
                this.current_point.y = mouse_event.viewport_position.y;
            }
        },
        
        mouse_up: function(mouse_event) {
        
            $("#mouse_position").html(mouse_event.viewport_position.x + ', ' + mouse_event.viewport_position.y);
            
            this.target_node.vertices.add_line_to(this.first_point.x, this.first_point.y);
            this.first_point = null;
            this.current_point = null;
            this.target_node = null;
        }
    }
    
})()