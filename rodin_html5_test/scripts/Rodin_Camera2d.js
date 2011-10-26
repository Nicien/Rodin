
(function() {

    // ---- class Camera2d
    
    Rodin.Camera2d = function() {
    
        this.zoom = 1.0;
        this.translate = new Rodin.Vector2(0, 0);
    }
    
    Rodin.Camera2d.prototype = {
    
        transform: function(viewport_size_v2) {
        
            result = Mat3x2.create_identity();
            result.multiply(Mat3x2.create_translation(viewport_size_v2.x, viewport_size_v2.y));
            result.multiply(Mat3x2.create_scaling(zoom, zoom));
            result.multiply(Mat3x2.create_translation(this.translate.x, this.translate.y));
            return result;
        }
    }
    
})()
