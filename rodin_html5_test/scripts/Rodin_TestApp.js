
(function() {

    Rodin.TestApp = function() {
    
        // browser compatibility: prevent chrome to show the text cursor during dragging:
        // (source: http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag )
        //document.getElementById("floorplan").onselectstart = function () { return false; };
        // TODO: n'appliquer onselectstart QUE sur le canvas ou le parent du canvas
        document.onselectstart = function() { return false; }
        
        // init viewport:
        this.gl_renderer = new Rodin.WebGlRenderer();
        if (this.gl_renderer.init( document.getElementById("viewport") ) == false) {
        
            alert("Could not initialise WebGL, sorry :-(");
        }
        this.init_test_rendering();
        
        // init scene:        
        //this.camera = new Rodin.Camera2d();
        
        this.tool_manager = new Rodin.ToolManager();
        this.tool_manager.j_canvas = $("#floorplan");
        
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
        
        // très important: permet d'éviter un scaling du bitmap et une perte de qualité
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
            //var canvas_j = $("#floorplan");
            this.scene.draw(context, this.viewport_size);
        },
        
        draw_viewport: function() {
        
            this.gl_renderer.prepare_rendering();
			
			var camera_transform = this.camera_viewport.get_transform(this.gl_renderer.viewport_width, this.gl_renderer.viewport_height);
            //this.shader_program.draw(this.square_vertices, camera_transform, this.square_transform);
			
			var context = { camera_transform:camera_transform };
			this.scene3d.draw(context);
        },
        
        init_test_rendering: function() {
            
			// initialize shaders:
			this.shaders = new Rodin.Shaders(this.gl_renderer.gl);
			this.shaders.load_all_shaders();
						
            this.camera_viewport = new Rodin.Camera3d();
            this.camera_viewport.eye.set(0, 0, -10);
            this.camera_viewport.center.set(0, 0, 1);
			
						
			// create scene and node:
			this.scene3d = new Rodin.Scene3d();
			var test_node = this.scene3d.root.add_child();
			
			
			// create content and mesh:
			var content3d = new Rodin.Content3d();
			content3d.mesh = new Rodin.Mesh3d();
			content3d.mesh.vertices = new Rodin.WebGlVertices(this.gl_renderer.gl, new Float32Array(
			[
                1.0,  1.0,  0.0,
                -1.0, 1.0,  0.0,
                1.0,  -1.0, 0.0,
                -1.0, -1.0, 0.0
            ] ) );
			
			content3d.shader = this.shaders.projection_plain_color;
			content3d.material = { r:0.5, g:1.0, b:0.4, a:0.5 };
			
			// add content to node:
			test_node.add_content(content3d);
			
			
			// -----------
			/*
            this.shader_program = new Rodin.WebGlShader
            (
                this.gl_renderer.gl,
                document.getElementById("vertex_shader").text,
                document.getElementById("frament_shader_red").text
            );
            

            var vertices = new Float32Array( [
                1.0,  1.0,  0.0,
                -1.0, 1.0,  0.0,
                1.0,  -1.0, 0.0,
                -1.0, -1.0, 0.0
            ] );
            
            this.square_vertices = new Rodin.WebGlVertices(gl, vertices);
            
            this.square_transform = Rodin.Mat4x4.make_translate(new Rodin.Vector3(0.5, 1.0, 0.0));
            */

            
        },
        
    }

})()