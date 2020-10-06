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




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
