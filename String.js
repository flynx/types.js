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

var StringProtoMixin =
module.StringProtoMixin =
object.Mixin('StringProtoMixin', 'soft', {
	capitalize: function(){
		return this == '' ? 
			this 
			: this[0].toUpperCase() + this.slice(1) },
})


StringProtoMixin(String.prototype)




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
