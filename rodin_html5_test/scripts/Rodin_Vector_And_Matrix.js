
(function () {
    // ---------------------- Vector2 ----------------------
    
    Rodin.Vector2 = function(x, y) {
    
        this.x = x;
        this.y = y;
    }
    
    Rodin.Vector2.prototype = {
    
        clone: function() {
        
            return new Rodin.Vector2(this.x, this.y);
        },
        
        assign: function(other) {
            
            this.x = other.x; this.y = other.y;
            return this;
        },
        
        add: function(other) {
        
            this.x += other.x; this.y += other.y;
        },
        
        sub: function(other) {
        
            this.x -= other.x; this.y -= other.y;       
        },
        
        dot_product: function(other) {
        
            return this.x * other.x + this.y * other.y;
        },
        
        length: function() {
        
            return Math.sqrt(this.x * this.x + this.y * this.y); 
        },
        
        normalize: function() {
        
            var len_inv = 1 / this.length();
            this.x *= len_inv;
            this.y *= len_inv;
        }
        
    }
    
    Rodin.Vector2.AxisX = new Rodin.Vector2(1.0, 0.0);
    Rodin.Vector2.AxisY = new Rodin.Vector2(0.0, 1.0);
    
    // ---------------------- Vector3 ----------------------
    
    Rodin.Vector3 = function(x, y, z) {
        
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    Rodin.Vector3.prototype = {
    
        clone: function() {
        
            return new Rodin.Vector3(this.x, this.y, this.z);
        },
        
        set: function(x, y, z) {
        
            this.x = x; this.y = y; this.z = z;
        },
        
        assign: function(other) {
            
            this.x = other.x; this.y = other.y; this.z = other.z;
            return this;
        },
        
        add: function(other) {
        
            this.x += other.x; this.y += other.y; this.z += other.z;
        },
        
        sub: function(other) {
        
            this.x -= other.x; this.y -= other.y; this.z -= other.z;
        },
        
        dot_product: function(other) {
        
            return this.x * other.x + this.y * other.y + this.z * other.z;
        },
        
        cross_product: function(other, v3_out) {
            
            v3_out = Rodin.Vector3.make(v3_out);
            
            v3_out.x = this.y * other.z - this.z * other.y;
            v3_out.y = this.z * other.x - this.x * other.z;
            v3_out.z = this.x * other.y - this.y * other.x;
            
            return v3_out;
        },
        
        length: function() {
        
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); 
        },
        
        normalize: function() {
        
            var len_inv = 1.0 / this.length();
            this.x *= len_inv;
            this.y *= len_inv;
            this.z *= len_inv;
        },
        
        direction: function(other, v3_out) {
        
            v3_out = Rodin.Vector3.make(v3_out, this); 
            
            v3_out.sub(other);
            v3_out.normalize();
            
            return v3_out;
        }
        
    }
    
    /*
        'make' function
        example:
            Rodin.Vector3.make();               // create and return a new Vector3(0.0, 0.0, 0.0)
            Rodin.Vector3.make(v3_out);         // leave v3_out untouched and return v3_out
            Rodin.Vector3.make(v3_out, src);    // create v3_out if undefined, copy src to v3_out and return v3_out
    */
    Rodin.Vector3.make = function(v3_out, src) {
    
        if (v3_out == undefined) {
        
            v3_out = 
                (src == undefined) ?
                new Rodin.Vector3(0.0, 0.0, 0.0) :
                new Rodin.Vector3(src.x, src.y, src.z);
        }
        else if (src != undefined) {
        
            v3_out.assign(src);
        }
        return v3_out;
    }
    
    Rodin.Vector3.AxisX = new Rodin.Vector3(1.0, 0.0, 0.0);
    Rodin.Vector3.AxisY = new Rodin.Vector3(0.0, 1.0, 0.0);
    Rodin.Vector3.AxisZ = new Rodin.Vector3(0.0, 0.0, 1.0);
    
    
    // ---------------------- Mat3x2 ----------------------
    
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
    
    
    
    // ---------------------- Mat4x4 ----------------------
    
    
    // 'values' parameter can be:
    //      'undefined' - initialize with identity matrix
    //      javascript array of 16 floats
    //      Float32Array of 16 elements   
    Rodin.Mat4x4 = function(values) {
        
        if (values == undefined) {
        
            values = Rodin.Mat4x4.identity.buffer;
        }
        
        this.buffer = new Float32Array(values);
    }
    
    Rodin.Mat4x4.prototype = {
        
        set_values: function(values) {
        
            this.buffer.set(values);
        },
        
        clone: function() {
        
            return new Rodin.Mat4x4(this.buffer);
        },
        
        assign: function(src) {
        
            //this.set_values(other.buffer);
            this.buffer.set(src.buffer);
            return this;
        },
        
        reset_to_identity: function() {
        
            this.assign(Rodin.Mat4x4.identity);
        },
                
        transpose: function() {
        
            var m = this.buffer;
            var tmp = m[1]; m[1] = m[4]; m[4] = tmp;
            tmp = m[2]; m[2] = m[8]; m[8] = tmp;
            tmp = m[3]; m[3] = m[12]; m[12] = tmp;
            tmp = m[6]; m[6] = m[9]; m[9] = tmp;
            tmp = m[7]; m[7] = m[13]; m[13] = tmp;
            tmp = m[11]; m[11] = m[14]; m[14] = tmp;
        },
        
		
        multiply: function(other) {
        
			Rodin.Mat4x4.make_multiply(this, other, this);
        },
		
		set_multiply : function(left, right) {
		
			Rodin.Mat4x4.make_multiply(left, right, this);
		},
		
        translate: function(translate) {
        
            var m = this.buffer;
            var x = translate.x; var y = translate.y; var z = translate.z;
            m[12] += m[0] * x + m[4] * y + m[8] * z;
            m[13] += m[1] * x + m[5] * y + m[9] * z;
            m[14] += m[2] * x + m[6] * y + m[10] * z;
            m[15] += m[3] * x + m[7] * y + m[11] * z;
        },
        
        transform_point: function(point) {
            
            var m = this.buffer;
            var v0 = point.x, v1 = point.y, v2 = point.z;
                
            point.x = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12];
            point.y = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13];
            point.z = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14];
            var w = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15];

            if (w != 1.0) {
                point.x /= w;
                point.y /= w;
                point.z /= w;
            }
        },
        
        transform_point_affine: function(v3) {
            
            var m = this.buffer;
            var v0 = v3.x, v1 = v3.y, v2 = v3.z;

            v3.x = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12];
            v3.y = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13];
            v3.z = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14];
        }
    }
    
    Rodin.Mat4x4.identity = new Rodin.Mat4x4(
               [1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);
    
    Rodin.Mat4x4.make_identity = function(mat_out) {
    
        if (mat_out == undefined) {
			mat_out = new Rodin.Mat4x4();
		}
		else {
			mat_out.assign(Rodin.Mat4x4.identity);
		}
        return mat_out;
    }
    
    Rodin.Mat4x4.make_translate = function(translate, mat_out) {
    
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        var r = mat_out.buffer;
        
        r[0] = 1;
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 1;
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = 1;
        r[11] = 0;
        r[12] = translate.x;
        r[13] = translate.y;
        r[14] = translate.z;
        r[15] = 1;
        
        return mat_out;
    }
    
    /*
         Creates a transformation matrix for rotation by angle radians about the 3-element vector axis.
         Parameters:
            angle - the angle of rotation, in radians
            axis - the axis around which the rotation is performed, a 3-element vector
    */
    Rodin.Mat4x4._rotation_tmp = new Rodin.Vector3(0, 0, 0);
    
    Rodin.Mat4x4.make_rotation_matrix = function(angle, axis_p, mat_out) {
        
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        var r = mat_out.buffer;
        
        var axis = _rotation_tmp.assign(axis_p);
        axis.normalize();
        var x = axis.x, y = axis.y, z = axis.z;
        
        var c = Math.cos(angle);
        var c1 = 1-c;
        var s = Math.sin(angle);

        r[0] = x*x*c1+c;
        r[1] = y*x*c1+z*s;
        r[2] = z*x*c1-y*s;
        r[3] = 0;
        r[4] = x*y*c1-z*s;
        r[5] = y*y*c1+c;
        r[6] = y*z*c1+x*s;
        r[7] = 0;
        r[8] = x*z*c1+y*s;
        r[9] = y*z*c1-x*s;
        r[10] = z*z*c1+c;
        r[11] = 0;
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;
        
        return mat_out;
    }
    
    Rodin.Mat4x4.make_scale = function(scale, mat_out) {
    
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        var r = mat_out.buffer;
        
        r[ 0] = scale.x;
        r[ 1] = 0;
        r[ 2] = 0;
        r[ 3] = 0;
        r[ 4] = 0;
        r[ 5] = scale.y;
        r[ 6] = 0;
        r[ 7] = 0;
        r[ 8] = 0;
        r[ 9] = 0;
        r[10] = scale.z;
        r[11] = 0;
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;
        
        return mat_out;
    }

    
    Rodin.Mat4x4.make_frustrum = function(left, right, bottom, top, znear, zfar, mat_out) {
    
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        var r = mat_out.buffer;
        
        var X = 2*znear/(right-left);
        var Y = 2*znear/(top-bottom);
        var A = (right+left)/(right-left);
        var B = (top+bottom)/(top-bottom);
        var C = -(zfar+znear)/(zfar-znear);
        var D = -2*zfar*znear/(zfar-znear);
        
        r[0] = 2*znear/(right-left);
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 2*znear/(top-bottom);
        r[6] = 0;
        r[7] = 0;
        r[8] = (right+left)/(right-left);
        r[9] = (top+bottom)/(top-bottom);
        r[10] = -(zfar+znear)/(zfar-znear);
        r[11] = -1;
        r[12] = 0;
        r[13] = 0;
        r[14] = -2*zfar*znear/(zfar-znear);
        r[15] = 0;

        return mat_out;
    }
    
    Rodin.Mat4x4.make_perspective = function (fovy, aspect, znear, zfar, mat_out) {
        
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        
        return Rodin.Mat4x4.make_frustrum(xmin, xmax, ymin, ymax, znear, zfar, mat_out);
    }
    
    Rodin.Mat4x4.make_ortho = function (left, right, bottom, top, znear, zfar, mat_out) {
    
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        var r = mat_out.buffer;
            
        var tX = -(right+left)/(right-left);
        var tY = -(top+bottom)/(top-bottom);
        var tZ = -(zfar+znear)/(zfar-znear);
        var X = 2 / (right-left);
        var Y = 2 / (top-bottom);
        var Z = -2 / (zfar-znear);

        r[0] = 2 / (right-left);
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 2 / (top-bottom);
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = -2 / (zfar-znear);
        r[11] = 0;
        r[12] = -(right+left)/(right-left);
        r[13] = -(top+bottom)/(top-bottom);
        r[14] = -(zfar+znear)/(zfar-znear);
        r[15] = 1;
        
        return mat_out;
    }
    
    Rodin.Mat4x4.make_ortho_2d = function(left, right, bottom, top, mat_out) {

        return Mat4x4.makeOrtho(left, right, bottom, top, -1, 1, mat_out);
    }

    Rodin.Mat4x4._look_at_tmp_1 = new Rodin.Vector3(0, 0, 0);
    Rodin.Mat4x4._look_at_tmp_2 = new Rodin.Vector3(0, 0, 0);
    Rodin.Mat4x4._look_at_tmp_3 = new Rodin.Vector3(0, 0, 0);
    
    Rodin.Mat4x4._look_at_mtx = new Rodin.Mat4x4();
    
    Rodin.Mat4x4.make_look_at = function(eye, center, up, mat_out) {
    
        var z = eye.direction(center, Rodin.Mat4x4._look_at_tmp_1);
        
        var x = up.cross_product(z, Rodin.Mat4x4._look_at_tmp_2);
        x.normalize();
        
        var y = z.cross_product(x, Rodin.Mat4x4._look_at_tmp_3);
        z.normalize();

        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
        
        var tm1 = mat_out.buffer;
        var tm2 = Rodin.Mat4x4._look_at_mtx.buffer;

        tm1[0] = x.x;
        tm1[1] = y.x;
        tm1[2] = z.x;
        tm1[3] = 0;
        tm1[4] = x.y;
        tm1[5] = y.y;
        tm1[6] = z.y;
        tm1[7] = 0;
        tm1[8] = x.z;
        tm1[9] = y.z;
        tm1[10] = z.z;
        tm1[11] = 0;
        tm1[12] = 0;
        tm1[13] = 0;
        tm1[14] = 0;
        tm1[15] = 1;

        tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
        tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
        tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
        tm2[12] = -eye.x; tm2[13] = -eye.y; tm2[14] = -eye.z; tm2[15] = 1;
        
        mat_out.multiply(Rodin.Mat4x4._look_at_mtx);
        return mat_out;
    }
	
	Rodin.Mat4x4.make_multiply = function(left, right, mat_out) {
	
        if (mat_out == undefined) mat_out = new Rodin.Mat4x4();
		
		var a = left.buffer;
		var b = right.buffer;
		var r = mat_out.buffer;
		
		var a11 = a[0];  var a21 = a[1];  var a31 = a[2];  var a41 = a[3];
		var a12 = a[4];  var a22 = a[5];  var a32 = a[6];  var a42 = a[7];
		var a13 = a[8];  var a23 = a[9];  var a33 = a[10]; var a43 = a[11];
		var a14 = a[12]; var a24 = a[13]; var a34 = a[14]; var a44 = a[15];

		var b11 = b[0];  var b21 = b[1];  var b31 = b[2];  var b41 = b[3];
		var b12 = b[4];  var b22 = b[5];  var b32 = b[6];  var b42 = b[7];
		var b13 = b[8];  var b23 = b[9];  var b33 = b[10]; var b43 = b[11];
		var b14 = b[12]; var b24 = b[13]; var b34 = b[14]; var b44 = b[15];
		
		r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		
		return mat_out;
	}

})()