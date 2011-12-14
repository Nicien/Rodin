// class_template.js

(function() {

    // classic transform update 
	Rodin.ClassicTransform = function(transform) {
	
		this.transform = transform;
		this.translation = new Rodin.Vector3(0.0, 0.0, 0.0);
		this.rotation = new Rodin.Vector3(0.0, 0.0, 0.0);
		this.scaling = new Rodin.Vector3(1.0, 1.0, 1.0);
	}
	
	Rodin.ClassicTransform.prototype = {
		
		update_transform : function() {
		
			Rodin.Mat4x4.make_translate_scale(this.translation, this.scaling, this.transform);
			// bon, la rotation on verra plus tard :)
		}
	}
    
})()