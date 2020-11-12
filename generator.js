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
// 		// this is the generator instance (constructod instance)...
// 		var iter = Iter([1,2,3])
//
//
// In this module we need to add methods to be visible from either Iter
// or iter from the above example, so we need the access the prototypes 
// of each of them.
//
// 	GeneratorPrototype 
// 		is the prototype of the generator construcotrs (i.e. Iter(..) 
// 		from the above example)
//
// 	GeneratorPrototype.prototype
// 		is the generator instance prototype (i.e. iter for the above 
// 		code)
//
//
// Also the following applies:
//
//		iter instanceof Iter		// -> true
//
// 		Iter instanceof Generator
//
//
// NOTE: there appears no way to test if iter is instnace of some 
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
// the following are the same:
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

// XXX should this be a generator???
GeneratorPrototype.at = makeGenerator('at')

GeneratorPrototype.slice = makeGenerator('slice')
GeneratorPrototype.flat = makeGenerator('flat')

GeneratorPrototype.map = makeGenerator('map')
GeneratorPrototype.filter = makeGenerator('filter')
GeneratorPrototype.reduce = makeGenerator('reduce')

// non-generators...
//
GeneratorPrototype.toArray = function(){
	var that = this
	return Object.assign(
		function(){
			return that(...arguments).toArray() },
		{ toString: function(){
			return that.toString() 
				+ '\n    .toString()'}, }) } 
GeneratorPrototype.pop = function(){
	var that = this
	return Object.assign(
		function(){
			return that(...arguments).toArray().pop() },
		{ toString: function(){
			return that.toString() 
				+ '\n    .pop()'}, }) } 
GeneratorPrototype.shift = function(){
	var that = this
	return Object.assign(
		function(){
			return that(...arguments).toArray().shift() }, 
		{ toString: function(){
			return that.toString() 
				+ '\n    .shift()'}, }) } 

// promises...
//
GeneratorPrototype.then = makePromise('then')
GeneratorPrototype.catch = makePromise('catch')
GeneratorPrototype.finally = makePromise('finally')



//---------------------------------------------------------------------
// GeneratorPrototype instance methods...

// XXX should this be a generator???
GeneratorPrototype.prototype.at = function*(i){
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
GeneratorPrototype.prototype.slice = function*(from=0, to=Infity){
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
GeneratorPrototype.prototype.flat = function*(depth=1){
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
			yield e } } }

GeneratorPrototype.prototype.map = function*(func){
	var i = 0
	for(var e of this){
		yield func(e, i++, this) } }
GeneratorPrototype.prototype.filter = function*(func){
	var i = 0
	for(var e of this){
		if(func(e, i++, this)){
			yield e } } }
GeneratorPrototype.prototype.reduce = function*(func, res){
	var i = 0
	for(var e of this){
		res = func(res, e, i++, this) } 
	yield res }

// non-generators...
//
GeneratorPrototype.prototype.toArray = function(){
	return [...this] }
GeneratorPrototype.prototype.pop = function(){
	return [...this].pop() }
GeneratorPrototype.prototype.shift = function(){
	return [...this].shift() }

// promises...
//
// XXX how do we handle reject(..) / .catch(..)???
GeneratorPrototype.prototype.promise = function(){
	var that = this
	return new Promise(function(resolve){
			resolve([...that]) }) }
GeneratorPrototype.prototype.then = function(func){
	return this.promise().then(func) }
GeneratorPrototype.prototype.catch = function(func){
	return this.promise().catch(func) }
GeneratorPrototype.prototype.finally = function(func){
	return this.promise().finally(func) }




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
