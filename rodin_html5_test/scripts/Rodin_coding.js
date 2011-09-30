
(function () {
    
    // ------ Vertex2Cmd
    Rodin.Vertex2Cmd = function(x, y, cmd) {
    
        this.x = x;
        this.y = y;
        this.cmd = cmd;
    }
    
    // ------ Rodin
    Rodin.VerticesStorage = function() {
    
        this.vertices = [];
    }
    
    Rodin.VerticesStorage.prototype = {
    
        is_empty: function() {
        
            return this.vertices.length == 0;
        },
        
        add_move_to: function(x, y) {
        
            var vertex_cmd = new Rodin.Vertex2Cmd(x, y, Rodin.VerticesStorage.move_to);
            this.vertices.push(vertex_cmd);
            return vertex_cmd;
        },
        
        add_line_to: function(x, y) {
        
            var vertex_cmd = new Rodin.Vertex2Cmd(x, y, Rodin.VerticesStorage.line_to)
            this.vertices.push(vertex_cmd);
            return vertex_cmd;
        },
        
        add_path_to_context: function(context) {
        
            context.beginPath();
            
            var vertex_cmd = null;
            var size = this.vertices.length;
            for (var index = 0; index != size; ++index) {
            
                vertex_cmd = this.vertices[index];
                if (vertex_cmd.cmd == Rodin.VerticesStorage.line_to) { // there is more line_to than move_to
                
                    context.lineTo(vertex_cmd.x, vertex_cmd.y);
                }
                else if (vertex_cmd.cmd == Rodin.VerticesStorage.move_to) {
                
                    context.moveTo(vertex_cmd.x, vertex_cmd.y);
                }
            }
        }
        
    }
    
    Rodin.VerticesStorage.move_to = 0;
    Rodin.VerticesStorage.line_to = 1;
    
    // ------ Node
    Rodin.Node = function() {
    
        this.transform = Rodin.Matrix32.create_identity();
        this.vertices = new Rodin.VerticesStorage();
        
        this.children = [];
    }
    
    Rodin.Node.prototype = {
    
        add_child: function() {
        
            var node = new Rodin.Node();
            this.children.push(node);
            return node;
        },
        
        draw: function(context) {
        
            if (! this.vertices.is_empty()) {
            
                //context.save();
                
                this.vertices.add_path_to_context(context);
                context.strokeStyle = "blue";
                context.stroke();
                
                //context.restore();
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
            
            context.fillStyle = "#CCC";
            context.fillRect(0, 0, viewport_size.x, viewport_size.y);
            
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
