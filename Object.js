/**********************************************************************
* 
*
*
* XXX shoule we add these from object to Object?
* 		- .parent(..)
* 		- .parentProperty(..)
* 		- .parentCall(..)
* 		- .parentOf(..)
* 		- .childOf(..)
* 		- .related(..)
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

require('object-run')

var object = require('ig-object')



/*********************************************************************/
// import stuff from object.js to Object...

var toObject = function(...keys){
	keys.forEach(function(key){
		Object[key] 
			|| (Object[key] = object[key]) }) }

toObject(
	'deepKeys',

	// XXX these should be called logically relative to Array.js and diff.js...
	'match',
	'matchPartial',

	/* XXX not yet sure about these...
	// XXX EXPERIMENTAL...
	'parent',
	'parentProperty',
	'parentCall',

	'parentOf',
	'childOf',
	'related',
	//*/
)


//---------------------------------------------------------------------

// Make a copy of an object...
//
// This will:
// 	- create a new object linked to the same prototype chain as obj
// 	- copy obj own state
//
// NOTE: this will copy prop values and not props...
Object.copy = function(obj, constructor){
	return Object.assign(
		constructor == null ?
			Object.create(obj.__proto__)
			: constructor(),
		obj) }


// Make a full key set copy of an object...
//
// NOTE: this will copy prop values and not props...
// NOTE: this will not deep-copy the values...
Object.flatCopy = function(obj, constructor){
	return Object.deepKeys(obj)
		.reduce(
			function(res, key){
				res[key] = obj[key] 
				return res },
			constructor == null ?
				{}
				: constructor()) }


// XXX for some reason neumric keys do not respect order...
// 		to reproduce:
// 			Object.keys({a:0, x:1, 10:2, 0:3, z:4, ' 1 ':5})
// 			// -> ["0", "10", "a", "x", "z", " 1 "]
// 		...this is the same across Chrome and Firefox...
Object.sort = function(obj, keys){
	keys = (typeof(keys) == 'function'
			|| keys === undefined) ? 
		[...Object.keys(obj)].sort(keys)
		: keys
	new Set([...keys, ...Object.keys(obj)])
		.forEach(function(k){
			if(k in obj){
				var v = Object.getOwnPropertyDescriptor(obj, k)
				delete obj[k]
				Object.defineProperty(obj, k, v) } })
	return obj }
Object.prototype.sort
	|| Object.defineProperty(Object.prototype, 'sort', {
		enumerable: false,
		value: function(keys){
			return Object.sort(this, keys) }, })




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
