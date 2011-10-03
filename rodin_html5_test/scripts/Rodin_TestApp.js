
(function() {

    Rodin.TestApp = function() {
    
                
        // TODO: n'appliquer onselectstart QUE sur le canvas ou le parent du canvas
        // browser compatibility: prevent chrome to show the text cursor during dragging:
        // (source: http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag )
        //document.getElementById("floorplan").onselectstart = function () { return false; };
        document.onselectstart = function() { return false; }
            
        this.camera = new Rodin.Camera2d();
        
        this.tool_manager = new Rodin.ToolManager();
        this.tool_manager.j_canvas = $("floorplan");
        
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
        $("#trace_segment_button").click( function(event) {
        
            var tool = new Rodin.TraceLineTool();
            tool.parent_node = app.scene.root;
            tool.origin_button_j = $("#trace_segment_button");
            tool.mode = Rodin.TraceLineTool.trace_mode.segment;
            
            app.tool_manager.set_current_tool( tool );
            event.preventDefault();
        });
        
        $("#trace_line_button").click( function(event) {
        
            var tool = new Rodin.TraceLineTool();
            tool.parent_node = app.scene.root;
            tool.mode = Rodin.TraceLineTool.trace_mode.line;
            tool.origin_button_j = $("#trace_line_button");
            
            app.tool_manager.set_current_tool( tool );
            event.preventDefault();
        });
        
        $("#trace_rectangle_button").click( function(event) {
        
            var tool = new Rodin.TraceRectangleTool();
            tool.parent_node = app.scene.root;
            tool.origin_button_j = $("#trace_rectangle_button");
            
            app.tool_manager.set_current_tool( tool );
            event.preventDefault();
        });
        
        
        $("#stop_current_tool_button").click( function(event) {
        
            app.tool_manager.set_current_tool(null);
            event.preventDefault();
        });
        

        
        // fill scene:
        var n = this.scene.root.add_child();
        n.vertices_storage.move_to(10, 1);
        n.vertices_storage.line_to(150, 100);
        n.vertices_storage.line_to(30, 50);
        n.vertices_storage.close_path();
        
        
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
        
            this.draw_floorplan();
            this.draw_viewport();
        },
        
        draw_floorplan: function() {
        
            var context =  document.getElementById("floorplan").getContext("2d");
            var canvas_j = $("#floorplan");
            this.scene.draw(context, this.viewport_size);
            //this.scene.draw(context, canvas.clientWidth , canvas.clientHeight);
        },
        
        draw_viewport: function() {
        
            var canvas = document.getElementById("viewport");
            //this.init_gl(canvas);
            //initShaders();
            //initBuffers();
            //gl.clearColor(0.0, 0.0, 0.0, 1.0);
            //gl.enable(gl.DEPTH_TEST);
        },
        
        init_gl: function(canvas) {
        
            var gl = null;
            try {
                gl = canvas.getContext("experimental-webgl");
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
                
            } catch (e) {
            
            }
            if (!gl) {
                
                alert("Could not initialise WebGL, sorry :-(");
            }
            
            return gl;
        }
    }

})()