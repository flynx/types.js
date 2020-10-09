/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/

// NOTE: we do not touch .__keys here as no renaming is ever done...
//
// XXX this essentially rewrites the whole map, is there a faster/better 
// 		way to do this???
// 		...one way would be to decouple order from the container, i.e.
// 		store the order in a separate attr/prop but this would require
// 		a whole new set of ordered "type" that would overload every single
// 		iteration method, not sure if this is a good idea untill we 
// 		reach a state whe JS "shuffles" (index-orders) its containers 
// 		(a-la Python)
Map.prototype.sort = function(keys){
	keys = (typeof(keys) == 'function' 
			|| keys === undefined) ?
		[...this.keys()].sort(keys)
		: keys
	var del = Map.prototype.delete.bind(this)
	var set = Map.prototype.set.bind(this)
	new Set([...keys, ...this.keys()])
		.forEach(function(k){
			if(this.has(k)){
				var v = this.get(k)
				del(k)
				set(k, v) } }.bind(this))
	return this }




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
