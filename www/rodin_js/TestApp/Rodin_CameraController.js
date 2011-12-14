// class_template.js

(function() {

    
    Rodin.CameraController = function() {
    
		this.camera_moved_callback = null;
		this.view = null;
		this.camera_mgr = null;
    }

    Rodin.CameraController.prototype = {
    
        initialize : function() {
            
			// look
			$( "button", this.view ).button();
			
			
			var self = this;
			// events
			$( "button", this.view ).mouseup( function(event) { self._stop_camera(event); } );
			$( ".camera_button-forward", this.view).mousedown( function(event) 	{ self._move_camera(event, new Rodin.Vector2( 1.0, 0.0)); } );
			$( ".camera_button-left", this.view).mousedown( function(event) 	{ self._move_camera(event, new Rodin.Vector2( 0.0, 1.0)); } );
			$( ".camera_button-right", this.view).mousedown( function(event) 	{ self._move_camera(event, new Rodin.Vector2(-1.0, 0.0)); } );
			$( ".camera_button-backward", this.view).mousedown( function(event) { self._move_camera(event, new Rodin.Vector2(-1.0, 0.0)); } );
        },
		
		move_camera_tmp_ : new Rodin.Vector3(),
		
		_move_camera : function(event, direction) {
		
			var tmp = this.camera_mgr.camera_free_direction.mult_float(0.1, Rodin.CameraController.move_camera_tmp_);
			this.camera_mgr.camera_free_pos.add(tmp);
			
			this.camera_mgr._update_camera_free();
			
			//alert(direction.x+' '+direction.y);
			this.camera_moved_callback();
			
			event.preventDefault();
		},
		
		_stop_camera : function(event, direction) {
		
			//alert('stop_camera');
			event.preventDefault();
		}
        
    }
    
})()