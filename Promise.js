/**********************************************************************
*
* This defines the following extensions to Promise:
*
* 	Promise.iter(seq)
* 	<promise>.iter()
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
* 	<promise>.as(obj)
* 		Promise proxy.
* 		Proxies the methods available from obj to promise value.
*
*
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



//---------------------------------------------------------------------
// Iterable promise...
// 
// Like Promise.all(..) but adds ability to iterate through results
// via generators .map(..)/.reduce(..) and friends...
// 
// NOTE: it would be nice to support throwing STOP from the iterable 
// 		promise but...
// 		- this is more complicated than simply using .smap(..) instead 
// 			of .map(..) because the list can contain async promises...
// 			...would need to wrap each .then(..) call in try-catch and
// 			manually handle the stop...
// 			...then there's a question of derivative iterators etc.
// 		- another issue here is that the stop would happen in order of 
// 			execution and not order of elements...
// 		XXX though stopping within a single level might be useful...
//

// NOTE: we are not using async/await here as we need to control the 
// 		type of promise returned in cases where we know we are returning 
// 		an array...
// XXX should these be exported???
var iterPromiseProxy = 
//module.iterPromiseProxy = 
function(name){
	return function(...args){
		return this.constructor(
			this.then(function(lst){
				return lst[name](...args) })) } }
var promiseProxy =
//module.promiseProxy =
function(name){
	return async function(...args){
		return (await this)[name](...args) } }

var IterablePromise =
module.IterablePromise =
object.Constructor('IterablePromise', Promise, {
	//
	// Format:
	// 	[
	//		<non-array-value>,
	//		[ <value> ],
	//		<promise>,
	//		...
	// 	]
	//
	// This format has several useful features:
	// 	- concatenating packed list results in a packed list
	// 	- adding an iterable promise (as-is) into a packed list results 
	// 		in a packed list
	//
	// NOTE: in general iterable promises are implicitly immutable, so
	// 		it is not recomended to ever edit this inplace...
	__list: null,

	// low-level .__list handlers/helpers...
	//
	// NOTE: these can be useful for debugging and extending...
	__pack: function(list, handler){
		var that = this
		// handle iterable promise list...
		if(list instanceof IterablePromise){
			return this.__handle(list.__list, handler) }
		// handle promise list...
		if(list instanceof Promise){
			return list.then(function(list){
				return that.__pack(list, handler) }) }
		// do the work...
		// NOTE: packing and handling are mixed here because it's faster
		// 		to do them both on a single list traverse...
		var handle = !!handler
		handler = handler 
			?? function(elem){ 
				return [elem] }
		return [list].flat()
			.map(function(elem){
				return elem && elem.then ?
						//that.__pack(elem, handler)
						elem.then(handler)
					: elem instanceof Array ?
						handler(elem)
					// NOTE: we keep things that do not need protecting 
					// 		from .flat() as-is...
					: !handle ?
						elem
					: handler(elem) }) },
	__handle: function(list, handler){
		var that = this
		if(typeof(list) == 'function'){
			handler = list
			list = this.__list }
		if(!handler){
			return list }
		// handle promise list...
		if(list instanceof Promise){
			return list.then(function(list){
				return that.__handle(list, handler) }) }
		// do the work...
		// NOTE: since each section of the packed .__array is the same 
		// 		structure as the input we'll use .__pack(..) to handle 
		// 		them, this also keeps all the handling code in one place.
		return list.map(function(elem){
			return elem instanceof Array ?
					that.__pack(elem, handler)
				: elem instanceof Promise ?
					that.__pack(elem, handler)
						.then(function(elem){
							return elem.flat() })
				: [handler(elem)] })
   			.flat() },
	__unpack: function(list){
		list = list 
			?? this.__list
		// handle promise list...
		if(list instanceof Promise){
			var that = this
			return list.then(function(list){
				return that.__unpack(list) }) }
		// do the work...
		return Promise.all(list)
			.then(function(list){
				return list.flat() }) },


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
	// NOTE: index of items is unknowable because items can expand and
	// 		contract depending on handlrs (e.g. .filter(..) can remove 
	// 		items)...
	// 		Thus the following can not be implemented here:
	// 			.splice(..)				- can't both modify and return
	// 									  a result...
	// 			[Symbol.iterator]()		- needs to be sync...
	// 		These are direct poxies requiring the whole promuse to 
	// 		resolve:
	// 			.at(..) / .first() / .last()
	// 									- special case: elements 
	// 									  0 and -1 can in sime cases 
	// 									  resolve early...
	// 			.slice(..)
	// 			.entries() / .values() / .keys()
	// 			.indexOf(..)
	// 			.includes(..)
	// 			.some(..) / .every(..)
	// 			.sort(..)
	map: function(func){
		return this.constructor(this, 
			function(e){
				var res = func(e)
				return res instanceof Promise ?
		   			res.then(function(e){ 
						return [e] })
					: [res] }) },
	filter: function(func){
		return this.constructor(this, 
			function(e){
				var res = func(e)
				var _filter = function(elem){
					return res ?
						[elem]
						: [] }
				return res instanceof Promise ?
					res.then(_filter)
					: _filter(e) }) },
	// NOTE: this does not return an iterable promise as we can't know 
	// 		what the user reduces to...
	// 		XXX we could look at the initial state though...
	// NOTE: the items can be handled out of order because the nested 
	// 		promises can resolve in any order...
	// NOTE: since order of execution can not be guaranteed there is no
	// 		point in implementing .reduceRight(..)
	reduce: function(func, res){
		return this.constructor(this, 
				function(e){
					res = func(res, e)
					return [] })
			.then(function(){ 
				return res }) },

	flat: function(depth=1){
		return this.constructor(this, 
			function(e){ 
				return (depth > 1 
							&& e != null 
							&& e.flat) ? 
						e.flat(depth-1) 
					: depth != 0 ?
						e
					: [e] }) },
	reverse: function(){
		var lst = this.__list
		return this.constructor(
			lst instanceof Promise ?
				lst.then(function(elems){
					return elems instanceof Array ?
						elems.slice()
							.reverse()
						: elems })
			: lst
				.map(function(elems){
					return elems instanceof Array ?
							elems.slice()
								.reverse()
						: elems instanceof Promise ?
							elems.then(function(elems){
								return elems.reverse() })
						: elems })
				.reverse(),
			'raw') },

	// NOTE: the following methods can create an unresolved promise from 
	// 		a resolved promise...
	concat: function(other){
		var that = this
		var cur = this.__pack(this)
		var other = this.__pack(other)
		return this.constructor(
			// NOTE: we need to keep things as exposed as possible, this 
			// 		is why we're not blanketing all the cases with 
			// 		Promise.all(..)...
			(cur instanceof Promise 
					&& other instanceof Promise) ?
				[cur, other]
			: cur instanceof Promise ?
				[cur, ...other]
			: other instanceof Promise ?
				[...cur, other]
			: [...cur, ...other],
			'raw') },
	push: function(elem){
		return this.concat([elem]) },
	unshift: function(elem){
		return this.constructor([elem])
			.concat(this) },

	// XXX can we do these?
	// 			.pop()
	// 			.shift()
	// 			.splice(..)
	// 		...would be nice if these could stop everything that's not
	// 		needed to execute -- likely not possible (XXX)
	// 		...these need to somehow both return an element and affect 
	// 		the iterator (or return a new one) -- we can trivially do either
	// 		one action within the spec but not both...

	// NOTE: this can avoid waiting for the whole promise to resolve only
	// 		for indexes 0 and -1, everything else is non-deterministic and
	// 		we'll have to wait for the whole thing to resolve.
	at: async function(i){
		var list = this.__list
		return ((i != 0 && i != -1)
					|| list instanceof Promise
					|| list.at(i) instanceof Promise) ?
				(await this).at(i)
			// NOTE: we can only reason about first/last explicit elements, 
			// 		anything else is non-deterministic...
			: list.at(i) instanceof Promise ?
				[await list.at(i)].flat().at(i)
			: list.at(i) instanceof Array ?
				list.at(i).at(i)
			: list.at(i) },
	first: function(){
		return this.at(0) },
	last: function(){
		return this.at(-1) },
	
	// NOTE: there is no way we can do a sync generator returning 
	// 		promises for values because any promise in .__list makes the 
	// 		value count/index non-deterministic...
	sort: iterPromiseProxy('sort'),
	slice: iterPromiseProxy('slice'),
	entries: iterPromiseProxy('entries'),
	keys: iterPromiseProxy('keys'),
	// XXX we could possibly make this better via .map(..)
	values: iterPromiseProxy('values'),

	indexOf: promiseProxy('indexOf'),
	includes: promiseProxy('includes'),

	every: promiseProxy('every'),
	// XXX this can be lazy...
	some: promiseProxy('some'),


	// Overload .then(..), .catch(..) and .finally(..) to return a plain 
	// Promise instnace...
	//
	// NOTE: .catch(..) and .finally(..) are implemented through .then(..)
	// 		so we do not need to overload those...
	// NOTE: this is slightly different from .then(..) in that it can be 
	// 		called without arguments and return a promise wrapper. This can
	// 		be useful to hide special promise functionality...
	then: function (onfulfilled, onrejected){
		var p = new Promise(
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
		return arguments.length > 0 ?
			p.then(...arguments) 
			: p },


	//
	//	Promise.iter([ .. ])
	//		-> iterable-promise
	//
	//	Promise.iter([ .. ], handler)
	//		-> iterable-promise
	//
	//
	// 	handler(e)
	// 		-> [value, ..]
	// 		-> []
	// 		-> <promise>
	//
	//
	// NOTE: element index is unknowable until the full list is expanded
	// 		as handler(..)'s return value can expand to any number of 
	// 		items...
	// 		XXX we can make the index a promise, then if the client needs
	// 			the value they can wait for it...
	//
	//
	// Special cases useful for extending this constructor...
	//
	//	Set raw .__list without any pre-processing...
	//	Promise.iter([ .. ], 'raw')
	//		-> iterable-promise
	//
	//	Create a rejected iterator...
	//	Promise.iter(false)
	//		-> iterable-promise
	//
	//
	// XXX iterator/generator as input:
	// 		- do we unwind here or externally?
	// 			...feels like with the generator external unwinding is 
	// 			needed...
	// XXX how do we handle errors/rejections???
	__new__: function(_, list, handler){
		// instance...
		var promise
		var obj = Reflect.construct(
			IterablePromise.__proto__, 
			[function(resolve, reject){
				// NOTE: this is here for Promise compatibility...
				if(typeof(list) == 'function'){
					return list.call(this, ...arguments) } 
				// initial reject... 
				if(list === false){
					return reject() }
				promise = {resolve, reject} }], 
			IterablePromise)

		// populate new instance...
		if(promise){
			// handle/pack input data...
			if(handler != 'raw'){
				list = list instanceof IterablePromise ?
					this.__handle(list.__list, handler)
					: this.__pack(list, handler) }
			Object.defineProperty(obj, '__list', {
				value: list,
				enumerable: false,
			})
			// handle promise state...
			this.__unpack(list)
				.then(function(list){
					promise.resolve(list) })
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
	// XXX do we need a way to remove handlers???
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
			// remove all handlers...
			if(func === false){
				var h = (obj == null ?
					handlers
					: (obj.__message_handlers || []))
				h.splice(0, handlers.length)
			// remove a specific handler...
			} else if(arguments[1] === false){
				var h = (obj == null ?
					handlers
					: (obj.__message_handlers || []))
				h.splice(h.indexOf(func), 1)
			// register a handler...
			} else {
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
				handlers.push(func) } }

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
			// XXX should this be .configurable???
			configurable: true,
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

// XXX EXPEREMENTAL...
var ProxyPromise =
module.ProxyPromise =
object.Constructor('ProxyPromise', Promise, {
	__new__: function(context, constructor){
		var proto = 'prototype' in constructor ?
			constructor.prototype
			: constructor
		var obj = Reflect.construct(
			ProxyPromise.__proto__, 
			[function(resolve, reject){
				context.then(resolve)
				context.catch(reject) }], 
			ProxyPromise) 
		// populate...
		// NOTE: we are not using object.deepKeys(..) here as we need 
		// 		the key origin not to trigger property getters...
		var seen = new Set()
		while(proto != null){
			Object.entries(Object.getOwnPropertyDescriptors(proto))
				.forEach(function([key, value]){
					// skip overloaded keys...
					if(seen.has(key)){
						return }
					// skip non-functions...
					if(typeof(value.value) != 'function'){
						return }
					// skip non-enumerable except for Object.prototype.run(..)...
					if(!(key == 'run' 
								&& Object.prototype.run === value.value) 
							&& !value.enumerable){
						return }
					// proxy...
					obj[key] = promiseProxy(key) })
			proto = proto.__proto__ } 
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


var PromiseProtoMixin =
module.PromiseProtoMixin =
object.Mixin('PromiseProtoMixin', 'soft', {
	as: ProxyPromise,
	iter: function(handler){
		return IterablePromise(this, handler) },
})

PromiseProtoMixin(Promise.prototype)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
