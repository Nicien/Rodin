
// Rodin 2D:
(function ()
{
    Rodin.Vector2 = function(x, y) {
    
        this.x = x; this.y = y;
        return this;
    }
    
    Rodin.Vector2.prototype = {
    
        clone: function() {
        
            return new Vector2(this.x, this.y);
        },
        
        assign: function(other) {
            
            this.x = other.x; this.y = other.y;
            return this;
        },
        
        add: function(other) {
        
            this.x += other.x; this.y += other.y;
            return this;
        },
        
        dot: function(other) {
        
            return this.x * other.x + this.y * other.y;
        },
        
        length: function() {
        
            return Math.sqrt(this.x * this.x + this.y * this.y); 
        },
        
        normalize: function() {
        
            var len = this.length();
            this.x /= len;
            this.y /= len;
            return this;
        },
        
        scale: function(s) {
        
            this.x *= s; 
            this.y *= s;
            return this;
        }
    }
    /*
    Rodin.create_vector2_zero = function() {
    
        return new Vector2(0.0, 0.0);
    }
    */
})()