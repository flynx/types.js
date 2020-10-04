/**********************************************************************
* 
*
*
**********************************************************************/
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/

String.prototype.capitalize = function(){
	return this == '' ? 
		this 
		: this[0].toUpperCase() + this.slice(1) }



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
