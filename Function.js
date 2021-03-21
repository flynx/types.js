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
	// 				.post(function(res){
	// 					return res.pop() })
	//
	// 		a better way to do this:
	// 			;[1,3,2]
	// 				.sort()
	// 				.pop()
	//
	// 		and a better way to use this is:
	// 			Array.prototype.greatest = 
	// 				Array.prototype
	// 					.sort
	// 					.post(function(res){ 
	// 						return res.pop() })
	//
	// XXX this more complicated and less clear than:
	// 			Array.prototype.greatest = 
	// 				function(){
	// 					return this
	// 						.sort()
	// 						.pop() }
	// 		...are there cases when this is actually needed???
	// XXX add doc...
	before: function(func){
		var that = this
		return function(){
			var res = func.call(this, ...arguments) 
			res = res === undefined ?
				that
				: res
			return res.call(this, ...arguments) }},
	after: function(func){
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
