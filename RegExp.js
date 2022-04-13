/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



/*********************************************************************/

var RegExpMixin =
module.RegExpMixin =
object.Mixin('RegExpMixin', 'soft', {
	// Quote a string and convert to RegExp to match self literally.
	quoteRegExp: function(str){
		return str
			.replace(/([\.\\\/\(\)\[\]\$\*\+\-\{\}\@\^\&\?\<\>])/g, '\\$1') }

	// XXX add introspection interface...
	// 		- number of groups
	// 		- group info
	// 		- ...
})


RegExpMixin(RegExp)


var quoteRegExp =
RegExp.quoteRegExp = 
	RegExp.quoteRegExp



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
