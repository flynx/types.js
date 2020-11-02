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

module.CooperativePromise =
Promise.cooperative =
object.Constructor('CooperativePromise', Promise, {
	// XXX do we actually need this???
	__promise: null,

	set: function(promise){
		if(this.__promise === null){
			// setting a non-promise...
			if(promise.catch == null && promise.then == null){
				Object.defineProperty(this, '__promise', {
					value: false,
					enumerable: false,
				})
				this.__resolve(promise)
				
			// setting a promise...
			} else {
				Object.defineProperty(this, '__promise', {
					value: promise,
					enumerable: false,
				})

				// connect the base and the set promises...
				promise.catch(this.__reject.bind(this))
				promise.then(this.__resolve.bind(this)) }

			// cleanup...
			delete this.__resolve
			delete this.__reject

		} else {
			throw new Error('Setting a cooperative promise twice') } },

	__new__: function(_, func){
		var methods = {}
		var obj = Reflect.construct(CooperativePromise.__proto__, [
			function(resolve, reject){
				methods.resolve = resolve
				methods.reject = reject
				func
					&& func.call(this, ...arguments)
			} ], CooperativePromise)
		// XXX revise...
		Object.defineProperties(obj, {
			__resolve: {
				value: methods.resolve,
				enumerable: false,
				configurable: true,
			},
			__reject: {
				value: methods.reject,
				enumerable: false,
				configurable: true,
			},
		})
		return obj },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
