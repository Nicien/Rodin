
// Rodin namespace
if (typeof Rodin == "undefined" || !Rodin)
{
   var Rodin = {};
   
   Rodin.assert = function(test) {
   
        if (! test) {
        
            if (window.console && window.console.error) {
                console.error(arguments);
            }
            throw "Error, Assert failed";
            //alert("Error, Assert failed"); 
        }
   }
   
}
