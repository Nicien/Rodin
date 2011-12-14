// class_template.js

(function() {
    
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
    
})()