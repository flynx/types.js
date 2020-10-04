/**********************************************************************
* 
*
*
**********************************************************************/
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')



/*********************************************************************/

// XXX should we have the restriction of requiring unique elements??? 
// XXX move this to browse2 and use it as an option/basis for list...
// XXX BUG: UniqueKeyMap([['a', 123], ...]) breaks...
var UniqueKeyMap = 
module.UniqueKeyMap = object.Constructor('UniqueKeyMap', Map, {

	// Format:
	// 	Map([
	// 		[ <elem>, Set([
	// 				<original-name>, 
	// 				...
	// 			]) ],
	// 		...
	// 	])
	//
	// XXX might be a good idea to change the value to a list of original 
	// 		names...
	__keys: null,

	// Patter to be used to generate unique key...
	__key_pattern__: '$KEY ($COUNT)',

	// If true then a value can not be stored under the same key more 
	// than once...
	//
	// Example:
	// 	var u = UniqueKeyMap()
	// 	u.set('x', 123)
	// 	// if .__unique_key_value__ is true this will have no effect, 
	// 	// otherwise 123 will be stored under 'x (1)'
	// 	u.set('x', 123)
	//
	__unique_key_value__: false,


	// Extended API...
	//
	set: function(key, elem){
		var names
		this.__keys.set(elem, 
			names = this.__keys.get(elem) || new Set())
		// key/elem already exists...
		if(this.__unique_key_value__ && names.has(key)){
			return this }
		names.add(key)
		// make name unique...
		var n = key
		var i = 0
		while(this.has(n)){
			i++
			n = this.__key_pattern__
				.replace(/\$KEY/, key)
				.replace(/\$COUNT/, i) }
		// add the elem with the unique name...
		return object.parentCall(UniqueKeyMap.prototype, 'set', this, n, elem) },
	delete: function(key){
		var s = this.__keys.get(this.get(key))
		if(s){
			s.delete(key)
			s.size == 0
				& this.__keys.delete(this.get(key)) }
		return object.parentCall(UniqueKeyMap.prototype, 'delete', this, key) },


	// New API...
	//
	rename: function(from, to){
		var e = this.get(from)
		this.delete(from)
		return this.set(to, e) },
	keysOf: function(elem, mode='original'){
		// get unique keys...
		if(mode == 'unique'){
			return this
				.entries()
				.reduce(function(res, [k, e]){
					e === elem
						&& res.push(k)
					return res }, []) }
		// get keys used to set the values...
		return [...(this.__keys.get(elem) || [])] },

	__init__: function(){
		this.__keys = new Map() },
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
