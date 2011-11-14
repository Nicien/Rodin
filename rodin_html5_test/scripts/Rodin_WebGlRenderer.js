
(function() {

    Rodin.WebGlRenderer = function() {
    
        this.viewport_width = 0;
        this.viewport_height = 0;
    }
    
    Rodin.WebGlRenderer.prototype = {
    
        init: function(canvas) {
            
			Rodin.assert(Rodin.gl == null);
			
            // create gl context:
            if (this._try_create_webgl_context(canvas, "webgl") == false) {
            
                if (this._try_create_webgl_context(canvas, "experimental-webgl") == false) {
                
                    return false;
                }
            }
            
            this.update_viewport();
            
            Rodin.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            //Rodin.gl.enable(Rodin.gl.DEPTH_TEST);
            Rodin.gl.disable(Rodin.gl.DEPTH_TEST);

            return true;
        },
        
        _try_create_webgl_context: function(canvas, context_name) {
        
            try {
                Rodin.gl = canvas.getContext(context_name);
                //Rodin.gl = canvas.getContext("webgl", { antialias: false, stencil: true });
                
            } catch (e) {
            
            }
            
            return Rodin.gl != null;
        },
        
        update_viewport: function() {
            
            // compatibility fix:
            // Sur la version 7.01 de firefox, drawingBufferWidth/Height n'existe pas encore.
            // ca arrive: https://bugzilla.mozilla.org/show_bug.cgi?id=658856
            if (Rodin.gl.drawingBufferWidth == undefined) {
            
                Rodin.gl.drawingBufferWidth = Rodin.gl.canvas.width;
                Rodin.gl.drawingBufferHeight = Rodin.gl.canvas.height;
            }
            
            // detect if canvas size has changed
            if (this.viewport_width != Rodin.gl.drawingBufferWidth && this.viewport_height != Rodin.gl.drawingBufferHeight) {
            
                this.viewport_width = Rodin.gl.canvas.width;
                this.viewport_height = Rodin.gl.canvas.height;

                Rodin.gl.viewport(0, 0, this.viewport_width, this.viewport_height);
            }
        },
        
        prepare_rendering: function() {
        
            // canvas size may change
            this.update_viewport();
            Rodin.gl.clear(Rodin.gl.COLOR_BUFFER_BIT | Rodin.gl.DEPTH_BUFFER_BIT);
        }
        
    }
    
    
    
})()