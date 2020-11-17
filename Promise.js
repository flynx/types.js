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

// XXX does this need to be a distinct object???
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
	// XXX
	__list: null,

	map: function(func){
		return IterablePromise(this.__list, function(e, i){
			return [func(e, i)] }) },
	filter: function(func){
		return IterablePromise(this.__list, function(e, i){
			return func(e, i) ? 
				[e] 
				: [] }) },
	// XXX
	reduce: function(func, res){
		// XXX
	},
	flat: function(depth=1){
		return IterablePromise(this.__list, function(e, i){ 
			return (e && e.flat) ? 
				e.flat(depth) 
				: e }) },

	at: function(i){},
	slice: function(){},

	// 	XXX how does this support reduce???
	// 	handler(e, i)
	// 		-> [value]
	// 		-> []
	//
	__new__: function(_, list, handler=false){
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
			// XXX should this be aborted on reject???
			// XXX we are keeping the top level promises unwrapped, is 
			// 		this correct???
			// 		...needs testing....
			var c = 0
			list = obj.__list = 
				handler ?
					list.map(function(block){
						return (block instanceof Array ? 
								block 
								: [block])
							.map(function(e){
								// NOTE: we are counting actual expanded 
								// 		values and not the "blocks"...
								var i = ++c
								return (e && e.then && e.catch) ?
									// promise...
									e.then(function(v){ 
										return handler(v, i) })
									// basic value...
									: handler(e, i) }) })
						.flat()
					: list.map(function(e){ 
						return e instanceof Promise ?
							e
							: [e] })

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
