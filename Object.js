/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

require('object-run')

var object = require('ig-object')



/*********************************************************************/

Object.deepKeys = 
	Object.deepKeys 
		|| object.deepKeys


// XXX unify this with ./Array.js (.match(..)) and diff.js
Object.match = 
	Object.match 
		|| object.match
Object.matchPartial = 
	Object.matchPartial 
		|| object.matchPartil


// Make a full key set copy of an object...
//
// NOTE: this will not deep-copy the values...
Object.flatCopy = function(obj){
	return Object.deepKeys(obj)
		.reduce(function(res, key){
			res[key] = obj[key] 
			return res }, {}) }


Object.sort = function(obj, keys){
	keys = (typeof(keys) == 'function'
			|| keys === undefined) ? 
		[...Object.keys(obj)].sort(keys)
		: keys
	new Set([...keys, ...Object.keys(obj)])
		.forEach(function(k){
			if(k in obj){
				var v = obj[k]
				delete obj[k]
				obj[k] = v } })
	return obj }
// keep the null prototype clean...
//Object.prototype.sort = function(keys){
//	return Object.sort(this, keys) }



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
