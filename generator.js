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
// The generator hirearchy in JS is a bit complicated.
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


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// generic generator wrapper...
var iter = 
module.iter = 
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

// XXX this needs to be of the correct type... (???)
var makeGenerator = function(name){
	return function(...args){
		var that = this
		return Object.assign(
			function*(){
				yield* that(...arguments)[name](...args) }, 
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


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var GeneratorMixin =
module.GeneratorMixin =
object.Mixin('GeneratorMixin', 'soft', {

	// XXX should this be a generator???
	at: makeGenerator('at'),

	slice: makeGenerator('slice'),
	flat: makeGenerator('flat'),

	map: makeGenerator('map'),
	filter: makeGenerator('filter'),
	reduce: makeGenerator('reduce'),

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
	pop: function(){
		var that = this
		return Object.assign(
			function(){
				return that(...arguments).toArray().pop() },
			{ toString: function(){
				return that.toString() 
					+ '\n    .pop()'}, }) },
	shift: function(){
		var that = this
		return Object.assign(
			function(){
				return that(...arguments).toArray().shift() }, 
			{ toString: function(){
				return that.toString() 
					+ '\n    .shift()'}, }) },

	// promises...
	//
	then: makePromise('then'),
	catch: makePromise('catch'),
	finally: makePromise('finally'),
})


var GeneratorProtoMixin =
module.GeneratorProtoMixin =
object.Mixin('GeneratorProtoMixin', 'soft', {
	// XXX should this be a generator???
	at: function*(i){
		// sanity check...
		if(i < 0){
			throw new Error('.at(..): '
				+'generator index can\'t be a negative value.')}
		for(var e of this){
			if(i-- == 0){
				yield e 
				return } } },

	// NOTE: this is different from Array's .slice(..) in that it does not 
	// 		support negative indexes -- this is done because there is no way 
	// 		to judge the length of a generator untill it is fully done...
	slice: function*(from=0, to=Infity){
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

	map: function*(func){
		var i = 0
		for(var e of this){
			yield func(e, i++, this) } },
	filter: function*(func){
		var i = 0
		for(var e of this){
			if(func(e, i++, this)){
				yield e } } },
	reduce: function*(func, res){
		var i = 0
		for(var e of this){
			res = func(res, e, i++, this) } 
		yield res },

	// non-generators...
	//
	toArray: function(){
		return [...this] },
	pop: function(){
		return [...this].pop() },
	// XXX should this unwind the whole generator???
	// XXX this will not get the first item if the generator is already
	// 		partially depleted...
	// 		...should we remove this???
	shift: function(){
		return this.next().value },
		//return [...this].shift() },

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


	// XXX EXPERIMENTAL...
})


GeneratorMixin(GeneratorPrototype)
GeneratorProtoMixin(GeneratorPrototype.prototype)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
