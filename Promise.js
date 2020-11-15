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

// XXX we need to:
// 		- wrap each elem in a promise
// 		- on each map/filter/... chain the handler to each elem and return 
// 			a new iterable with the combination
// XXX like Promise.all(..) but creates an iterable promise...
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
	reduce: function(func, res){},
	flat: function(){},

	all: function(){},

	// 	XXX how does this support reduce???
	// 	handler(e, i)
	// 		-> [value]
	// 		-> []
	//
	__new__: function(_, list, handler=false){
		// instance...
		var obj = Reflect.construct(IterablePromise.__proto__, [
			function(resolve, reject){
				// NOTE: this is here for Promise compatibilty...
				if(typeof(list) == 'function'){
					return func.call(this, ...arguments) } 

				var all = Promise.all(list)

				// XXX
				var res = []
				list.forEach(function(e, i){
					if(handler && e && e.then && e.catch){
						e.then(function(v){ 
							return (res[i] = handler(v, i)) })

					} else {
						res[i] = e } })
			}], 
			IterablePromise)

		return obj },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
