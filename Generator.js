/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/

var Generator =
module.Generator = 
	(function*(){}).__proto__


//---------------------------------------------------------------------
// Generator "class" methods...
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

// XXX do a better .toString(..)...
// 			should be of the format:
// 				<root-gen>(<args>)
// 					.<name>(<args>)
// 					...
// XXX this needs to be of the correct type...
var makeGenerator = function(name){
	return function(...args){
		var that = this
		return function*(){
			yield* that(...arguments)[name](...args) } } }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Generator.map = makeGenerator('map')
Generator.filter = makeGenerator('filter')
Generator.reduce = makeGenerator('reduce')
Generator.flat = makeGenerator('flat')

Generator.then = function(...args){
	var that = this
	return function(){
		return that(...arguments).then(func) } } 

Generator.toArray = function(){
	var that = this
	return function(){
		return that(...arguments).toArray() } } 



//---------------------------------------------------------------------
// Generator instance methods...

Generator.prototype.map = function*(func){
	var i = 0
	for(var e of this){
		yield func(e, i++, this) } }
Generator.prototype.filter = function*(func){
	var i = 0
	for(var e of this){
		if(func(e, i++, this)){
			yield e } } }
Generator.prototype.reduce = function*(func, res){
	var i = 0
	for(var e of this){
		res = func(res, e, i++, this) } 
	yield res }
Generator.prototype.flat = function*(depth=1){
	if(depth == 0){
		return this }
	for(var e of this){
		if(e instanceof Array){
			for(var i=0; i < e.length; i++){
				if(depth <= 1){
					yield e[i]

				} else {
					yield* typeof(e[i].flat) == 'function' ?
						e[i].flat(depth-1)
						: e[i] } }

		// XXX the test will not work yet...
		} else if(e instanceof Generator){
			if(depth <= 1){
				// XXX should we expand the generaaator here???
				yield [...e]

			} else {
				yield* e.flat(depth-1) }

		} else {
			yield e } } }

Generator.prototype.then = function(func){
	var that = this
	return new Promise(function(resolve){
		resolve([...that]) }) }

Generator.prototype.toArray = function(){
	return [...this] }


// XXX these are potentially bad because with negative indexes well need 
// 		to run throu the whole iterator and cache the data...
//Generator.prototype.slice = function(from=0, to=-1){ }
//Generator.prototype.reverse = function(){ }




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
