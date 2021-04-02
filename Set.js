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

var SetProtoMixin =
module.SetProtoMixin =
object.Mixin('SetMixin', 'soft', {
	// Set set operation shorthands...
	unite: function(other=[]){ 
		return new Set([...this, ...other]) },
	intersect: function(other){
		var test = other.has ?  
			'has' 
			: 'includes'
		return new Set([...this]
			.filter(function(e){ 
				return other[test](e) })) },
	subtract: function(other=[]){
		other = new Set(other)
		return new Set([...this]
			.filter(function(e){ 
				return !other.has(e) })) },

	sort: function(values=[]){
		values = (typeof(values) == 'function' 
				|| values === undefined) ?
			[...this].sort(values)
			: values
		var del = this.delete.bind(this)
		var add = this.add.bind(this)
		new Set([...values, ...this])
			.forEach(function(e){
				if(this.has(e)){
					del(e)
					add(e) } }.bind(this))
		return this },
})


SetProtoMixin(Set.prototype)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
