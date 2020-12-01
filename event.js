/**********************************************************************
* 
*
*
* XXX need ability to extend event to implement proxy events...
* 		...i.e. .on(..) / ... get called on one object but the handler
* 		bound on a different object via a proxy event method...
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
// Event method wrappers...

var EventCommand = 
module.EventCommand = 
object.Constructor('EventCommand', {
	name: null,
	__init__: function(name, data={}){
		Object.assign(this, data, {name}) },
})


module.TRIGGER = module.EventCommand('TRIGGER')



// XXX would be nice to have an event object...
var _Eventfull =
module._Eventfull =
object.Constructor('Eventfull', {

	handlerLocation: 'context',

	name: null,
	func: null,

	toString: function(){
		return this.func ?
			`${this.constructor.name} `
				+(this.func.toString()
					.replace(/^(function[^(]*\()[^,)]*, ?/, '$1')) 
			: `${this.constructor.name} function ${this.name}(){}` },

	__event_handlers__: null,
	bind: function(context, handler){
		var handlers = 
			// local...
			options.handlerLocation == 'method' ?
				(this.__event_handlers__ = this.__event_handlers__ || [])
			// context (default)...
			: (context.__event_handlers__ == null ?
				Object.defineProperty(context, '__event_handlers__', {
						value: {[this.name]: (handlers = [])},
						enumerable: false,
					}) 
					&& handlers
				: (context.__event_handlers__[this.name] = 
					context.__event_handlers__[this.name] || []))
		// add handler...
		handlers.push(func)
		return this },
	unbind: function(context, handler){
		var handlers = 
			(options.handlerLocation == 'method' ?
				method.__event_handlers__
			: (context.__event_handlers__ || {})[this.name]) || []
		handlers.splice(0, handlers.length,
			...handlers.filter(function(h){
				return h !== this.func
					&& h.__event_original_handler__ !== func }))
		return this },

	__call__: function(context, ...args){
		var handlers = 
			this.handlerLocation == 'method' ?
				(this.__event_handlers__ || [])
			: []
		// context (default)...
		// NOTE: these are allways called...
		handlers = handlers
			.concat((context.__event_handlers__ || {})[this.name] || [])

		// NOTE: this will stop event handling if one of the handlers 
		// 		explicitly returns false...
		// NOTE: if the user does not call handle() it will be called 
		// 		after the event action is done but before it returns...
		// NOTE: to explicitly disable calling the handlers func must 
		// 		call handle(false)
		var did_handle = false
		var handle = function(run=true){
			did_handle = run === false
			var a = args[0] instanceof EventCommand ?
				args.slice(1)
				: args
			return run ?
				handlers
					.reduce(function(res, handler){ 
						return res === true 
							&& handler(this.name, ...a) !== false }, true) 
				: undefined } 

		// call...
		var res = this.func ?
			this.func.call(context, handle, ...args)
			: undefined

		// call the handlers if the user either didn't call handle()
		// or explicitly called handle(false)...
		!did_handle
			&& handle()
		return res },

	__init__: function(name, func, options={}){
		options = func && typeof(func) != 'function' ?
			func
			: options
		Object.assign(this, options)
		Object.defineProperty(this, 'name', { value: name })
		func && typeof(func) == 'function'
			&& (this.func = func) },
})


// XXX test...
// XXX rename???
var _Event =
module._Event =
object.Constructor('Event', _Eventfull, {
	toString: function(){
		return this.orig_func ?
			'Event '
				+this.orig_func.toString()
					.replace(/^(function[^(]*\()[^,)]*, ?/, '$1')
			: `Event function ${this.name}(){}`},
	__init__: function(name, func, options={}){
		var that = this
		this.orig_func = func
		object.parentCall(_Event.prototype.__init__, this, 
			name, 
			function(handle, ...args){
				// NOTE: when the first arg is an event command this will
				// 		fall through to calling the action...
				typeof(args[0]) == 'function' ?
					// add handler...
					that.bind(this, args[0])
					// call the action...
					: (func
						&& func.call(this, handle, ...args))
				return this }, 
			options) }
})


var _PureEvent =
module._PureEvent =
object.Constructor('PureEvent', _Event, {
	// XXX
})



// Create an "eventfull" method...
//
// The resulting method can be either called directly or via .trigger(..).
// Handlrs can be bound to it via .on(..) and unbound via .off(..) and 
// calling it will trigger the handlers either after the user func(..)
// return or when the user calles the passed handler(..) function.
//
// 	Eventfull(name[, options])
// 		-> method
//
// 	Eventfull(name, func[, options])
// 		-> method
//
//
//	Trigger the event...
//	method(...args)
//		-> ..
//
//
// 	func(handle, ...args)
// 		-> ..
//
//
//	trigger event handlers...
//	handle()
//	handle(true)
//		-> true
//		-> false
//
//	prevent event handlers from triggering...
//	handle(false)
//		-> undefined
//
//
//
// Special case: EventCommand...
//
//	EventCommand instance can be passed as the first argument of method, 
//	in this case the event function will get it but the event handlers 
//	will not...
//	This is done to be able to externally pass commands to event methods
//	that get handled in a special way by the function but not passed to 
//	the event handlers...
//
// 		method(<event-command>, ...args)
// 			-> ..
//
// 		func(handle, <event-command>, ...args)
// 			-> ..
//
//
//
// NOTE: calling handle(false) will exiplicitly disable calling the 
// 		handlers for that call...
var Eventfull = 
module.Eventfull =
function(name, func, options={}){
	var hidden
	options = func && typeof(func) != 'function' ?
		func
		: options
	var method = object.mixin(
		function(...args){
			var handlers = 
				// hidden...
				options.handlerLocation == 'hidden' ?
					(hidden || [])
				// function...
				: options.handlerLocation == 'method' ?
					(method.__event_handlers__ || [])
				: []
			// context (default)...
			// NOTE: these are allways called...
			handlers = handlers
				.concat((this.__event_handlers__ || {})[name] || [])

			// NOTE: this will stop event handling if one of the handlers 
			// 		explicitly returns false...
			// NOTE: if the user does not call handle() it will be called 
			// 		after the event action is done but before it returns...
			// NOTE: to explicitly disable calling the handlers func must 
			// 		call handle(false)
			var did_handle = false
			var handle = function(run=true){
				did_handle = run === false
				var a = args[0] instanceof EventCommand ?
					args.slice(1)
					: args
				return run ?
					handlers
						.reduce(function(res, handler){ 
							return res === true 
								&& handler(name, ...a) !== false }, true) 
					: undefined } 

			var res = func ?
				func.call(this, handle, ...args)
				: undefined

			// call the handlers if the user either didn't call handle()
			// or explicitly called handle(false)...
			!did_handle
				&& handle()

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
					: (context.__event_handlers__ == null ?
						Object.defineProperty(context, '__event_handlers__', {
								value: {[name]: (handlers = [])},
								enumerable: false,
							}) 
							&& handlers
						: (context.__event_handlers__[name] = 
							context.__event_handlers__[name] || []))
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
				handlers.splice(0, handlers.length,
					...handlers.filter(function(h){
						return h !== func
							&& h.__event_original_handler__ !== func }))
				return this },
			// remove the handle from the arguments...
			toString: function(){
				return 'Eventfull '
					+(func.toString()
						.replace(/^(function[^(]*\()[^,)]*, ?/, '$1')) },
		}) 

	Object.defineProperty(method, 'name', {
		value: name,
	})

	return method } 



// Extends Eventfull(..) adding ability to bind events via the 
// resulting method directly by passing it a function...
//
//	Event(name[, options])
//		-> method
//
//	Event(name, func[, options])
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
// Special case:
//
//	Force trigger event...
//	method(TRIGGER, ...args)
//		-> this
//
// This will pass args to the event action regardless whether the first 
// arg is a function or not...
//
var Event = 
module.Event =
function(name, func, options={}){
	var method
	options = typeof(func) != 'function' ?
		func
		: options

	//return Object.assign(
	return object.mixin(
		method = Eventfull(name, 
			function(handle, ...args){
				// NOTE: when the first arg is an event command this will
				// 		fall through to calling the action...
				typeof(args[0]) == 'function' ?
					// add handler...
					method.__event_handler_add__(this, args[0])
					// call the action...
					: (func
						&& func.call(this, handle, ...args))
				return this }, 
			options),
   		{
			__event__: 'full',
			// NOTE: this is a copy of Eventfull's .toString() as we 
			// 		still need to base the doc on the user's func...
			toString: function(){
				return func ?
					'Event '
						+func.toString()
							.replace(/^(function[^(]*\()[^,)]*, ?/, '$1')
		   			: `Event function ${name}(){}`},
		}) }


// Like Event(..) but produces an event method that can only be triggered 
// via .trigger(name, ...), calling this is a no-op...
var PureEvent =
module.PureEvent =
function(name, options={}){
	return object.mixin(
		Event(name, function(handle, trigger){ 
			trigger === module.TRIGGER 
				|| handle(false) }, options),
		{
			toString: function(){
				return `PureEvent ${name}(){}`},
		}) }


// XXX
var ProxyEvent =
module.ProxyEvent =
function(name, target, options={}){
	// XXX
}



//---------------------------------------------------------------------
// Mixins...

// XXX might be nice to add support to pre/post handlers...
// XXX still not sure about the builtin-local event control flow...
// XXX do we need to be able to force global handler???
var EventHandlerMixin = 
module.EventHandlerMixin = object.Mixin('EventHandlerMixin', {
	//__event_handlers__: null,

	on: function(evt, func){
		// event...
		if(evt in this 
				&& this[evt].__event_handler_add__){
			this[evt].__event_handler_add__(this, func)
		// non-event...
		} else {
			this.__event_handlers__ == null
				&& Object.defineProperty(this, '__event_handlers__', {
					value: {},
					enumerable: false,
				})
			;(this.__event_handlers__[evt] = 
					this.__event_handlers__[evt] || [])
				.push(func) }
		return this },
	one: function(evt, func){
		var handler
		this.on(evt, 
			handler = Object.assign(
				function(handle, ...args){
					this.off(evt, handler)
					return func.call(this, handle, ...args) }.bind(this),
				{__event_original_handler__: func}))
		return this },
	// XXX do we need .off(evt, 'all')
	off: function(evt, func){
		// event...
		if(evt in this 
				&& this[evt].__event_handler_remove__){
			this[evt].__event_handler_remove__(this, func)
		// non-event...
		} else {
			var handlers = this.__event_handlers__
				&& (this.__event_handlers__[evt] || [])
			handlers
				&& handlers.splice(0, handlers.length,
					...handlers.filter(function(h){
						return h !== func 
							&& h.__event_original_handler__ !== func })) }
		return this },
	// XXX revise...
	trigger: function(evt, ...args){
		evt in this ?
			// XXX add a better check...
			this[evt](module.TRIGGER, ...args)
			: this.__event_handlers__
				&& (this.__event_handlers__[evt] || [])
					.forEach(function(h){ h(evt, ...args) }) 
		return this },
})


// NOTE: this can't be added via Object.assign(..), use object.mixinFlat(..) 
// 		instead...
var EventDocMixin = 
module.EventDocMixin = object.Mixin('EventDocMixin', {
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
})


var EventMixin = 
module.EventMixin = 
object.Mixin('EventMixin', 
	EventHandlerMixin,
	EventDocMixin)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
