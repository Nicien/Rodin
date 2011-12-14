
// Rodin namespace
if (typeof Rodin == "undefined" || !Rodin)
{
	var Rodin = {
	
		gl : null
	};
	
	Rodin.bind = function(target, fn) {
		
		return function() {
			fn.apply(target, toArray(arguments));
		}
	}
	/*
	// Bind w/ currying

	function bind(scope, fn) {
    var args = Array.prototype.slice.call(arguments, 2);
		return function () {
			return fn.apply(scope, args.concat(toArray(arguments)));
		};
	}
	*/
	
	// assert ne fonctionne pas
	Rodin.assert = function(test, message) {
   
        if (test == false) {
        
			Rodin.error(message);
        }
	}
   
	Rodin.error = function(message) {

		if (window.console && window.console.error) {
			console.error(arguments);
		}
		//throw "Error, Assert failed";
		alert("Assert failed: " + message); 
	}
   
}
