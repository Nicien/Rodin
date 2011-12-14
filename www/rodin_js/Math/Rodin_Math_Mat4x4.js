
(function () {

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
        
		
        multiply: function(other, mat_out) {
        
			if (mat_out == undefined) mat_out = this;
			
			return Rodin.Mat4x4.make_multiply(this, other, mat_out);
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
    
	/* // unused
    Rodin.Mat4x4.make_translate = function(translate, mat_out) {
    
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
    */
	
    /*
         Creates a transformation matrix for rotation by angle radians about the 3-element vector axis.
         Parameters:
            angle - the angle of rotation, in radians
            axis - the axis around which the rotation is performed, a 3-element vector
    */
    Rodin.Mat4x4._rotation_tmp = new Rodin.Vector3(0, 0, 0);
    
	/* unused
    Rodin.Mat4x4.make_rotation_matrix = function(angle, axis_p, mat_out) {
        
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
    */
	/* unused
    Rodin.Mat4x4.make_scale = function(scale, mat_out) {
    
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
	*/
	
	Rodin.Mat4x4.make_translate_scale = function(translate, scale, mat_out) {
	
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
		r[12] = translate.x;
        r[13] = translate.y;
        r[14] = translate.z;
        r[15] = 1;
		
        return mat_out;
	}

    
    Rodin.Mat4x4.make_frustrum = function(left, right, bottom, top, znear, zfar, mat_out) {
    
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