
(function () {
    
    // ------ Vertex2Cmd
    Rodin.Vertex2Cmd = function(cmd, x, y) {
    
        this.cmd = cmd;
        this.x = x;
        this.y = y;
    }
    
    // ------ Rodin
    Rodin.VerticesStorage = function() {
    
        this.vertices = [];
    }
    
    Rodin.VerticesStorage.prototype = {
    
        is_empty: function() {
        
            return this.vertices.length == 0;
        },
        
        add: function(cmd, x_or_v2, y) {
        
            var vertex_cmd =
                //(x instanceof Rodin.Vector2) ?
                (y === undefined) ?
                new Rodin.Vertex2Cmd(cmd, x_or_v2.x, x_or_v2.y) :
                new Rodin.Vertex2Cmd(cmd, x_or_v2, y);
            
            this.vertices.push(vertex_cmd);
            return vertex_cmd;
        },
        
        move_to: function(x_or_v2, y) {
            
            return this.add(Rodin.VerticesStorage.command.move_to, x_or_v2, y);
        },
        
        line_to: function(x_or_v2, y) {
            
            return this.add(Rodin.VerticesStorage.command.line_to, x_or_v2, y);
        },
        
        close_path: function() {
        
            return this.add(Rodin.VerticesStorage.command.close_path, 0, 0);
        },
        
        add_path_to_context: function(context) {
        
            context.beginPath();
            
            var vertex_cmd = null;
            var size = this.vertices.length;
            for (var index = 0; index != size; ++index) {
            
                vertex_cmd = this.vertices[index];
                if (vertex_cmd.cmd == Rodin.VerticesStorage.command.line_to) { // there is more line_to than move_to
                
                    context.lineTo(vertex_cmd.x, vertex_cmd.y);
                    //context.lineTo(Math.round(vertex_cmd.x)+0.5, Math.round(vertex_cmd.y)+0.5);
                }
                else if (vertex_cmd.cmd == Rodin.VerticesStorage.command.move_to) {
                
                    context.moveTo(vertex_cmd.x, vertex_cmd.y);
                    //context.moveTo(Math.round(vertex_cmd.x)+0.5, Math.round(vertex_cmd.y)+0.5);
                }
                else if (vertex_cmd.cmd == Rodin.VerticesStorage.command.close_path) {
                
                    context.closePath();
                }
            }
        }
        
    }
    
    Rodin.VerticesStorage.command = {
    
        move_to     : 0,
        line_to     : 1,
        close_path  : 2
    }

    
    // ------ Node
    Rodin.Node = function() {
    
        this.transform = Rodin.Matrix32.create_identity();
        this.vertices_storage = new Rodin.VerticesStorage();
        this.children = [];
        this.visible = true;
    }
    
    Rodin.Node.prototype = {
    
        add_child: function() {
        
            var node = new Rodin.Node();
            this.children.push(node);
            return node;
        },
        
        draw: function(context) {
        
            if (this.visible && ! this.vertices_storage.is_empty()) {
            
                context.save();
                
                this.vertices_storage.add_path_to_context(context);
                
                //context.globalAlpha = 0.5;
                //context.fill();
                
                //context.globalAlpha = 1.0;
                context.stroke();
                
                context.restore();
            }

            // draw children:
            var size = this.children.length;
            for (var index = 0; index != size; ++index) {
            
                this.children[index].draw(context);
            }
        }
    }
    
    // ------ Scene
    Rodin.Scene = function() {
        
        this.root = new Rodin.Node();
    }
    
    Rodin.Scene.prototype = {
    
        draw: function(context, viewport_size) {
            
            context.fillStyle = "#fff";
            context.fillRect(0, 0, viewport_size.x, viewport_size.y);
            
            context.fillStyle = "#33a";
            context.strokeStyle = "#444";
            this.root.draw(context);
        }
    }
    
    /*
    Rodin.draw_floorplan = function() {
        
        var canvas = document.getElementById("floorplan");
        var context = canvas.getContext("2d");
    }
    */
})()
