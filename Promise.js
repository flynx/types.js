/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')

//var {StopIteration} = require('./Array')



/*********************************************************************/

// XXX does this need to be a distinct object/constructor???
Promise.cooperative = function(){
	var handlers
	return object.mixinFlat(
		new Promise(function(resolve, reject){
			handlers = { resolve, reject, } }), 
		{
			get isSet(){
				return handlers === false },
			set: function(value){
				// can't set twice...
				if(this.isSet){
					throw new Error('Promise.cooperative().set(..): can not set twice') }
				// bind to promise...
				if(value && value.then && value.catch){
					value.then(handlers.resolve)
					value.catch(handlers.reject)
				// resolve with value...
				} else {
					handlers.resolve(value) }
				// cleanup and prevent setting twice...
				handlers = false
				return this },
		}) }



//---------------------------------------------------------------------
// promise iterators...

var IterablePromise =
module.IterablePromise =
Promise.iter =
object.Constructor('IterablePromise', Promise, {
	// XXX do we need this to be public???
	__list: null,

	// iterator methods...
	//
	// These will return a new IterablePromise instance...
	//
	// NOTE: these are different to Array's equivalents in that the handler
	// 		is called not in the order of the elements but rather in order 
	// 		of promise resolution...
	// NOTE: index of items is unknowable because items can expand on 
	// 		contract depending on handlrs (e.g. .filter(..) can remove 
	// 		items)...
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


	// NOTE: these return a Promise instance...
	then: function(handler){
		var that = this
		return new Promise(function(resolve, reject){
			// then...
			object.parentCall(IterablePromise.prototype.then, that, 
				function(){
					resolve(handler.call(this, ...arguments)) }) 
			that.catch(reject) }) },
	catch: function(handler){
		var that = this
		return new Promise(function(resolve, reject){
			that.then(resolve)
			// catch...
			object.parentCall(IterablePromise.prototype.catch, that, 
				function(){
					reject(handler.call(this, ...arguments)) }) }) },
	finally: function(handler){
		var that = this
		return new Promise(function(resolve, reject){
			// bind promise state to that...
			that.then(resolve)
			that.catch(reject)
			// finally...
			object.parentCall(IterablePromise.prototype.finally, that,
				function(){
					handler.call(this, ...arguments) }) }) },
	

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
	__new__: function(_, list, handler){
		var promise

		// instance...
		var obj = Reflect.construct(IterablePromise.__proto__, [
			function(resolve, reject){
				// NOTE: this is here for Promise compatibilty...
				if(typeof(list) == 'function'){
					return list.call(this, ...arguments) } 
				promise = {resolve, reject} }], 
			IterablePromise)

		if(promise){
			// apply handler(..) to the list...
			// NOTE: the top level promises are not wrapped in arrays...
			// XXX should this be aborted on reject???
			// 		...need to be able to do a deep abort...
			list =
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
				: handler === undefined ?
					list.map(function(e){ 
						return e instanceof Promise ?
							e
							: [e] })
				: list.slice()

			Object.defineProperty(obj, '__list', {
				value: list,
				enumerable: false,
			})

			// handle promise state...
			Promise.all(list)
				.then(function(res){
					promise.resolve(res.flat()) })
				// XXX do we need to pass the results here???
				.catch(promise.reject) }

		return obj },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
