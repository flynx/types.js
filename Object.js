/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

require('object-run')



/*********************************************************************/

// Get all the accessible keys...
//
// This is different to Object.keys(..) in that this will return keys
// from all the prototypes in the inheritance chain while .keys(..) will 
// only return the keys defined in the current object only.
Object.deepKeys = function(obj){
	var res = []
	while(obj != null){
		res = res.concat(Object.keys(obj))
		obj = obj.__proto__
	}
	return res.unique() }


// Make a full key set copy of an object...
//
// NOTE: this will not deep-copy the values...
Object.flatCopy = function(obj){
	var res = {}
	Object.deepKeys(obj).forEach(function(key){
		res[key] = obj[key]
	})
	return res }




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
