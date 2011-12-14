// class_template.js

(function() {    
	
    Rodin.Vector3 = function(x, y, z) {
        
		if (x == undefined) {
		
			this.x = 0.0;
			this.y = 0.0;
			this.z = 0.0;
		}
		else {
		
			this.x = x;
			this.y = y;
			this.z = z;
		}
		
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
        
        add: function(other, v3_out) {
        
			if (v3_out == undefined) v3_out = this;
			v3_out.x = this.x + other.x;
			v3_out.y = this.y + other.y;
			v3_out.z = this.z + other.z;
			return v3_out;
        },
        
        sub: function(other, v3_out) {
        
			if (v3_out == undefined) v3_out = this;
			v3_out.x = this.x - other.x;
			v3_out.y = this.y - other.y;
			v3_out.z = this.z - other.z;
			return v3_out;
        },
		
		mult: function(other, v3_out) {
		
			if (v3_out == undefined) v3_out = this;
			v3_out.x = this.x * other.x;
			v3_out.y = this.y * other.y;
			v3_out.z = this.z * other.z;
			return v3_out;
		},
		
        mult_float: function(value, v3_out) {
		
			if (v3_out == undefined) v3_out = this;
			v3_out.x = this.x * value;
			v3_out.y = this.y * value;
			v3_out.z = this.z * value;
			return v3_out;
		},
		
        dot_product: function(other) {
        
            return this.x * other.x + this.y * other.y + this.z * other.z;
        },
        
        cross_product: function(other, v3_out) {
            
			if (v3_out == undefined) v3_out = this;
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
        
			this.sub(other, v3_out);
            v3_out.normalize();
			
            return v3_out;
        }
        
    }
    
    Rodin.Vector3.AxisX = new Rodin.Vector3(1.0, 0.0, 0.0);
    Rodin.Vector3.AxisY = new Rodin.Vector3(0.0, 1.0, 0.0);
    Rodin.Vector3.AxisZ = new Rodin.Vector3(0.0, 0.0, 1.0);   
    
})()