/**********************************************************************
* 
*
*
**********************************************************************/
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/

// Quote a string and convert to RegExp to match self literally.
var quoteRegExp =
RegExp.quoteRegExp =
module.quoteRegExp =
function(str){
	return str.replace(/([\.\\\/\(\)\[\]\$\*\+\-\{\}\@\^\&\?\<\>])/g, '\\$1') }



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
