// class_template.js

(function() {

	// ---------------------------- WebGlVertices
	
	// 'data' must be a WebGl Array
	// 'buffer type' must be a ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
	Rodin.WebGlBuffer = function(data, buffer_type) {
		
        this.length = data.length;
        this.buffer = Rodin.gl.createBuffer();
        Rodin.gl.bindBuffer(buffer_type, this.buffer);
        Rodin.gl.bufferData(buffer_type, data, Rodin.gl.STATIC_DRAW);
	}
	
	// vertices must be a Float32Array
    Rodin.WebGlVertices = function(vertices) {
        
		Rodin.WebGlBuffer.call(this, vertices, Rodin.gl.ARRAY_BUFFER);
    }
	
	
	// ---------------------------- WebGlVertices
	
	// indices must be a Uint16Array
	Rodin.WebGlIndices = function(indices) {
	
		Rodin.WebGlBuffer.call(this, indices, Rodin.gl.ELEMENT_ARRAY_BUFFER);
	}
    
})()