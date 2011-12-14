 (function() {
 
    Rodin.MoveCameraTool = function() {
    
		this.cursor_open = Rodin.cursor_mgr.preload_cursor('cursor_hand_open.png');
		this.cursor_closed = Rodin.cursor_mgr.preload_cursor('cursor_hand_closed.png');
    }
    
    Rodin.MoveCameraTool.prototype = {
		
    	accept_event: function(mouse_event) {
		
			return mouse_event.is_floorplan() || mouse_event.is_viewport();
		},
		
        activate: function() {
            
			Rodin.cursor_mgr.set_cursor_uri(Rodin.viewport_type.floorplan, this.cursor_open);
        },
        
        desactivate: function() {
			
			Rodin.cursor_mgr.reset_cursor(Rodin.viewport_type.floorplan);
        },
        
        mouse_down: function(mouse_event) {
        
			Rodin.cursor_mgr.set_cursor_uri(Rodin.viewport_type.floorplan, this.cursor_closed);
        },
        
        mouse_move: function(mouse_event) {
        
            //mouse_event.viewport_position
        },
        
        mouse_up: function(mouse_event) {
        
			Rodin.cursor_mgr.set_cursor_uri(Rodin.viewport_type.floorplan, this.cursor_open);
        }
        
    }
    
})()