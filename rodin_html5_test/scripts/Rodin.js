
// Rodin namespace
if (typeof Rodin == "undefined" || !Rodin)
{
	var Rodin = {
	
		gl : null
	};
	
	// ne fonctionne pas
   
	Rodin.assert = function(test, message) {
   
        if (test == false) {
        
            if (window.console && window.console.error) {
                console.error(arguments);
            }
            //throw "Error, Assert failed";
            alert("Assert failed: " + message); 
        }
   }
   
}
