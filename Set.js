/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/

// Set set operation shorthands...
Set.prototype.unite = function(other=[]){ 
	return new Set([...this, ...other]) }
Set.prototype.intersect = function(other){
	var test = other.has ?  
		'has' 
		: 'includes'
	return new Set([...this]
		.filter(function(e){ 
			return other[test](e) })) }
Set.prototype.subtract = function(other=[]){
	other = new Set(other)
	return new Set([...this]
		.filter(function(e){ 
			return !other.has(e) })) }


Map.prototype.sort = function(keys=[]){
	keys = (typeof(keys) == 'function' 
			|| keys === undefined) ?
		[...this].sort(keys)
		: keys
	var del = Set.prototype.delete.bind(this)
	var add = Set.prototype.add.bind(this)
	new Set([...keys, ...this])
		.forEach(function(e){
			if(this.has(e)){
				del(e)
				add(e) } }.bind(this))
	return this }




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
