
(function() {


	// ---------- Rodin.CameraMgr ----------
	
	Rodin.CameraMgr = function() {
		
		this.camera_orbit = new Rodin.Camera3d();
		this.camera_orbit.eye.set(0, 0, -10);
        this.camera_orbit.center.set(0, 0, 1);
		
		this.camera_front = new Rodin.Camera3d();
		this.camera_front.eye.set(0, 0, -10);
        this.camera_front.center.set(0, 0, 1);
		
		// camera front parameters:
		this.camera_front_pos = -4;
		this.camera_front_speed = -1.0 * 0.001;
		this.camera_front.center.set(0, 1, 1);
		this._update_camera_front();
		
		// camera orbit parameters:
		this.camera_orbit_angle = Math.PI / 12.0;
		this.camera_orbit_speed = 0.2 * 0.001;
		this.camera_front_distance = 10.0;
		this._update_camera_orbit();
		
		this.current_camera = this.camera_front;
		this.animate_camera = false;
	}
	
	
	Rodin.CameraMgr.prototype = {
	
		set_camera_mode_orbit: function() {
			
			this.current_camera = this.camera_orbit;
		},
		
		set_camera_mode_front: function() {
			
			this.current_camera = this.camera_front;
		},
		
		set_animate_camera: function(animate_camera_) {
		
			this.animate_camera = animate_camera_;
		},
		
		// return true is vewport need a refresh
		update_camera_positon: function(time_delta) {
			
			// update camera:
			if (this.animate_camera == false) {
				return false;
			}
			
			// update camera_front_pos:
			if (this.current_camera == this.camera_front) {
				
				this.camera_front_pos += this.camera_front_speed * time_delta;
				if (this.camera_front_pos < -20 || this.camera_front_pos > -1) {
				
					this.camera_front_speed *= -1;
				}
				
				this._update_camera_front();

			}
			else if (this.current_camera == this.camera_orbit) {
			
				this.camera_orbit_angle += this.camera_orbit_speed * time_delta;
				this.camera_orbit_angle %= Math.PI * 2.0;
				this._update_camera_orbit();
			}
			
			return true;
		},
		
		_update_camera_front: function() {
			
			this.camera_front.eye.set(0, 1, this.camera_front_pos);
		},
		
		_update_camera_orbit: function() {
		
			this.camera_orbit.eye.set
			(
				Math.cos(this.camera_orbit_angle) * this.camera_front_distance,
				2.0,
				Math.sin(this.camera_orbit_angle) * this.camera_front_distance
			);
		}
		
	}
	
	
	
	// ---------- Rodin.Camera3d ----------
    
    Rodin.Camera3d = function() {
    
        this.eye =    new Rodin.Vector3(0, 0, 0);
        this.center = new Rodin.Vector3(0, 0, 1);
        this.up =     new Rodin.Vector3(0, 1, 0);
        
        this.perspective = new Rodin.Mat4x4();
        this.look_at = new Rodin.Mat4x4();
        this.transform = new Rodin.Mat4x4();
    }
    
    
    Rodin.Camera3d.prototype = {
    
        // return 4x4 transform mtx:
        get_transform : function(viewport_width, viewport_height) {
            
            Rodin.Mat4x4.make_perspective(45, viewport_width / viewport_height, 0.1, 100.0, this.perspective);
            Rodin.Mat4x4.make_look_at(this.eye, this.center, this.up, this.look_at);
            
			this.transform.set_multiply(this.perspective, this.look_at);
			
            return this.transform;
        }
        
    }
    
})()