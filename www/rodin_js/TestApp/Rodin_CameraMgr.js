// class_template.js

(function() {
	
	Rodin.CameraMgr = function() {
		
		this.camera_orbit = new Rodin.Camera3d();
		this.camera_orbit.eye.set(0, 0, -10);
        this.camera_orbit.center.set(0, 0, 1);
		
		this.camera_free = new Rodin.Camera3d();
		this.camera_free.eye.set(0, 0, -10);
        this.camera_free.center.set(0, 0, 1);
		
		// camera free parameters:
		this.camera_free_pos = new Rodin.Vector3(0, 1, -4);
		this.camera_free_u = 0;
		this.camera_free_v = Math.PI/2.0;
		this.camera_free_direction = new Rodin.Vector3();
		this.camera_free_speed = 0.5 * 0.001;
		
		//this.camera_front_speed = -1.0 * 0.001;
		//this.camera_front.center.set(0, 1, 1);
		this._update_camera_free();
		
		// camera orbit parameters:
		this.camera_orbit_angle = Math.PI / 12.0;
		this.camera_orbit_speed = 0.2 * 0.001;
		this.camera_orbit_distance = 10.0;
		this._update_camera_orbit();
		
		this.current_camera = this.camera_free;
		this.animate_camera = false;
	}
	
	
	Rodin.CameraMgr.prototype = {
	
		set_camera_mode_orbit: function() {
			
			this.current_camera = this.camera_orbit;
		},
		
		set_camera_mode_free: function() {
			
			this.current_camera = this.camera_free;
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
			
			// update camera_free_pos:
			if (this.current_camera == this.camera_free) {
				
				
				//this.camera_free_u += this.camera_free_speed * time_delta;
				
				this.camera_free_v -= this.camera_free_speed * time_delta;
				this.camera_free_v = Math.min(this.camera_free_v, Math.PI-0.001);
				this.camera_free_v = Math.max(this.camera_free_v, -Math.PI);
				
				this._update_camera_free();

			}
			else if (this.current_camera == this.camera_orbit) {
			
				this.camera_orbit_angle += this.camera_orbit_speed * time_delta;
				this.camera_orbit_angle %= Math.PI * 2.0;
				this._update_camera_orbit();
			}
			
			return true;
		},
		
		
		_update_camera_free: function() {
			
			this.camera_free.eye.assign(this.camera_free_pos);

			// direction
			this.camera_free_direction.set
			(
				Math.sin(this.camera_free_u) * Math.sin(this.camera_free_v),
				Math.cos(this.camera_free_v),
				Math.cos(this.camera_free_u) * Math.sin(this.camera_free_v)
			);
			this.camera_free_direction.normalize();
			
			// center = pos + direction
			this.camera_free_pos.add(this.camera_free_direction, this.camera_free.center);
		},
		
		_update_camera_orbit: function() {
		
			this.camera_orbit.eye.set
			(
				Math.cos(this.camera_orbit_angle) * this.camera_orbit_distance,
				2.0,
				Math.sin(this.camera_orbit_angle) * this.camera_orbit_distance
			);
		}
		
	}
	
	
    
})()