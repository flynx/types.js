/**********************************************************************
* 
*
*
* XXX should we have .pre/.post events???
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



/*********************************************************************/

var bareEventMethod = function(name, func, options={}){
	var hidden
	var method

	options = typeof(func) != 'function' ?
		func
		: options

	return object.mixinFlat(
		method = function(func, mode){
			var handlers = 
				// hidden...
				options.handlerLocation == 'hidden' ?
					(hidden = hidden || [])
				// function...
				: options.handlerLocation == 'method' ?
					(method.__event_handlers__ = method.__event_handlers__ || [])
				// context (default)...
				: ((this.__event_handlers__ = this.__event_handlers__ || {})[name] =
					this.__event_handlers__[name] || [])

			var args = [...arguments]
			var handle = function(){
				handlers
					.forEach(function(handler){ 
						handler(...args) }) } 
			var res
			func ?
				(res = func.call(this, handle, ...args))
				: handle(...args)

			return res },
		{
			__event__: true,
			get __event_handler_location__(){
				return ['hidden', 'method'].includes(options.handlerLocation) ?
					options.handlerLocation
					: 'context' },
			// XXX revise nameing...
			__event_handler_add__: function(context, func){
				var handlers = 
					// hidden...
					options.handlerLocation == 'hidden' ?
						(hidden = hidden || [])
					// function...
					: options.handlerLocation == 'method' ?
						(method.__event_handlers__ = method.__event_handlers__ || [])
					// context (default)...
					: ((this.__event_handlers__ = this.__event_handlers__ || {})[name] =
						this.__event_handlers__[name] || [])
				// add handler...
				handlers.push(args[1])
				return this },
			__event_handler_remove__: function(context, func){
				var handlers = 
					(options.handlerLocation == 'hidden' ? 
						hidden
					: options.handlerLocation == 'method' ?
						method.__event_handlers__
					: (context.__event_handlers__ || {})[name]) || []
				handlers.splice(handlers.indexOf(func), 1)
				return this },
			toString: function(){
				return func.toString()
					.replace(/^(function[^(]*\()[^,)]*, ?/, '$1') },
		}) } 


//
//	eventMethod(name, func)
//		-> method
//	eventMethod(name, func)
//		-> method
//
//
//	Bind handler...
//	method(handler)
//		-> this
//
//	Unbind handler...
//	method(handler, false)
//		-> this
//
//	Trigger handlers...
//	method(...args)
//		-> this
//
//
//	func(handle, ...args)
//
//
var eventMethod = function(name, func, options={}){
	var method
	options = typeof(func) != 'function' ?
		func
		: options

	return Object.assign(
		method = bareEventMethod(name, 
			function(handle, ...args){
				// add handler...
				// XXX handle handler tags...
				if(typeof(args[0]) == 'function'){
					method.__event_handler_add__(this, args[0])
					
				// call the action...
				} else {
					func.call(handle, ...args) }

				return this }, 
			options),
   		{
			// NOTE: this is a copy of bareEventMethod's .toString() as we 
			// 		still need to base the doc on the user's func...
			toString: function(){
				return func.toString()
					.replace(/^(function[^(]*\()[^,)]*, ?/, '$1') },
		}) }


var EventHandlerMixin = {
	__event_handlers__: null,

	on: function(evt, func){
		// event...
		if(evt in this 
				&& this[evt].__event_handler_add__){
			this[evt].__event_handler_add__(this, func)
		// non-event...
		} else {
			;((this.__event_handlers__ = this.__event_handlers__ || {})[evt] = 
					this.__event_handlers__[evt] || [])
				.push(func) }
		return this },
	off: function(evt, func){
		// event...
		if(evt in this 
				&& this[evt].__event_handler_add__){
			this[evt].__event_handler_remove__(this, func)
		// non-event...
		} else {
			// XXX
		}
		return this },
	trigger: function(evt, ...args){
		// XXX trigger both the context and the method event handlers...
		// XXX
	},
}




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
