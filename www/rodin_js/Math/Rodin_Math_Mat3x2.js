// class_template.js

(function() {

    
    Rodin.Mat3x2 = function(sx, shy, shx, sy, tx, ty)
    {
        this.sx = sx; this.shy = shy; this.shx = shx;
        this.sy = sy; this.tx = tx;   this.ty = ty;
    }
    
    Rodin.Mat3x2.prototype = {

        set_values: function(sx, shy, shx, sy, tx, ty) {
            
            this.sx = sx; this.shy = shy; this.shx = shx;
            this.sy = sy; this.tx = tx;   this.ty = ty;
        },
        
        clone: function() {
        
            return new Rodin.Mat3x2(this.sx, this.shy, this.shx, this.sy, this.tx, this.ty);
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
        },
        
        transform: function(vertex) {
            
            var tmp = vertex.x;
            vertex.x = tmp * sx  + vertex.x * shx + tx;
            vertex.y = tmp * shy + vertex.y * sy  + ty;
        },
        
        transform_2x2: function(vector) {
        
            var tmp = vector.x;
            vector.x = tmp * sx  + vector.x * shx;
            vector.y = tmp * shy + vector.y * sy;
        }

    }
    
    Rodin.Mat3x2.make_matrix_with_components = function(sx, shy, shx, sy, tx, ty, mat_out) {
    
        if (mat_out == undefined) {
        
            mat_out = new Rodin.Mat3x2(sx, shy, shx, sy, tx, ty);
        }
        else {
        
            mat_out.set_values(sx, shy, shx, sy, tx, ty);
        }
        
        return mat_out;
    }
    
    Rodin.Mat3x2.make_identity = function(mat_out) {
        
        return Rodin.Mat3x2.make_matrix_with_components(1.0, 0.0, 0.0, 1.0, 0.0, 0.0, mat_out);
    }
        
    Rodin.Mat3x2.make_translation = function(x, y, mat_out) {
        
        return Rodin.Mat3x2.make_matrix_with_components(1.0, 0.0, 0.0, 1.0, x, y, mat_out);
    }
        
    Rodin.Mat3x2.make_rotation = function(a, mat_out) {
        
        var cos_a = Math.cos(a);
        var sin_a = Math.sin(a);
        return Rodin.Mat3x2.make_matrix_with_components(cos_a, sin_a, -sin_a, cos_a, 0.0, 0.0, mat_out);        
    }
        
    Rodin.Mat3x2.make_scaling = function(x, y, mat_out) {
        
        return Rodin.Mat3x2.make_matrix_with_components(x, 0.0, 0.0, y, 0.0, 0.0, mat_out);        
    }
    
})()