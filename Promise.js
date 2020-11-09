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
					// XXX this can fullfill the promise -- need to keep 
					// 		things consistent...
					return func.call(this, ...arguments) } } ], 
			CooperativePromise)
		/*/ if we are fulfilled before being set, we are set :)
		// XXX for some reason this breaks either .__new__(..) if called 
		// 		outside of setTimeout(..) or hangs the promise on resolve 
		// 		if inside...
		//		...the same thing happens if we call .then(..)/.catch(..)
		//		The odd thing is that calling .finally(..) later works OK...
		//		...increasing the timeout just delays the hang...
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
	/* XXX this for some reason breaks the promise...
	//		...the same thing happens if we call .then(..)/.catch(..)
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
					return !methods }
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



//---------------------------------------------------------------------
// promise iterators...

// XXX like Promise.all(..) but creates an iterable promise...
var IterablePromise =
module.IterablePromise =
Promise.iter =
object.Constructor('IterablePromise', Promise, {
	// XXX
	__list: null,

	map: function(func){
		return IterablePromise() },
	filter: function(func){},
	reduce: function(func, res){},
	flat: function(){},

	all: function(){},

	__new__: function(_, list, handler){
		// instance...
		var obj = Reflect.construct(IterablePromise.__proto__, [
			function(resolve, reject){
				// NOTE: this is here for Promise compatibilty...
				// XXX this can resolve/reject a promise -- need to 
				// 		keep things consistent...
				if(typeof(list) == 'function'){
					return func.call(this, ...arguments) } 

				// XXX
				var res = []
				for(var e of list){
				}
			}], 
			IterablePromise)

		return obj },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
