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

var FunctionProtoMixin =
module.FunctionProtoMixin =
object.Mixin('FunctionProtoMixin', 'soft', {
	// NOTE: this is more usefull to define new functions for later reuse
	// 		rather than one-time "modding", for example, calling this on 
	// 		instance methods will lose context:
	// 			;[1,3,2]
	// 				.sort
	// 				.then(function(res){
	// 					return res.pop() })
	// 		a better way to do this:
	// 			;[1,3,2]
	// 				.sort()
	// 				.pop()
	// 		and a better way to use this is:
	// 			Array.prototype.greatest = 
	// 				Array.prototype
	// 					.sort
	// 					.then(function(res){ 
	// 						return res.pop() })
	then: function(func){
		var that = this
		return function(){
			return func.call(this, 
				that.call(this, 
					...arguments), 
				...arguments) }},
})

FunctionProtoMixin(Function.prototype)



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
