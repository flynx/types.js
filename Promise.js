/**********************************************************************
* 
*
*
*
* This defines the following extensions to Promise:
*
* 	Promise.iter(seq)
* 		Iterable promise object.
* 		Similar to Promise.all(..) but adds basic iterator/generator
* 		API and will resolve the items as they are ready (resolved).
*
* 	Promise.interactive(handler)
* 		Interactive promise object.
* 		This adds a basic message passing API to the promise.
*
* 	Promise.cooperative()
* 		Cooperative promise object.
* 		Exposes the API to resolve/reject the promise object 
* 		externally.
*
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



/*********************************************************************/
// Iterable promise...
// 
// Like Promise.all(..) but adds ability to iterate through results
// via generators .map(..)/.reduce(..) and friends...
// 

var IterablePromise =
module.IterablePromise =
object.Constructor('IterablePromise', Promise, {
	//
	// Format:
	// 	[
	//		[ <value> ],
	//		<promise>,
	//		...
	// 	]
	//
	__list: null,


	// iterator methods...
	//
	// These will return a new IterablePromise instance...
	//
	// When called from a resolved promise these will return a new 
	// resolved promise with updated values...
	//
	// When called from a rejected promise these will return a rejected 
	// with the same reason promise...
	//
	//
	// NOTE: these are different to Array's equivalents in that the handler
	// 		is called not in the order of the elements but rather in order 
	// 		of promise resolution...
	// NOTE: index of items is unknowable because items can expand on 
	// 		contract depending on handlrs (e.g. .filter(..) can remove 
	// 		items)...
	// 		This the following can not be implemented here:
	// 			.slice(..)
	// 			.splice(..)
	// 			.at(..)
	// 			[Symbol.iterator]()		- needs to be sync...
	// 		The followng methods are questionable:
	// 			.indexOf(..)
	// 			.includes(..)
	// 			.some(..) / .every(..)
	// 			.sort(..)
	map: function(func){
		return this.constructor(this.__list, function(e){
			return [func(e)] }) },
	filter: function(func){
		return this.constructor(this.__list, function(e){
			return func(e) ? 
				[e] 
				: [] }) },
	reduce: function(func, res){
		return this.constructor(this.__list, 
			function(e){
				res = func(res, e)
				return [] })
			.then(function(){ 
				return res }) },
	flat: function(depth=1){
		return this.constructor(this.__list, function(e){ 
			return (e && e.flat) ? 
				e.flat(depth) 
				: e }) },


	// XXX do we need:
	// 			.pop()
	// 			.shift()
	// 			.first() / .last()
	// XXX these can change the "resolved" state...
	// 		...i.e. return a pending promise when called from a fulfilled 
	// 		promise....
	// 			.concat(..)
	// 			.push(..)
	// 			.unshift(..)
	// 			.first(..) / .last(..)


	// Overload .then(..), .catch(..) and .finally(..) to return a plain 
	// Promise instnace...
	//
	// NOTE: .catch(..) and .finally(..) are implemented through .then(..)
	// 		so we do not need to overload those...
	then: function (onfulfilled, onrejected){
		return new Promise(
			function(resolve, reject){
				Promise.prototype.then.call(this,
					// NOTE: resolve(..) / reject(..) return undefined so
					// 		we can't pass them directly here...
					function(res){ 
						resolve(res)
						return res },
					function(res){
						reject(res)
						return res }) }.bind(this))
			.then(...arguments) },


	//
	//	Promise.iter([ .. ])
	//		-> iterable-promise
	//
	//	Promise.iter([ .. ], handler)
	//		-> iterable-promise
	//
	//
	// 	handler(e)
	// 		-> [value]
	// 		-> []
	//
	//
	// NOTE: element index is unknowable untill the full list is expanded
	// 		as handler(..)'s return value can expand to any number of 
	// 		items...
	// 		XXX we can make the index a promise, then if the client needs
	// 			the value they can wait for it...
	//
	//
	// Spectial cases usefull for extending this constructor...
	//
	//	Clone the iterator...
	//	Promise.iter([ .. ], false)
	//		-> iterable-promise
	//
	//	Create a rejected iterator...
	//	Promise.iter(false)
	//		-> iterable-promise
	//
	//
	// XXX if list is an iterator, can we fill this async???
	__new__: function(_, list, handler){
		var promise

		// instance...
		var obj = Reflect.construct(
			IterablePromise.__proto__, 
			[function(resolve, reject){
				// NOTE: this is here for Promise compatibilty...
				if(typeof(list) == 'function'){
					return list.call(this, ...arguments) } 
				// initial reject... 
				if(list === false){
					return reject() }
				promise = {resolve, reject} }], 
			IterablePromise)

		if(promise){
			// apply handler(..) to the list...
			//
			// NOTE: the top level promises are not wrapped in arrays...
			list =
				// apply the handler...
				handler ?
					list.map(function(block){
						return (block instanceof Array ? 
								block 
								: [block])
							.map(function(e){
								// NOTE: we are counting actual expanded 
								// 		values and not the "blocks"...
								return (e && e.then && e.catch) ?
									// promise...
									e.then(function(v){ 
										return handler(v) })
									// basic value...
									: handler(e) }) })
						.flat()
				// normal constructor...
				: handler === undefined ?
					list.map(function(e){ 
						return e instanceof Promise ?
							e
							: [e] })
				// clone...
				: list.slice()

			Object.defineProperty(obj, '__list', {
				value: list,
				enumerable: false,
			})

			// handle promise state...
			Promise.all(list)
				.then(function(res){
					promise.resolve(res.flat()) })
				.catch(promise.reject) }

		return obj },
})



//---------------------------------------------------------------------
// Interactive promise...
// 
// Adds ability to send messages to the running promise.
// 

var InteractivePromise =
module.InteractivePromise =
object.Constructor('InteractivePromise', Promise, {
	__message_handlers: null,

	send: function(...args){
		var that = this
		;(this.__message_handlers || [])
			.forEach(function(h){ h.call(that, ...args) })
		return this },

	then: IterablePromise.prototype.then,

	//
	//	Promise.interactive(handler)
	//		-> interacive-promise
	//
	//	handler(resolve, reject, onmessage)
	//
	//	onmessage(func)
	//
	//
	__new__: function(_, handler){
		var handlers = []
		var onmessage = function(func){
			var h = obj == null ?
				// NOTE: we need to get the handlers from .__message_handlers
				// 		unless we are not fully defined yet, then use the 
				// 		bootstrap container (handlers)...
				// 		...since we can call onmessage(..) while the promise 
				// 		is still defined there is no way to .send(..) until it
				// 		returns a promise object, this races here are highly 
				// 		unlikely...
				handlers
				: (obj.__message_handlers = 
					obj.__message_handlers ?? [])
			handlers.push(func) }

		var obj = Reflect.construct(
			InteractivePromise.__proto__, 
			!handler ?
				[]
				: [function(resolve, reject){
					return handler(resolve, reject, onmessage) }], 
			InteractivePromise)
		Object.defineProperty(obj, '__message_handlers', {
			value: handlers,
			enumerable: false,
		})
   		return obj },
})



//---------------------------------------------------------------------
// Cooperative promise...
// 
// A promise that can be resolved/rejected externally.
// NOTE: normally this has no internal resolver logic...
// 

var CooperativePromise =
module.CooperativePromise =
object.Constructor('CooperativePromise', Promise, {
	__handlers: null,

	get isSet(){
		return this.__handlers === false },

	set: function(value, resolve=true){
		// can't set twice...
		if(this.isSet){
			throw new Error('.set(..): can not set twice') }
		// bind to promise...
		if(value && value.then && value.catch){
			value.then(handlers.resolve)
			value.catch(handlers.reject)
		// resolve with value...
		} else {
			resolve ?
				this.__handlers.resolve(value) 
				: this.__handlers.reject(value) }
		// cleanup and prevent setting twice...
		this.__handlers = false
		return this },

	then: IterablePromise.prototype.then,

	__new__: function(){
		var handlers
		var resolver = arguments[1]

		var obj = Reflect.construct(
			CooperativePromise.__proto__, 
			[function(resolve, reject){
				handlers = {resolve, reject} 
				// NOTE: this is here to support builtin .then(..)
				resolver
					&& resolver(resolve, reject) }], 
			CooperativePromise) 

		Object.defineProperty(obj, '__handlers', {
			value: handlers,
			enumerable: false,
			writable: true,
		})
		return obj },
})



//---------------------------------------------------------------------

var PromiseMixin =
module.PromiseMixin =
object.Mixin('PromiseMixin', 'soft', {
	iter: IterablePromise,
	interactive: InteractivePromise,
	cooperative: CooperativePromise,
})


PromiseMixin(Promise)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
