
(function() {
    
    Rodin.Camera3d = function() {
    
        this.eye =    new Rodin.Vector3(0, 0, 0);
        this.center = new Rodin.Vector3(0, 0, 1);
        this.up =     new Rodin.Vector3(0, 1, 0);
        
        this.perspective = new Rodin.Mat4x4();
        this.look_at = new Rodin.Mat4x4();
        this.transform = new Rodin.Mat4x4();
    }
    
    Rodin.Camera3d.prototype = {
    
        // return 4x4 transform mtx:
        get_transform : function(viewport_width, viewport_height) {
            
            Rodin.Mat4x4.make_perspective(45, viewport_width / viewport_height, 0.1, 100.0, this.perspective);
            Rodin.Mat4x4.make_look_at(this.eye, this.center, this.up, this.look_at);
            
			this.perspective.multiply(this.look_at, this.transform);
			
            return this.transform;
        }
        
    }
    
})()