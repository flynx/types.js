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

// XXX should this be aborted on reject???
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
	then: function(onfulfilled, onrejected){
		return new Promise(
			function(resolve, reject){
				object.parentCall(IterablePromise.prototype.then, this,
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
	__new__: function(_, list, handler){
		var promise

		// instance...
		var obj = Reflect.construct(IterablePromise.__proto__, [
			function(resolve, reject){
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

var PromiseMixin =
module.PromiseMixin =
object.Mixin('PromiseMixin', 'soft', {
	// XXX does this need to be a distinct object/constructor???
	cooperative: function(){
		var handlers
		return object.mixinFlat(
			new Promise(function(resolve, reject){
				handlers = { resolve, reject, } }), 
			{
				get isSet(){
					return handlers === false },
				//
				//	Resolve promise with value...
				//	.set(value)
				//		-> this
				//
				//	Reject promise with value...
				//	.set(value, false)
				//		-> this
				//
				set: function(value, resolve=true){
					// can't set twice...
					if(this.isSet){
						throw new Error('Promise.cooperative().set(..): can not set twice') }
					// bind to promise...
					if(value && value.then && value.catch){
						value.then(handlers.resolve)
						value.catch(handlers.reject)
					// resolve with value...
					} else {
						resolve ?
							handlers.resolve(value) 
							: handlers.reject(value) }
					// cleanup and prevent setting twice...
					handlers = false
					return this },
			}) },

	iter: IterablePromise,
})


PromiseMixin(Promise)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
