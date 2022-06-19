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

// NOTE: this is used in a similar fashion to Python's StopIteration...
var STOP =
module.STOP =
	object.STOP


//---------------------------------------------------------------------
// The generator hierarchy in JS is a bit complicated.
//
// Consider the following:
//
// 		// this is the generator function (i.e. the constructor)
// 		var Iter = function*(lst){
// 			for(var e of lst){
// 				yield e }}
//
// 		// this is the generator instance (constructed instance)...
// 		var iter = Iter([1,2,3])
//
//
// In this module we need to add methods to be visible from either Iter
// or iter from the above example, so we need to access the prototypes 
// of each of them.
// So, below we will define:
//
// 	GeneratorPrototype 
// 		prototype of the generator constructors (i.e. Iter(..) from the 
// 		above example)
//
// 	GeneratorPrototype.prototype
// 		generator instance prototype (i.e. iter for the above code)
//
//
// Also the following applies:
//
//		iter instanceof Iter		// -> true
//
// 		Iter instanceof Generator
//
//
// NOTE: there appears to be no way to test if iter is instance of some 
// 		generic Generator...
//
//---------------------------------------------------------------------

var GeneratorPrototype =
	(function*(){}).constructor.prototype

var Generator = 
module.Generator =
	(function*(){}).constructor


var AsyncGeneratorPrototype =
	(async function*(){}).constructor.prototype

var AsyncGenerator =
module.AsyncGenerator =
	(async function*(){}).constructor


// base iterator prototypes...
var ITERATOR_PROTOTYPES = [
	Array,
	Set,
	Map,
].map(function(e){ 
	return (new e()).values().__proto__ })



//---------------------------------------------------------------------

// generic generator wrapper...
var iter = 
module.iter = 
Generator.iter =
	function*(lst=[]){
		for(var e of lst){
			yield e } }



//---------------------------------------------------------------------
// GeneratorPrototype "class" methods...
//
// the following are effectively the same:
// 	1) Wrapper
// 		var combined = function(...args){
// 			return someGenerator(...args)
// 				.filter(function(e){ ... })
// 				.map(function(e){ ... }) }
//
// 		combined( .. )
//
// 	2) Static generator methods...
// 		var combined = someGenerator
// 			.filter(function(e){ ... })
// 			.map(function(e){ ... })
//
// 		combined( .. )
//
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Helpers...

//
// 	makeGenerator(<name>)
// 		-> <func>
//
// 	makeGenerator(<name>, <handler>)
// 		-> <func>
//
//
// 	<func>(...args)
// 		-> <Generator>
//
// 	<Generator>(...inputs)
// 		-> <generator>
//
// 	<handler>(args, ...inputs)
// 		-> args
//
//
// XXX this needs to be of the correct type... (???)
// XXX need to accept generators as handlers...
var makeGenerator = function(name, pre){
	return function(...args){
		var that = this
		return Object.assign(
			function*(){
				var a = pre ? 
					pre.call(this, args, ...arguments)
					: args
				yield* that(...arguments)[name](...a) }, 
			{ toString: function(){
				return [
					that.toString(), 
					// XXX need to normalize args better...
					`.${ name }(${ args.join(', ') })`,
				].join('\n    ') }, }) } }

// XXX do a better doc...
var makePromise = function(name){
	return function(...args){
		var that = this
		return function(){
			return that(...arguments)[name](func) } } }


var stoppable = 
module.stoppable =
function(func){
	return Object.assign(
		func instanceof Generator ?
			function*(){
				try{
					yield* func.call(this, ...arguments)
				} catch(err){
					if(err === STOP){
						return
					} else if(err instanceof STOP){
						yield err.value
						return }
					throw err } }
			: function(){
				try{
					return func.call(this, ...arguments)
				} catch(err){
					if(err === STOP){
						return
					} else if(err instanceof STOP){
						return err.value }
					throw err } },
		{ toString: function(){
			return func.toString() }, }) }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var GeneratorMixin =
module.GeneratorMixin =
object.Mixin('GeneratorMixin', 'soft', {
	STOP: object.STOP,

	// NOTE: this is here for compatibility with Array.iter(..)
	iter: function*(lst=[]){
		yield* module.iter(lst) },

	gat: makeGenerator('gat'),
	at: function(i){
		var that = this
		return Object.assign(
			function(){
				return that(...arguments).at(i) },
			{ toString: function(){
				return that.toString() 
					+ '\n    .at('+ i +')'}, }) },

	slice: makeGenerator('slice'),
	flat: makeGenerator('flat'),

	map: makeGenerator('map'),
	filter: makeGenerator('filter'),
	reduce: makeGenerator('reduce'),
	reduceRight: makeGenerator('reduceRight'),

	// non-generators...
	//
	toArray: function(){
		var that = this
		return Object.assign(
			function(){
				return that(...arguments).toArray() },
			{ toString: function(){
				return that.toString() 
					+ '\n    .toString()'}, }) },
	gpop: makeGenerator('gpop'),
	pop: function(){
		var that = this
		return Object.assign(
			function(){
				//return that(...arguments).toArray().pop() },
				return that(...arguments).pop() },
			{ toString: function(){
				return that.toString() 
					+ '\n    .gpop()'}, }) },
	push: makeGenerator('push'),
	gshift: makeGenerator('gshift'),
	shift: function(){
		var that = this
		return Object.assign(
			function(){
				//return that(...arguments).toArray().shift() }, 
				return that(...arguments).shift() }, 
			{ toString: function(){
				return that.toString() 
					+ '\n    .gshift()'}, }) },
	unshift: makeGenerator('unshift'),

	// promises...
	//
	then: makePromise('then'),
	catch: makePromise('catch'),
	finally: makePromise('finally'),

	// combinators...
	//
	chain: makeGenerator('chain'),
	concat: makeGenerator('concat', 
		// initialize arguments...
		function(next, ...args){
			return next
				.map(function(e){
					return (e instanceof Generator
							|| typeof(e) == 'function') ?
						e(...args)
						: e }) }),
	//zip: makeGenerator('zip'),
})


var GeneratorProtoMixin =
module.GeneratorProtoMixin =
object.Mixin('GeneratorProtoMixin', 'soft', {
	// NOTE: this is here for compatibility with [..].iter()
	iter: function*(){ 
		yield* this },

	at: function(i){
		return this.gat(i).next().value },
	// XXX this needs the value to be iterable... why???
	gat: function*(i){
		// sanity check...
		if(i < 0){
			throw new Error('.gat(..): '
				+'generator index can\'t be a negative value.')}
		for(var e of this){
			if(i-- == 0){
				yield e 
				return } } },

	// NOTE: this is different from Array's .slice(..) in that it does not 
	// 		support negative indexes -- this is done because there is no way 
	// 		to judge the length of a generator until it is fully done...
	slice: function*(from=0, to=Infinity){
		// sanity check...
		if(from < 0 || to < 0){
			throw new Error('.slice(..): '
				+'generator form/to indexes can\'t be negative values.')}
		var i = 0
		for(var e of this){
			// stop at end of seq...
			if(i >= to){
				return }
			// only yield from from...
			if(i >= from){
				yield e }
			i++ } },
	// XXX do we need a version that'll expand generators???
	flat: function*(depth=1){
		if(depth == 0){
			return this }
		for(var e of this){
			// expand array...
			if(e instanceof Array){
				for(var i=0; i < e.length; i++){
					if(depth <= 1){
						yield e[i]

					} else {
						yield* typeof(e[i].flat) == 'function' ?
							e[i].flat(depth-1)
							: e[i] } }
			// item as-is...
			} else {
				yield e } } },

	// NOTE: if func is instanceof Generator then it's result (iterator) 
	// 		will be expanded...
	// NOTE: there is no point to add generator-handler support to either 
	// 		.filter(..)  or .reduce(..)
	map: stoppable(
		function*(func){
			var i = 0
			if(func instanceof Generator){
				for(var e of this){
					yield* func(e, i++, this) } 
			} else {
				for(var e of this){
					yield func(e, i++, this) } } }),
	filter: stoppable(function*(func){
			var i = 0
			try{
				for(var e of this){
					if(func(e, i++, this)){
						yield e } } 
			// normalize the stop value...
			} catch(err){
				if(err instanceof STOP){
					if(!err.value){
						throw STOP }
					err.value = e }
				throw err } }),

	reduce: stoppable(function(func, res){
		var i = 0
		for(var e of this){
			res = func(res, e, i++, this) }
		return res }),
	greduce: function*(func, res){
		yield this.reduce(...arguments) },

	pop: function(){
		return [...this].pop() },
	// XXX this needs the value to be iterable...
	gpop: function*(){
		yield [...this].pop() },
	push: function*(value){
		yield* this
		yield value },
	shift: function(){
		return this.next().value },
	// XXX this needs the value to be iterable...
	gshift: function*(){
		yield this.next().value },
	unshift: function*(value){
		yield value
		yield* this },

	// non-generators...
	//
	toArray: function(){
		return [...this] },

	// promises...
	//
	// XXX how do we handle reject(..) / .catch(..)???
	promise: function(){
		var that = this
		return new Promise(function(resolve){
				resolve([...that]) }) },
	then: function(func){
		return this.promise().then(func) },
	catch: function(func){
		return this.promise().catch(func) },
	finally: function(func){
		return this.promise().finally(func) },

	// combinators...
	//
	chain: function*(...next){
		yield* next
			.reduce(function(cur, next){
				return next(cur) }, this) },
	concat: function*(...next){
		yield* this
		for(var e of next){
			yield* e } },

	// XXX EXPERIMENTAL...
	/* XXX not sure how to do this yet...
	tee: function*(...next){
		// XXX take the output of the current generator and feed it into 
		// 		each of the next generators... (???)
	},
	zip: function*(...items){
		// XXX
	},
	//*/
})


GeneratorMixin(GeneratorPrototype)
GeneratorProtoMixin(GeneratorPrototype.prototype)


// Extend base iterators...
ITERATOR_PROTOTYPES
	.forEach(function(proto){
		GeneratorProtoMixin(proto) })


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// XXX EXPERIMENTAL...

var AsyncGeneratorMixin =
module.AsyncGeneratorMixin =
object.Mixin('AsyncGeneratorMixin', 'soft', {
})

var AsyncGeneratorProtoMixin =
module.AsyncGeneratorProtoMixin =
object.Mixin('AsyncGeneratorProtoMixin', 'soft', {
	//
	//	.then()	
	//		-> promise
	//
	//	.then(resolve[, reject])
	//		-> promise
	//
	// NOTE: this will unwind the generator...
	// XXX should we unwind???
	then: function(resolve, reject){
		var that = this
		var p = new Promise(async function(_resolve, _reject){
			var res = []
			for await(var elem of that){
				res.push(elem) }
			_resolve(res) }) 
		resolve
			&& p.then(resolve)
		reject
			&& p.catch(reject)
		return p },

	// XXX create an iterator promise...
	iter: function(handler=undefined){
		// XXX
	},
	// XXX not sure if this is the right way to go...
	// XXX should we unwind???
	iter2: async function*(handler=undefined){
		for async(var e of this){
			yield* handler ?
				handler.call(this, e)
				: [e] } },
})

AsyncGeneratorMixin(AsyncGeneratorPrototype)
AsyncGeneratorProtoMixin(AsyncGeneratorPrototype.prototype)



//---------------------------------------------------------------------
// Generators...

// NOTE: step can be 0, this will repeat the first element infinitely...
var range =
module.range =
function*(from, to, step){
	if(to == null){
		to = from
		from = 0 }
	step = step ?? (from > to ? -1 : 1)
	while(step > 0 ? 
			from < to 
			: from > to){
		yield from 
		from += step } }


var repeat =
module.repeat =
function*(value=true, stop){
	while( typeof(stop) == 'function' && stop(value) ){
		yield value } }


var produce =
module.produce =
stoppable(function*(func){
	while(true){
		yield func() } })




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
