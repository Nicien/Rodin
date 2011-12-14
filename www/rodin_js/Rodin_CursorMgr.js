 (function() {
 
	Rodin.CursorMgr = function(floorplan_j, viewport_j) {
	
		this.floorplan_j = floorplan_j;
		this.viewport_j = viewport_j;
		this.cursors = [];
	}
	
    Rodin.CursorMgr.prototype = {
	
		preload_cursor: function(cursor_uri) {
		
			var img = new Image();
			img.src = cursor_uri;
			this.cursors.push(img);
			
			return cursor_uri;
		},
		
		set_cursor_uri: function(viewport_type, cursor_uri) {
		
            this.floorplan_j.css('cursor', "url('"+cursor_uri+"'), auto");
		},
		
		set_standard_cursor: function(viewport_type) {
		
			this.floorplan_j.css('cursor', 'crosshair');
		},
		
		reset_cursor: function(viewport_type) {
			
			this.floorplan_j.css('cursor', '');
		}
	}
	
})()