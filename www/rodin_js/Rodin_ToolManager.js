 (function() {

    // ---- class MouseEvent
    Rodin.MouseEvent = function(event, canvas_j) {
    
        this.event = event;
        
        var offset = canvas_j.offset();
        this.viewport_position = new Rodin.Vector2
        (
            event.pageX - offset.left,
            event.pageY - offset.top
        );
    }
    
    Rodin.MouseEvent.prototype = {
        
    }
    
    // ---- class ToolManager
    
    Rodin.ToolManager = function() {
        this.current_tool = null;
    }
    
    Rodin.ToolManager.prototype = {
    
        set_current_tool: function(tool) {
             this.desactive_current_tool();
             this.current_tool = tool;
             
             if (this.current_tool != null) {
                this.current_tool.activate();
             }
        },
        
        desactive_current_tool: function() {
            if (this.current_tool != null) {
                this.current_tool.desactivate();
            }
        },
        
        mouse_down: function(event, canvas_j) {
            if (this.current_tool != null) {
                this.current_tool.mouse_down(new Rodin.MouseEvent(event, canvas_j));
            }
        },
        
        mouse_move: function(event, canvas_j) {
            if (this.current_tool != null) {
                this.current_tool.mouse_move(new Rodin.MouseEvent(event, canvas_j));
            }
        },
        
        mouse_up: function(event, canvas_j) {
            if (this.current_tool != null) {
                this.current_tool.mouse_up(new Rodin.MouseEvent(event, canvas_j));
            }
        }
    }
    
    
})()