/**********************************************************************
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')


//---------------------------------------------------------------------

var NumberMixin =
module.NumberMixin =
object.Mixin('NumberMixin', 'soft', {
	toAlpha: function(n, alpha='abcdefghijklmnopqrstuvwxyz'){
		var res = ''
		var base = alpha.length
		do{
			res = alpha[n % base] + res
			n = Math.floor(n/base) - 1
		}while(n >= 0)
		return res },
	fromAlpha: function(str, alpha='abcdefghijklmnopqrstuvwxyz'){
		var res = 0
		var base = alpha.length
		var i = 0
		for(var c of [...str].reverse()){
			var val = alpha.indexOf(c) + 1
			res += val * (base ** i++) }
		return res-1 },

	toRoman: function(n){
		var index = {
			M: 1000,	
				CM: 900,
			D: 500,
				CD: 400,
			C: 100,		
				XC: 90,
			L: 50,
				XL: 40,
			X: 10,
				IX: 9,
			V: 5,		
				IV: 4,
			I: 1,
		}
		var res = ''
		for(var R in index){
			while(n >= index[R]){
				res += R
				n -= index[R] } }
		return res },
	fromRoman: function(str){
		var index = {
			M: 1000,	
				CM: 900,
			D: 500,
				CD: 400,
			C: 100,		
				XC: 90,
			L: 50,
				XL: 40,
			X: 10,
				IX: 9,
			V: 5,		
				IV: 4,
			I: 1,
		}
		var n = 0
		str = str.toUpperCase()
		while(str != ''){
			if(str.slice(0, 2) in index){
				n += index[str.slice(0, 2)]
				str = str.slice(2)
			} else if(str[0] in index){
				n += index[str[0]]
				str = str.slice(1)
			} else {
				throw new Error('fromRoman(..): Unknown sequence: '+ str) } }
		return n },
})

NumberMixin(Number)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
var NumberProtoMixin =
module.NumberProtoMixin =
object.Mixin('NumberProtoMixin', 'soft', {
	toAlpha: function(alpha='abcdefghijklmnopqrstuvwxyz'){
		return this.constructor.toAlpha(this, alpha) },
	toRoman: function(n){
		return this.constructor.toRoman(this) },
})

NumberProtoMixin(Number.prototype)



/**********************************************************************
* vim:set ts=4 sw=4 nowrap :                        */ return module })
