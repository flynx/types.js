/**********************************************************************
* 
*
*
* XXX is types/events the right place for this???
* XXX should we have .pre/.post events???
* XXX should we propogate event handling to parent/overloaded events???
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



/*********************************************************************/

var bareEventMethod = 
module.bareEventMethod =
function(name, func, options={}){
	var hidden
	var method

	options = func && typeof(func) != 'function' ?
		func
		: options

	return object.mixinFlat(
		method = function(...args){
			var handlers = 
				// hidden...
				options.handlerLocation == 'hidden' ?
					(hidden || [])
				// function...
				: options.handlerLocation == 'method' ?
					(method.__event_handlers__ || [])
				// context (default)...
				: ((this.__event_handlers__ || {})[name] || [])

			// NOTE: this will stop event handling if one of the handlers 
			// 		explicitly returns false...
			var handle = function(){
				return handlers
					.reduce(function(res, handler){ 
						return res === true 
							&& handler(...args) !== false }, true) } 
			var res
			func ?
				(res = func.call(this, handle, ...args))
				: handle(...args)

			return res },
		{
			__event__: 'bare',
			get __event_handler_location__(){
				return ['hidden', 'method'].includes(options.handlerLocation) ?
					options.handlerLocation
					: 'context' },
			__event_handler_add__: function(context, func){
				var handlers = 
					// hidden...
					options.handlerLocation == 'hidden' ?
						(hidden = hidden || [])
					// function...
					: options.handlerLocation == 'method' ?
						(method.__event_handlers__ = method.__event_handlers__ || [])
					// context (default)...
					: ((context.__event_handlers__ = context.__event_handlers__ || {})[name] =
						context.__event_handlers__[name] || [])
				// add handler...
				handlers.push(func)
				return this },
			// XXX should this support the 'all' key -- remove all handlers???
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


// Extends bareEventMethod(..) adding ability to bind events via the 
// resulting method directly...
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
var eventMethod = 
module.eventMethod =
function(name, func, options={}){
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
					func
						&& func.call(this, handle, ...args) }

				return this }, 
			options),
   		{
			__event__: 'full',
			// NOTE: this is a copy of bareEventMethod's .toString() as we 
			// 		still need to base the doc on the user's func...
			toString: function(){
				return func.toString()
					.replace(/^(function[^(]*\()[^,)]*, ?/, '$1') },
		}) }


// XXX might be nice to add support to pre/post handlers...
// XXX still not sure about the builtin-local event control flow...
var EventHandlerMixin = 
module.EventHandlerMixin = {
	__event_handlers__: null,

	// XXX do we need to be able to force global handler???
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
	// XXX do we need .off(evt, 'all')
	off: function(evt, func){
		// event...
		if(evt in this 
				&& this[evt].__event_handler_add__){
			this[evt].__event_handler_remove__(this, func)
		// non-event...
		} else {
			var handlers = this.__event_handlers__
				&& (this.__event_handlers__[evt] || [])
			handlers
				&& handlers.splice(handlers.indexOf(func), 1) }
		return this },
	// XXX add support for stopping handler execution...
	trigger: function(evt, ...args){
		// local handler...
		evt in this
			&& this[evt](...args)
		// global events...
		this.__event_handlers__
			&& (this.__event_handlers__[evt] || [])
				.forEach(function(h){ h(evt, ...args) }) 
		return this },
}


// NOTE: this can't be added via Object.assign(..), use object.mixinFlat(..) 
// 		instead...
var EventDocMixin = 
module.EventDocMixin = {
	get eventfull(){
		return object.deepKeys(this)
			.filter(function(n){ 
				// avoid triggering props...
				return !object.values(this, n, function(){ return object.STOP }, true)[0].get
					&& (this[n] || {}).__event__ == 'bare'}.bind(this)) },
	get events(){
		return object.deepKeys(this)
			.filter(function(n){ 
				// avoid triggering props...
				return !object.values(this, n, function(){ return object.STOP }, true)[0].get
					&& (this[n] || {}).__event__ == 'full' }.bind(this)) },
}


var EventMixin = 
module.EventMixin =
	object.mixinFlat(
		EventHandlerMixin,
		EventDocMixin)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
