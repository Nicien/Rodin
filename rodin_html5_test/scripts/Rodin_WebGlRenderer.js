
(function() {

    Rodin.WebGlRenderer = function() {
    
        this.gl = null;
        this.viewport_width = 0;
        this.viewport_height = 0;
    }
    
    Rodin.WebGlRenderer.prototype = {
    
        init: function(canvas) {
            
            // create gl context:
            if (this._try_get_webgl_context(canvas, "webgl") == false) {
            
                if (this._try_get_webgl_context(canvas, "experimental-webgl") == false) {
                
                    return false;
                }
            }
            
            return true;
        },
        
        _try_get_webgl_context: function(canvas, context_name) {
        
            try {
                this.gl = canvas.getContext(context_name);
                //this.gl = canvas.getContext("webgl", { antialias: false, stencil: true });
                
            } catch (e) {
            
            }
            
            return this.gl != null;
        },
        
        update_viewport: function() {
        
            // detect if canvas size has changed
            if (this.viewport_width != this.gl.drawingBufferWidth && this.viewport_height != this.gl.drawingBufferHeight) {
            
                // drawingBufferHeight
                this.viewport_width = this.gl.drawingBufferWidth;
                this.viewport_height = this.gl.drawingBufferHeight;
                
                // update gl viewport
                this.gl.viewport(0, 0, this.viewport_width, this.viewport_height);
            }
        },
        
        prepare_rendering: function() {
        
            // canvas size may change
            this.update_viewport();
            
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        }
        
    }
    
    
    
})()