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

var CooperativePromise =
module.CooperativePromise =
Promise.cooperative =
object.Constructor('CooperativePromise', Promise, {
	get isSet(){
		return !this.__resolve && !this.__reject },

	set: function(promise){
		if(!this.isSet){
			// non-promise...
			if(promise.catch == null && promise.then == null){
				this.__resolve(promise)
			// promise...
			} else {
				// connect the base and the set promises...
				promise.catch(this.__reject.bind(this))
				promise.then(this.__resolve.bind(this)) }
			// cleanup...
			delete this.__resolve
			delete this.__reject

			return this } 

		// err: already set...
		throw new Error('CooperativePromise.set(..): can not set twice') },

	__new__: function(_, func){
		var methods = {}
		var obj = Reflect.construct(CooperativePromise.__proto__, [
			function(resolve, reject){
				methods.resolve = resolve
				methods.reject = reject
				if(func){
					return func.call(this, ...arguments) } } ], 
			CooperativePromise)
		/*/ if we are fulfilled before being set, we are set :)
		// XXX for some reason this breaks either .__new__(..) if called 
		// 		outside of setTimeout(..) or hangs the promise on resolve 
		// 		if inside...
		setTimeout(function(){
			obj.finally(function(){
				delete obj.__resolve
				delete obj.__reject 
			}) }, 0)
		//*/
		// XXX revise...
		// XXX can we avoid creating these???
		// 		...one way to do this is to create a local .set(..)
		// 		that whould reference them through closure...
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
	/*
	__init__: function(){
		// if we are fulfilled before being set, we are set :)
		this.finally(function(){
			delete this.__resolve
			delete this.__reject 
		}.bind(this)) },
	//*/
})



// XXX EXPERIMENTAL -- this hides internal state (.__resolve(..) / .__reject(..))
// 		...not sure if we actually need to do this...
var _CooperativePromise =
module._CooperativePromise =
//Promise.cooperative =
object.Constructor('_CooperativePromise', Promise, {
	get isSet(){
		return this.set() },

	//set: function(){},

	__new__: function(_, func){
		// internal state...
		// NOTE: when promise is set this will be set to false...
		var methods = {}

		// instance...
		var obj = Reflect.construct(_CooperativePromise.__proto__, [
			function(resolve, reject){
				methods.resolve = resolve
				methods.reject = reject
				// NOTE: this is here mostly for promise compatibilty...
				if(func){
					// XXX this can resolve/reject a promise -- need to 
					// 		keep things consistent...
					return func.call(this, ...arguments) } } ], 
			_CooperativePromise)

		// if we are fulfilled before being set, we are set :)
		// XXX for some reason this breaks either .__new__(..) if called 
		// 		outside of setTimeout(..) or hangs the promise on resolve 
		// 		if inside...
		setTimeout(function(){
			obj.finally(function(){
				methods = false }) }, 0)

		// create instance .set(..)
		Object.defineProperty(obj, 'set', {
			value: function(promise){
				// get state...
				if(arguments.length == 0){
					return !!methods }
				if(methods){
					// non-promise...
					if(promise.catch == null && promise.then == null){
						methods.resolve(promise)
					// promise...
					} else {
						// connect the base and the set promises...
						promise.catch(methods.reject.bind(this))
						promise.then(methods.resolve.bind(this)) }
					methods = false
					return this }
				// err: already set...
				throw new Error('CooperativePromise.set(..): can not set twice') },
			enumerable: false,
			configurable: true,
		})

		return obj },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
