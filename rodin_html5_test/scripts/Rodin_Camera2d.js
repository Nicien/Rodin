
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
    
})()
