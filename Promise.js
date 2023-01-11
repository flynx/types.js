/**********************************************************************
*
* This defines the following extensions to Promise:
*
* 	Promise.iter(seq)
* 	<promise>.iter()
* 		Iterable promise object.
* 		Similar to Promise.all(..) but adds basic iterator API.
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

var generator = require('./generator')



//---------------------------------------------------------------------
// XXX EXPERIMENTING...

// packed format API...
//
// XXX should this be a container or just a set of function???
// 		...for simplicity I'll keep it a stateless set of functions for 
// 		now, to avoid yet another layer of indirection -- IterablePromise...
// XXX BUG:
//		wrong, should be the same as the second example:
//			await pr.unpack(
//				pr.handle(
//					pr.pack([
//						1, 
//						[2], 
//						Promise.resolve(3), 
//						Promise.resolve([4]),
//					]), 
//					e => [[1,2,3]]))
//				//					    XXX
//				-> [ [1,2,3], [1,2,3], 1,2,3, [1,2,3] ]
//		correct:
//			await pr.unpack(
//				pr.handle(
//					pr.pack([
//						1, 
//						[2], 
//						Promise.resolve(3), 
//						Promise.resolve([4]),
//					]), 
//					e => Promise.resolve([[1,2,3]])))
//				-> [ [1,2,3], [1,2,3], [1,2,3], [1,2,3] ]

var packed = 
module.packed =
{
	//
	//	pack(<array>)
	//	pack(<promise>)
	//		-> <packed>
	//
	//	<packed> ::=
	//		<packed-array>
	//		| <packed-promise>
	//
	//	<packed-array> ::=
	//		[
	//			<item>
	//			| <items>				- array
	//			| <promise-item>
	//			| <promise-items>,
	//			...
	//		]
	//
	// NOTE: when all promises are expanded the packed array can be unpacked 
	// 		by simply calling .flat()
	// NOTE: if 'types/Array' is imported this will support throwing STOP
	// 		from the handler.
	// 		Due to the async nature of promises though the way stops are 
	// 		handled may be unpredictable -- the handlers can be run out 
	// 		of order, as the nested promises resolve and thus throwing 
	// 		stop will stop the handlers not yet run and not the next 
	// 		handlers in sequence.
	//
	// XXX see if we should self-expand promises...
	// XXX migrate these back into InteractivePromise...
	// XXX does this need onerror(..) ???
	pack: function(list){
		var that = this
		// list: promise...
		// XXX should we just test for typeof(list.then) == 'function'???
		if(list instanceof Promise
				// list: async promise...
				|| (typeof(list) == 'object' 
					&& list.then
					&& Symbol.asyncIterator in list)){
			return list
				.then(this.pack.bind(this)) }
		// list: generator...
		if(typeof(list) == 'object' 
				&& !list.map
				&& Symbol.iterator in list){
			list = [...list] }
		// list: non-array / non-iterable...
		if(typeof(list.map) != 'function'){
			list = [list].flat() }
		// list: array...
		// XXX should we self-expand this???
		return list
			.map(function(elem){
				// XXX should we expand generators here???
				return elem instanceof Array ?
						[elem]
					// XXX should we just test for .then(..)???
					// XXX should we self-expand this???
					: elem instanceof Promise ?
						elem.then(function(elem){
							return elem instanceof Array ?
								[elem]
								: elem })
					: elem }) },
	// 
	// 	handle(<packed>, <handler>[, <onerror>])
	// 		-> <packed>
	//
	// XXX revise nested promise handling...
	// 		...something like simplify(<packed>) -> <packed> ???
	// XXX STOP_PROMISED_HANDLERS -- TEST
	handle: function(packed, handler, onerror){
		var that = this
		var handlers = [...arguments].slice(1)

		if(packed instanceof Promise){
			return packed.then(function(packed){
				return that.handle(packed, ...handlers) }) }

		var stop = false
		var map = Array.STOP ?
			'smap'
			: 'map'
		return packed
			// NOTE: we do not need to rapack after this because the handlers 
			// 		will get the correct (unpacked) values and it's their 
			// 		responsibility to pack them if needed...
			.flat()
			[map](
				function(elem){
					return elem instanceof Promise ?
						elem.then(function(elem){
							if(stop){
								return [] }
							var has_promise = false
							var res = 
								elem instanceof Array ?
									// un-.flat()-end arrays in promise...
									// NOTE: do the same thing handle(..) does 
									// 		but on a single level, without expanding 
									// 		arrays...
									elem.map(function(elem){
										var res = elem instanceof Promise ?
											// XXX STOP_PROMISED_HANDLERS do we need this???
											elem.then(function(elem){
												if(stop){
													return [] }
												return handler(elem) })
											/*/ 
											elem.then(handler)
											//*/
											: handler(elem) 
										has_promise = has_promise
											|| res instanceof Promise
										return res })
									// other...
									: handler(elem)
							// compensate for the outer .flat()...
							return (has_promise 
										&& res instanceof Array) ?
									// NOTE: since we are already in a promise 
									// 		grouping things here is not a big 
									// 		deal (XXX ???), however this is needed 
									// 		to link nested promises with the 
									// 		containing promise...
									// XXX .all(..) will resolve after all the 
									// 		contents are resolved, while returning 
									// 		res.flat() will allow access to all the 
									// 		values including the individual promises
									// 		can we combine the two???
									// 		...can we split this up into promises and
									// 		other values and Promise.all(..) only 
									// 		the promises???
									//res.flat()
									Promise.all(res)
										.then(function(res){
											return res.flat() })
								// XXX the over-expand problem appears to be here...
								: res instanceof Array ?
									res.flat()
								: res })
						: handler(elem) },
				// onerror...
				// XXX STOP_PROMISED_HANDLERS
				function(err){
					stop = true
					typeof(onerror)
						&& onerror(err) }) },
				/*/
				...handlers.slice(1)) }, 
				//*/
	//
	// 	unpack(<packed>)
	// 		-> <array>
	//
	unpack: function(packed){
		if(packed instanceof Promise){
			return packed.then(this.unpack.bind(this)) }
		var input = packed
		// NOTE: we expand promises on the first two levels of the packed 
		// 		list and then flatten the result...
		for(var [i, elem] of Object.entries(packed)){
			// expand promises in lists...
			if(elem instanceof Array){
				for(var e of elem){
					if(e instanceof Promise){
						// copy the input (on demand) list as we'll need to 
						// modify it...
						packed === input
							&& (packed = packed.slice())
						// NOTE: this will immediately be caught by the 
						// 		Promise condition below...
						elem = packed[i] = 
							Promise.all(elem)
						break } } }
			// expand promises...
			if(elem instanceof Promise){
				return Promise.all(packed)
					.then(this.unpack.bind(this)) } }
		// the list is expanded here...
		return packed.flat() },
}


//
// 	itemResolved(<list>, <onupdate>[, <ondone>])
// 	itemResolved(<list>, <options>)
// 		-> <list>
//
// 	<onupdate>(<elem>, <index>, <list>)
//
// 	<ondone>(<list>)
//
// options format:
// 	{
// 		onupdate: <func>,
//
// 		// optional
// 		ondone: <func>,
// 	}
//
// XXX rename to Promise.each(..) or Promise.eachPromise(..) ???
var itemResolved =
module.itemResolved =
function(list, onupdate, ondone){
	if(typeof(onupdate) != 'function'){
		var {onupdate, ondone} = onupdate }
	typeof(ondone) == 'function'
		&& Promise.all(list)
			.then(ondone)
	for(let [i, elem] of Object.entries(list)){
		if(elem instanceof Promise){
			elem.then(function(elem){
				onupdate(elem, i, list) }) } }
	return list }

// Like itemResolved(..) but both onupdate and ondone are optional...
//
// XXX do not modify the array after this is called and until ondone(..) is called...
// XXX should this know how to expand things???
var selfResolve =
module.selfResolve =
function(list, onupdate, ondone){
	if(onupdate 
			&& typeof(onupdate) != 'function'){
		var {onupdate, ondone} = onupdate }
	return itemResolved(list, 
		function(elem, i, list){
			list[i] = elem 
			typeof(onupdate) == 'function'
				&& onupdate(elem, i, list) }, 
		ondone) }



//---------------------------------------------------------------------
// Iterable promise...
// 
// Like Promise.all(..) but adds ability to iterate through results
// via generators .map(..)/.reduce(..) and friends...
// 
// NOTE: the following can not be implemented here:
// 			.splice(..)				- can't both modify and return
// 									  a result...
// 			.pop() / .shift()		- can't modify the promise, use 
// 									  .first() / .last() instead.
// 			[Symbol.iterator]()		- needs to be sync and we can't
// 									  know the number of elements to
// 									  return promises before the whole
// 									  iterable promise is resolved.
// NOTE: we are not using async/await here as we need to control the 
// 		type of promise returned in cases where we know we are returning 
// 		an array...
// NOTE: there is no point in implementing a 1:1 version of this that 
// 		would not support element expansion/contraction as it would only 
// 		simplify a couple of methods that are 1:1 (like .map(..) and 
// 		.some(..)) while methods like .filter(..) will throw everything
// 		back to the complex IterablePromise...
// 		
// XXX how do we handle errors/rejections???
// 		...mostly the current state is OK, but need more testing...
// XXX add support for async generators...
// 		

var EMPTY = {doc: 'empty placeholder'}


var iterPromiseProxy = 
module.iterPromiseProxy = 
function(name){
	return function(...args){
		return this.constructor(
			this.then(function(lst){
				return lst[name](...args) })) } }

// XXX ASYNC should this be async or simply return a SyncPromise/Promise???
var promiseProxy =
module.promiseProxy =
function(name){
	return async function(...args){
		return (await this)[name](...args) } }


var IterablePromise =
module.IterablePromise =
object.Constructor('IterablePromise', Promise, {
	get STOP(){
		return Array.STOP },

}, {
	// packed array...
	//
	// Holds promise state.
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
	// 	- concatenating packed lists results in a packed list
	// 	- adding an iterable promise (as-is) into a packed list results 
	// 		in a packed list
	//
	// NOTE: in general iterable promises are implicitly immutable, so
	// 		it is not recomended to ever edit this in-place...
	// NOTE: we are not isolating or "protecting" any internals to 
	// 		enable users to responsibly extend the code.
	__packed: null,

	// low-level .__packed handlers/helpers...
	//
	// NOTE: these can be useful for debugging and extending...
	//
	// pack and oprionally transform/handle an array (sync)...
	__pack: function(list, handler=undefined, onerror=undefined){
		// handle iterable promise...
		if(list instanceof IterablePromise){
			return this.__handle(list.__packed, handler, onerror) }
		// handle promise / async-iterator...
		if(typeof(list) == 'object' 
					&& Symbol.asyncIterator in list){
			return list
				.iter(handler, onerror) 
				.then(function(list){
					return that.__pack(list) }) } 

		// do the packing...
		var packed = module.packed.pack(list)
		// handle if needed...
		return handler ?
			this.__handle(packed, handler, onerror)
			: packed },
	// transform/handle packed array (sync, but can return promises in the list)...
	__handle: function(packed, handler=undefined, onerror=undefined){
		var that = this
		// do .__handle(<func>)
		if(typeof(packed) == 'function'){
			handler = packed
			packed = this.__packed }
		if(!handler){
			return packed }
		return module.packed.handle(packed, ...[...arguments].slice(1)) },
	// unpack array (sync/async)...
	__unpack: function(packed){
		// do .__unpack()
		packed = packed 
			?? this.__packed
		// handle promise list...
		if(packed instanceof IterablePromise){
			return packed.__unpack() }
		return module.packed.unpack(packed) },


	[Symbol.asyncIterator]: async function*(){
		var list = this.__packed
		if(list instanceof Promise){
			yield* await this.__unpack(list) 
			return }
		for await(var elem of list){
			yield* elem instanceof Array ?
				elem
				: [elem] } },

	// iterator methods...
	//
	// These will return a new IterablePromise instance...
	//
	// NOTE: these are different to Array's equivalents in that the handler
	// 		is called not in the order of the elements but rather in order 
	// 		of promise resolution...
	// NOTE: index of items is unknowable because items can expand and
	// 		contract depending on handlers (e.g. .filter(..) can remove 
	// 		items)...
	map: function(func){
		return this.constructor(this, 
			function(e){
				return [func(e)] }) },
	filter: function(func){
		return this.constructor(this, 
			function(e){
				var res = func(e)
				return res instanceof Promise ?
					res.then(function(res){
						return res ?
							[e]
							: [] })
					: res ?
						[e]
					: [] }) },
	// NOTE: this does not return an iterable promise as we can't know 
	// 		what the user reduces to...
	// NOTE: the items can be handled out of order because the nested 
	// 		promises can resolve in any order...
	// NOTE: since order of execution can not be guaranteed there is no
	// 		point in implementing .reduceRight(..) in the same way 
	// 		(see below)...
	reduce: function(func, res){
		return this.constructor(this, 
				function(e){
					res = func(res, e)
					return [] })
			.then(function(){ 
				return res }) },

	// XXX BETWEEN...
	between: function(func){
		var i = 0
		var j = 0
		var prev
		return this.constructor(this,
			function(e){
				return i++ > 0 ?
					[
						typeof(func) == 'function' ?
							func.call(this, [prev, e], i, i + j++)
							: func,
						e,
					]
					: [e] }) },

	// XXX .chain(..) -- see generator.chain(..)

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
		var lst = this.__packed
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

	// proxy methods...
	//
	// These require the whole promise to resolve to trigger.
	//
	// An exception to this would be .at(0)/.first() and .at(-1)/.last()
	// that can get the target element if it's accessible.
	//
	// NOTE: methods that are guaranteed to return an array will return
	// 		an iterable promise (created with iterPromiseProxy(..))...
	//
	// XXX ASYNC should this be async or simply return a SyncPromise/Promise???
	at: async function(i){
		var list = this.__packed
		return ((i != 0 && i != -1)
					|| list instanceof Promise
					// XXX not sure if this is correct...
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
	
	// NOTE: unlike .reduce(..) this needs the parent fully resolved 
	// 		to be able to iterate from the end.
	// XXX is it faster to do .reverse().reduce(..) ???
	reduceRight: promiseProxy('reduceRight'),

	// NOTE: there is no way we can do a sync generator returning 
	// 		promises for values because any promise in .__packed makes 
	// 		the value count/index non-deterministic...
	sort: iterPromiseProxy('sort'),
	slice: iterPromiseProxy('slice'),

	entries: iterPromiseProxy('entries'),
	keys: iterPromiseProxy('keys'),
	values: iterPromiseProxy('values'),

	indexOf: promiseProxy('indexOf'),
	lastIndexOf: promiseProxy('lastIndexOf'),
	includes: promiseProxy('includes'),

	//
	// 	.find(<func>)
	// 	.find(<func>, 'value')
	// 		-> <promise>(<value>)
	//
	// 	.find(<func>, 'result')
	// 		-> <promise>(<result>)
	//
	// 	.find(<func>, 'bool')
	// 		-> <promise>(<bool>)
	//
	// NOTE: this is slightly different to Array's .find(..) in that it 
	// 		accepts the result value enabling returning both the value 
	// 		itself ('value', default), the test function's result 
	// 		('result') or true/false ('bool') -- this is added to be 
	// 		able to distinguish between the undefined as a stored value 
	// 		and undefined as a "nothing found" result.
	// NOTE: I do not get how essentially identical methods .some(..) 
	// 		and .find(..) got added to JS's Array...
	// 		the only benefit is that .some(..) handles undefined values 
	// 		stored in the array better...
	// NOTE: this will return the result as soon as it's available but 
	// 		it will not stop the created but unresolved at the time 
	// 		promises from executing, this is both good and bad:
	// 		+ it will not break other clients waiting for promises 
	// 			to resolve...
	// 		- if no clients are available this can lead to wasted 
	// 			CPU time...
	//
	// XXX ASYNC should this be async or simply return a SyncPromise/Promise???
	find: async function(func, result='value'){
		var that = this
		// NOTE: not using pure await here as this is simpler to actually 
		// 		control the moment the resulting promise resolves without 
		// 		the need for juggling state...
		return new Promise(function(resolve, reject){
			var resolved = false
			that.map(function(elem){
					var res = func(elem)
					if(res){
						resolved = true
						resolve(
							result == 'bool' ?
								true
							: result == 'result' ?
								res
							: elem)
						// XXX EXPEREMENTAL: STOP...
						// NOTE: we do not need to throw STOP here 
						// 		but it can prevent some overhead...
						if(that.constructor.STOP){
							throw that.constructor.STOP } } })
				.then(function(){
					resolved
						|| resolve(
							result == 'bool' ?
								false
								: undefined) }) }) },
	findIndex: promiseProxy('findIndex'),

	// NOTE: this is just a special-case of .find(..)
	// XXX ASYNC should this be async or simply return a SyncPromise/Promise???
	some: async function(func){
		return this.find(func, 'bool') },
	every: promiseProxy('every'),


	// XXX ASYNC should this be async or simply return a SyncPromise/Promise???
	join: async function(){
		return [...(await this)]
			.join(...arguments) },


	// this is defined globally as Promise.prototype.iter(..)
	//
	// for details see: PromiseMixin(..) below...
	//iter: function(handler=undefined){ ... },


	// promise api...
	//
	// Overload .then(..), .catch(..) and .finally(..) to return a plain 
	// Promise instnace...
	//
	// NOTE: .catch(..) and .finally(..) are implemented through .then(..)
	// 		so we do not need to overload those...
	// NOTE: this is slightly different from .then(..) in that it can be 
	// 		called without arguments and return a promise wrapper. This can
	// 		be useful to hide special promise functionality...
	//
	// NOTE: this is internally linked to the actual (via: ..then.call(this, ..)) 
	// 		state and will be resolved in .__new__(..) below.
	then: function(onfulfilled, onrejected){
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
	// XXX EXPEREMENTAL revise...
	// Like .then(..) but returns an IterablePromise instance...
	iterthen: function(onfulfilled, onrejected){
		if(this.isSync()){
			var res = onfulfilled ?
				this.constructor(onfulfilled(this.__unpack()))
				: this.constructor(this.__unpack()) 
			onrejected
				&& res.catch(onrejected) 
			return res }
		// XXX we need to feed the output of onfulfilled to the value of 
		// 		res, but to this without wrapping the whole thing in a 
		// 		promise (possible???)...
		return arguments.length > 0 ?
			this.constructor(this.then(...arguments))
			: this.constructor(this.__packed, 'raw') },

	// XXX EXPEREMENTAL
	isSync: function(){
		return !(this.__packed instanceof Promise
			|| this.__packed
				.filter(function(e){
					return e instanceof IterablePromise ?
							!e.isSync()
						: e instanceof Promise 
								&& !(e instanceof SyncPromise) })
				.length > 0) },
	sync: function(error=false){
		try{
			var res = this.__unpack()
		}catch(err){
			if(error == false){
				return }
			if(typeof(error) == 'function'){
				return error(err) }
			throw err }
		return error !== false 
				&& res instanceof Promise ?
			// XXX should this be an IterablePromise???
			res.catch(error)
			: res },


	// constructor...
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
	// 			...this may be quite an overhead...
	//
	//
	// Special cases useful for extending this constructor...
	//
	//	Set raw .__packed without any pre-processing...
	//	Promise.iter([ .. ], 'raw')
	//		-> iterable-promise
	//
	//	Create a rejected iterator...
	//	Promise.iter(false)
	//		-> iterable-promise
	//
	//
	// NOTE: if 'types/Array' is imported this will support throwing STOP,
	// 		for more info see notes for .__pack(..)
	// 		XXX EXPEREMENTAL: STOP...
	// XXX use selfResolve(..)
	__new__: function(_, list, handler=undefined, onerror=undefined){
		// instance...
		var promise
		var obj = Reflect.construct(
			Promise,
			//this.constructor.__proto__,
			[function(resolve, reject){
				// NOTE: this is here for Promise compatibility...
				if(typeof(list) == 'function'){
					return list.call(this, ...arguments) } 
				// initial reject... 
				if(list === false){
					return reject() }
				promise = {resolve, reject} }], 
			this.constructor)

		// populate new instance...
		if(promise){
			// handle/pack input data...
			if(handler != 'raw'){
				//list = list instanceof IterablePromise ?
				list = list instanceof this.constructor ?
					obj.__handle(list.__packed, handler, onerror)
					: obj.__pack(list, handler, onerror) }
			Object.defineProperty(obj, '__packed', {
				value: list,
				enumerable: false,
				// NOTE: this is needed for self-resolve...
				writable: true,
			})
			// handle promise state...
			try{
				var res = obj.__unpack(list)
			}catch(err){
				promise.reject(err) }
			res instanceof Promise ?
				res
					.then(function(list){
						promise.resolve(list) })
					.catch(promise.reject) 
				: promise.resolve(res) 
			// XXX EXPEREMENTAL
			// XXX do we handle errors here???
			// self-resolve state...
			list instanceof Promise ?
				list.then(function(list){
					obj.__packed = list })
				/*/ XXX use selfResolve(..)
				: selfResolve(list) }
				/*/
				: list.forEach(function(elem, i){
					elem instanceof Promise
						&& elem.then(function(elem){
							lst = obj.__packed.slice()
							lst[i] = elem
							obj.__packed = lst }) }) }
				//*/
		return obj },
})



//---------------------------------------------------------------------
// XXX EXPEREMENTAL/HACK...
// Sequential iterable promise...

// This like IterablePromise but guarantees handler execution in order 
// element occurrence.
//
// For comparison:
// 		Promise.all([ .. ]).then(func)
// 			- func is called on element list
// 			- func is called when all the elements are resolved
// 		Promise.iter([ .. ]).iter(func)
// 			- func per element
// 			- func is called when an element is resolved/ready 
// 				in order of resolution/readiness
// 		Promise.seqiter([ .. ]).iter(func)
// 			- func per element
// 			- func is called when an element is resolved/ready 
// 				and when all elements before it are handled
//
// NOTE: that here a promise will block handling of later promises even 
// 		if they are resolved before it.
//
// XXX is this correct???
// 			> g = function*(){ yield* [1,2,3] }
//			// XXX should this expand the generator???
//			> await Promise.seqiter([0, g()])
//				-> [ 0, Object [Generator] {} ]
//			> await Promise.seqiter([0, g()]).flat()
//				-> [ 0, 1, 2, 3 ]
// XXX check if this behaves correctly (call order) on concatenation and
// 		other methods...
// XXX not sure if this is a viable strategy....
var IterableSequentialPromise =
module.IterableSequentialPromise =
object.Constructor('IterableSequentialPromise', IterablePromise, {
	__pack: function(list, handler=undefined, onerror=undefined){
		var seqiter = this.constructor

		var repack = function(list){
			var res = []
			for(var [i, e] of list.entries()){
				if(e.then
						// skip last promise -- nothing to wrap...
						&& i < list.length-1){
					res.push(e
						.then(function(e){ 
							// NOTE: this does not call any handlers, thus
							// 		there should be no risk of out of order 
							// 		handler execution....
							return seqiter(
									[e, ...list.slice(i+1)])
								.flat() }))
					break }
				res.push(e) }
			return res }

		// NOTE: we are not handling the list here...
		list = object.parentCall(IterableSequentialPromise.prototype.__pack, this, list) 
		list = list instanceof SyncPromise ?
			list.sync()
			: list
		// repack...
		list = list instanceof Array ?
				repack(list)
			: list.then ?
				list.then(repack)
			: list 
		return handler ?
			this.__handle(list, handler, onerror)
			: list },
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
					// NOTE: we need to get the handlers from 
					// 		.__message_handlers unless we are not 
					// 		fully defined yet, then use the bootstrap 
					// 		container (handlers)...
					// 		...since we can call onmessage(..) while 
					// 		the promise is still defined there is no 
					// 		way to .send(..) until it returns a promise 
					// 		object, this races here are highly unlikely...
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
//
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

	then: IterablePromise.prototype.then,

	__new__: function(context, other, nooverride=false){
		var proto = 'prototype' in other ?
			other.prototype
			: other
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
		nooverride = nooverride instanceof Array ?
			new Set(nooverride)
			: nooverride
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
					// do not override existing methods...
					if(nooverride === true ? 
								key in obj
							: nooverride instanceof Set ?
								nooverride.has(key)
							: nooverride){
						return }
					// proxy...
					obj[key] = promiseProxy(key) })
			proto = proto.__proto__ } 
		return obj },
})



//---------------------------------------------------------------------

// XXX should this support async generators???
var syncAllProxy = 
function(name){
	return function(lst){
		var sync = true
		for(var e of lst){
			if(e instanceof Promise 
					&& !(e instanceof SyncPromise)){
				sync = false
				break } }
		return sync ?
			this.resolve(lst)
			: Promise[name](lst) } }

// XXX REVISE/TEST...
// XXX should this support async generators???
var syncAnyProxy =
function(name){
	return function(lst){
		for(var e of lst){
			if(e instanceof SyncPromise 
					&& !('error' in e)){
				return e }
			if(!(e instanceof Promise)){
				return this.resolve(e) } }
		return Promise[name](list) } }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// XXX EXPEREMENTAL...
// XXX DOCS...
// XXX like promise but if a value can be generated sync then this will 
// 		run in sync otherwise it will fall back to being a promise...
// XXX should we throw errors in sync mode??? ...option???
var SyncPromise =
module.SyncPromise =
object.Constructor('SyncPromise', Promise, {
	// NOTE: we need to overload these as the builtin versions sneak-in 
	// 		async-ness before we can catch it in .__new__(..)
	resolve: function(value){
		return new this(function(resolve){ resolve(value) }) },
	reject: function(error){
		return new this(function(_, reject){ reject(error) }) },
	// NOTE: these essentially add a special case where the inputs are
	// 		either not promises or SyncPromise instances...
	all: syncAllProxy('all'),
	allSettled: syncAllProxy('allSettled'),
	any: syncAnyProxy('any'),
	race: syncAnyProxy('race'),
},{
	//value: undefined,
	//error: undefined,

	// NOTE: if this is called it means that .__new__(..) returned in sync 
	// 		mode and thus set .value and possibly .error, soe there is no 
	// 		need to check for .value...
	then: function(resolve, reject){
		return this.hasOwnProperty('error') ?
				this.constructor.reject(
					reject ?
						reject(this.error)
						: this.error)
			: resolve ?
				this.constructor.resolve(
					resolve(this.value)) 
			// XXX should we return a copy???
			: this },
	sync: function(error='throw'){
		if(error !== false 
				&& 'error' in this){
			if(typeof(error) != 'function'){
				throw this.error }
			return error(this.error) }
		return this.value },

	// NOTE: if func calls resolve(..) with a promise then this will return
	// 		that promise...
	__new__: function(context, func){
		var value
		var resolve = function(res){
			return (value = res) }
		var rejected
		var error
		var reject = function(err){
			rejected = true
			return (error = err) }
		// call...
		try{
			func(resolve, reject)
		}catch(err){
			reject(err) }
		// async...
		if(!error 
				&& value instanceof Promise){
			return object.ASIS(value) }
		// sync...
		var obj = Promise.resolve(value)
		obj.value = value
		rejected
			&& (obj.error = error)
		return obj },
})



//---------------------------------------------------------------------

var PromiseMixin =
module.PromiseMixin =
object.Mixin('PromiseMixin', 'soft', {
	iter: IterablePromise,
	// XXX
	seqiter: IterableSequentialPromise,

	interactive: InteractivePromise,
	cooperative: CooperativePromise,

	sync: SyncPromise,

	// XXX should this be implemented via SyncPromise??? 
	// XXX not sure if we need to expand async generators...
	// 		(update README if this changes)
	awaitOrRun: function(data, func, error){
		data = [...arguments]
		func = data.pop()
		if(typeof(data.at(-1)) == 'function'){
			error = func
			func = data.pop() }
		error = error ? 
			[error] 
			: []
		// check if we need to await...
		return data.reduce(function(res, e){
					return res 
						|| e instanceof Promise }, false) ?
				// NOTE: we will not reach this on empty data...
				(data.length > 1 ?
					Promise.all(data)
						.then(
							function(res){ 
								return func(...res) }, 
							...error)
					: data[0].then(func, ...error))
			// XXX not sure if we need to expand async generators...
			// 		...since it has .then(..) it can be treated as a promise...
			// XXX should we just check for .then(..) ???
			// XXX update README if this changes...
			: (data.length == 1 
					&& Symbol.asyncIterator in data[0]
					&& 'then' in data[0]) ?
				data[0].then(func, ...error)
			: error.length > 0 ?
				function(){
					try{
						return func(...data)
					}catch(err){
						return error[0](err) } }()
			: func(...data) },
})

PromiseMixin(Promise)


var PromiseProtoMixin =
module.PromiseProtoMixin =
object.Mixin('PromiseProtoMixin', 'soft', {
	as: ProxyPromise,

	iter: function(handler=undefined, onerror=undefined){
		return IterablePromise(this, handler, onerror) },
	// XXX
	seqiter: function(handler=undefined, onerror=undefined){
		return IterableSequentialPromise(this, handler, onerror) },

	// unify the general promise API with other promise types...
	// XXX should this be here???
	// XXX error if given must return the result... (???)
	sync: function(error){
		typeof(error) == 'function'
			&& this.catch(error)
		return this },
})

PromiseProtoMixin(Promise.prototype)




/**********************************************************************
* vim:set ts=4 sw=4 nowrap :                        */ return module })
