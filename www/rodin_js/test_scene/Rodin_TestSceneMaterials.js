// class_template.js

(function() {

    
    Rodin.TestSceneMaterials = function(shaders /* Rodin.shaders */) {
    
		this.shaders = shaders;
    }
    
    
    Rodin.TestSceneMaterials.prototype = {
    
        create_materials : function() {
            
			this.grid_shader = this.shaders.projection_plain_color;
			this.grid_color_a = { r:0.4, g:0.3, b:0.6, a:0.5 };
			this.grid_color_b = { r:0.5, g:0.3, b:0.7, a:1.0 };
			
        },
        
    }
    
})()