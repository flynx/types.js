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
	// XXX should .__keys_index be non-enumerable???
	get __keys(){
		return (this.__keys_index = 
			this.__keys_index || new Map()) },


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


	// NOTE: this will never overwrite a key's value, to overwrite use .reset(..)
	set: function(key, elem, return_key=false){
		var names
		var n
		// index
		this.__keys.set(elem, 
			names = this.__keys.get(elem) || new Set())
		// key/elem already exists...
		if(this.__unique_key_value__ 
				&& names.has(key)){
			return return_key ?
				key
				: this }
		names.add(key)
		// add the elem with the unique name...
		var res = object.parentCall(
			UniqueKeyMap.prototype, 
			'set', 
			this, 
			n = this.uniqieKey(key), 
			elem) 
		return return_key ?
			n
			: res },
	reset: function(key, elem){
		return object.parentCall(UniqueKeyMap.prototype, 'set', this, key, elem) },
	delete: function(key){
		var s = this.__keys.get(this.get(key))
		if(s){
			s.delete(key)
			s.size == 0
				& this.__keys.delete(this.get(key)) }
		return object.parentCall(UniqueKeyMap.prototype, 'delete', this, key) },
	uniqieKey: function(key){
		var n = key
		var i = 0
		while(this.has(n)){
			i++
			n = this.__key_pattern__
				.replace(/\$KEY/, key)
				.replace(/\$COUNT/, i) }
		return n },
	rename: function(from, to, return_key=false){
		var e = this.get(from)
		this.delete(from)
		return this.set(to, e, return_key) },
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
})




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
