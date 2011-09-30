
(function() {

    Rodin.TestApp = function() {
    
        this.camera = new Rodin.Camera2d();
        
        this.tool_manager = new Rodin.ToolManager();
        this.tool_manager.j_canvas = $("floorplan");
        
        this.trace_tool = new Rodin.TraceRectangleTool();
        this.scene = new Rodin.Scene();
        
        var app = this;
        
         // ----- mouse event
         var floorplan_j = $("#floorplan");
         
        floorplan_j.mousedown( function(event) {
            app.tool_manager.mouse_down(event, floorplan_j);
            app.refresh();
        });
        
        floorplan_j.mousemove( function(event) {
            app.tool_manager.mouse_move(event, floorplan_j);
            app.refresh();
        });
        
        floorplan_j.mouseup( function(event) {
            app.tool_manager.mouse_up(event, floorplan_j);
            app.refresh();
        });
        
        // ----- tools
        $("#trace_rectangle_button").click( function(event) {
        
            app.tool_manager.set_current_tool(app.trace_tool);
            event.preventDefault();
        });
        
        $("#stop_current_tool_button").click( function(event) {
        
            app.tool_manager.set_current_tool(null);
        });
        
        // fill scene:
        var n = this.scene.root.add_child();
        n.vertices.add_move_to(10, 1);
        n.vertices.add_line_to(150, 100);
        n.vertices.add_line_to(30, 50);
        
        // init trace tool:
        this.trace_tool.parent_node = this.scene.root;
        
        // init canvas
        this.canvas = document.getElementById("floorplan");
        
        this.viewport_size = new Rodin.Vector2(this.canvas.clientWidth, this.canvas.clientHeight);
        // très important: permet d'éviter un scaling du bitmap donc une perte de qualité
        this.canvas.width = this.viewport_size.x;
        this.canvas.height = this.viewport_size.y;
        
        // render scene:
        this.refresh();
    }
    
    Rodin.TestApp.prototype = {
    
        refresh: function() {
        
            var context =  document.getElementById("floorplan").getContext("2d");
            
            var canvas_j = $("#floorplan");
            this.scene.draw(context, this.viewport_size);
            //this.scene.draw(context, canvas.clientWidth , canvas.clientHeight);
        }
        
    }

})()