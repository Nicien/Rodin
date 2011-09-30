
// Rodin 2D:
(function () {

    Rodin.Matrix32 = function(sx, shy, shx, sy, tx, ty)
    {
        this.sx = sx; this.shy = shy; this.shx = shx;
        this.sy = sy; this.tx = tx;this.ty = ty;
        return this;
    }
    
    Rodin.Matrix32.prototype = {
        
        clone: function() {
        
            return new Matrix32(this.sx, this.shy, this.shx, this.sy, this.tx, this.ty);
        },
        
        assign: function(src) {
        
            this.sx = other.sx; this.shy = other.shy; this.shx = other.shx;
            this.sy = other.sy; this.tx = other.tx; this.ty = other.ty;
            return this;
        },
        
        multiply: function(other) {
            
            var t0 = this.sx * other.sx + this.shy * other.shx;
            var t2 = this.shx * other.sx + this.sy  * other.shx;
            var t4 = this.tx  * other.sx + this.ty  * other.shx + other.tx;
            this.shy = this.sx  * other.shy + this.shy * other.sy;
            this.sy  = this.shx * other.shy + this.sy  * other.sy;
            this.ty  = this.tx  * other.shy + this.ty  * other.sy + other.ty;
            this.sx  = t0;
            this.shx = t2;
            this.tx  = t4;
            return this;
        },
        
        determinant: function() {
        
            return sx * sy - shy * shx;
        },
        
        determinant_reciprocal: function() {
        
            return 1.0 / (sx * sy - shy * shx);
        },
        
        invert: function() {
        
            var d = determinant_reciprocal();
            
            var t0 = sy  * d;
                sy  =  sx  * d;
                shy = -shy * d;
                shx = -shx * d;

            var t4 = -tx * t0  - ty * shx;
                ty = -tx * shy - ty * sy;

            sx = t0;
            tx = t4;
            return this;
        },
        
        transform: function(vertex_in_out) {
            
            var tmp = vertex_in_out.x;
            vertex_in_out.x = tmp * sx  + vertex_in_out.x * shx + tx;
            vertex_in_out.y = tmp * shy + vertex_in_out.y * sy  + ty;
        },
        
        transform_2x2: function(vertex_in_out) {
        
            var tmp = vertex_in_out.x;
            vertex_in_out.x = tmp * sx  + vertex_in_out.x * shx;
            vertex_in_out.y = tmp * shy + vertex_in_out.y * sy;
        },
        
        /*
        translate: function(offset_v2) {
        
            this.tx += offset_v2.x;
            this.ty += offset_v2.y;
            return this;
        },
        
        scale: function(scale_v2) {
        
            this.x = 
        },
        */

    }
    
    Rodin.Matrix32.create_identity = function() {
        
         return new Rodin.Matrix32(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    }
        
    Rodin.Matrix32.create_translation = function(x, y) {
        
        return new Rodin.Matrix32(1.0, 0.0, 0.0, 1.0, x, y);
    }
        
    Rodin.Matrix32.create_rotation = function(a) {
        
        return new Rodin.Matrix32(cos(a), sin(a), -sin(a), cos(a), 0.0, 0.0);
    }
        
    Rodin.Matrix32.create_scaling = function(x, y) {
        
        return new Rodin.Matrix32(x, 0.0, 0.0, y, 0.0, 0.0);
    }

})()
