
(function() {

    Rodin.TestApp = function() {
    
        // browser compatibility: prevent chrome to show the text cursor during dragging:
        // (source: http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag )
        //document.getElementById("floorplan").onselectstart = function () { return false; };
        // TODO: n'appliquer onselectstart QUE sur le canvas ou le parent du canvas
        document.onselectstart = function() { return false; }
		
		// compatibility:
        window.requestAnimFrame = (function(){
            return window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
		
        
        // init 3d viewport
        this.gl_renderer = new Rodin.WebGlRenderer();
        if (this.gl_renderer.init( document.getElementById("viewport") ) == false) {
        
            alert("Could not initialise WebGL, sorry :-(");
        }        
        
        // initialize shaders:
        this.shaders = new Rodin.Shaders();
        this.shaders.load_all_shaders();
                    
        this.camera_viewport = new Rodin.Camera3d();
        this.camera_viewport.eye.set(0, 0, -10);
        this.camera_viewport.center.set(0, 0, 1);

        // init 2d canvas
        this.canvas = document.getElementById("floorplan");
        
        // très important: permet d'éviter un scaling du bitmap et une perte de qualité
        this.viewport_size = new Rodin.Vector2(this.canvas.clientWidth, this.canvas.clientHeight);
        this.canvas.width = this.viewport_size.x;
        this.canvas.height = this.viewport_size.y;
        
        //this.camera = new Rodin.Camera2d();
        this.scene = new Rodin.Scene();
        

        
        // init tools:        
        this.tool_manager = new Rodin.ToolManager();
        this.tool_manager.j_canvas = $("#floorplan");
        
        

        
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
        
        // fill 2d scene:
        var n = this.scene.root.add_child();
        n.vertices_storage.move_to(10, 1);
        n.vertices_storage.line_to(150, 100);
        n.vertices_storage.line_to(30, 50);
        n.vertices_storage.close_path();
        
        // fill 3d scene:
        
        // create scene and node:
        this.scene3d = new Rodin.Scene3d();
        var test_node = this.scene3d.root.add_child();
        
        // create content and mesh:
        var content3d = new Rodin.Content3d();
        content3d.mesh = new Rodin.Mesh3d();
		content3d.mesh.vertices_type = Rodin.gl.TRIANGLE_STRIP;
        content3d.mesh.vertices = new Rodin.WebGlVertices(new Float32Array(
        [
            1.0,  1.0,  0.0,
            -1.0, 1.0,  0.0,
            1.0,  -1.0, 0.0,
            -1.0, -1.0, 0.0
        ] ) );
		
        content3d.shader = this.shaders.projection_plain_color;
        content3d.shader_parameters = { r:0.5, g:1.0, b:0.4, a:0.5 };
        
        // add content to node:
        test_node.add_content(content3d);
		
		// build test scene:
		this.test_scene_materials = new Rodin.TestSceneMaterials(this.shaders);
		this.test_scene_materials.create_materials();
		
		// generate grid:
		var grid_generator = new Rodin.GridGenerator();		
		grid_generator.generate_mesh(this.test_scene_materials, test_node);
		
        this.animation_loop_closure = function() {
            
            app.animation_loop();
            window.requestAnimFrame(app.animation_loop_closure, document.getElementById("viewport"));
        }
		
        // start main loop:
        this.animation_loop_closure();
		
		this.refresh();
    }
    
    Rodin.TestApp.prototype = {
    
        refresh: function() {
        
			this.need_refresh_canvas = true;
			this.need_refresh_viewport = true;
        },
		
		refresh_canvas: function() {
		
			this.need_refresh_canvas = true;
		},
		
		refresh_viewport: function() {
		
			this.need_refresh_viewport = true;
		},

        animation_loop: function() {
        
            var current_time = (new Date).getTime();
            
            if (this.last_update_time != undefined) {
            
                var time_delta = current_time - this.last_update_time;			
				
				this.update_camera_positon(time_delta);
				
				if (this.need_refresh_canvas) {
					
					this.need_refresh_canvas = false;
					
					var context = document.getElementById("floorplan").getContext("2d");
					//var canvas_j = $("#floorplan");
					this.scene.draw(context, this.viewport_size);
				}
				
				if (this.need_refresh_viewport) {
				
					this.need_refresh_viewport = false;
					
					this.gl_renderer.prepare_rendering();
					
					var camera_transform = this.camera_viewport.get_transform(this.gl_renderer.viewport_width, this.gl_renderer.viewport_height);
					//this.shader_program.draw(this.square_vertices, camera_transform, this.square_transform);
					
					var context = { camera_transform:camera_transform };
					this.scene3d.draw(context);
				}
            }
            
            this.last_update_time = current_time;
        },
		
		update_camera_positon : function(time_delta) {
			
			if (this.camera_pos == undefined) { 
				this.camera_pos = 0;
			}
			
			// update camera:
			var camera_speed = 1 * 0.001;
			this.camera_pos -= camera_speed * time_delta;
			this.camera_viewport.eye.set(0, 0, this.camera_pos);
			this.camera_viewport.center.set(0, 0, 1);
					
			this.refresh_viewport();
		}

        
    }

})()