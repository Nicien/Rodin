
// Test scene for Rodin Engine:
(function() {

    // ---- class Camera2d
    
    Rodin.Camera2d = function() {
    
        this.zoom = 1.0;
        this.translate = new Rodin.Vector2(0, 0);
    }
    
    Rodin.Camera2d.prototype = {
    
        transform: function(viewport_size_v2) {
        
            result = Matrix32.create_identity();
            result.multiply(Matrix32.create_translation(viewport_size_v2.x, viewport_size_v2.y));
            result.multiply(Matrix32.create_scaling(zoom, zoom));
            result.multiply(Matrix32.create_translation(this.translate.x, this.translate.y));
            return result;
        }
    }
    
    
    // ---- class Tool
    Rodin.TraceRectangleTool = function() {
    
        this.tracing = false;
        this.first_point = new Rodin.Vector2(0, 0);
    }
    
    Rodin.TraceRectangleTool.prototype = {
    
        activate: function() {
            
            Rodin.assert(! this.tracing);
        },
        
        desactivate: function() {
        
            
        },
        
        mouse_down: function(event) {
        
            //
        },
        
        mouse_move: function(event) {
        
            //
        },
        
        mouse_up: function(event) {
        
            //
        }
    }
    
    // ---- class ToolManager
    
    Rodin.ToolManager = function() {
    
        this.current_tool = null;
    }
    
    Rodin.ToolManager.prototype = {
    
        set_current_tool: function(tool) {
        
             this.desactive_current_tool();
             this.current_tool = tool;
             this.current_tool.activate();
        },
        
        desactive_current_tool: function() {
        
            if (this.current_tool != null)
            {
                this.current_tool.desactivate();
            }
        },
        
        mouse_down: function(event) {
        
            if (this.current_tool != null) this.current_tool.mouse_down(event);
        },
        
        mouse_move: function(event) {
        
            if (this.current_tool != null) this.current_tool.mouse_move(event);
        },
        
        mouse_up: function(event) {
        
            if (this.current_tool != null) this.current_tool.mouse_up(event);
        }
    }
    
    // ---- class ToolManager
    Rodin.Scene = function() {
    
        this.camera = new Rodin.Camera2d();
        this.tool_manager = new Rodin.ToolManager();
        this.trace_tool = new Rodin.TraceRectangleTool();
    }
    
    Rodin.Scene.prototype = {
    
    //
    }
    // --------------------
    //global vars
    Rodin.globals = {
    
        scene: new Rodin.Scene()
    }
    
    Rodin.initialize = function() {
    
        $("#floorplan").mousedown( function(event) {
        
            Rodin.globals.scene.tool_manager.mouse_down(event);
        });
        
        $("#floorplan").mousemove( function(event) {
        
            Rodin.globals.scene.tool_manager.mouse_move(event);
        });
        
        $("#floorplan").mouseup( function(event) {
        
            Rodin.globals.scene.tool_manager.mouse_up(event);
        });
    
        $("#trace_rectangle_button").click( function(event) {
            
            var scene = Rodin.globals.scene;
            scene.tool_manager.set_current_tool(scene.trace_tool);
            
            event.preventDefault();
        });
        
        //floorplan
        Rodin.draw_floorplan();
    }
    
    Rodin.draw_floorplan = function() {
        
        var canvas = document.getElementById("floorplan");
        var context = canvas.getContext("2d");
    }
    
})()
