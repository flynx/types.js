#!/usr/bin/env node
/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var colors = require('colors')
var test = require('ig-test')

var types = require('./main')
var containers = require('./containers')



//---------------------------------------------------------------------

var setups = test.Setups({
})

var modifiers = test.Modifiers({
})

var tests = test.Tests({
})


var cases = test.Cases({
	UniqueKeyMap: function(assert){
		var a = assert(containers.UniqueKeyMap(), '')
		var b = assert(containers.UniqueKeyMap([]), '')
		var c = assert(containers.UniqueKeyMap([
			['a', 111],
			['b', 222],
			['a', 333],
		]), '')
		
		assert(a.size == 0)
		assert(b.size == 0)
		assert(c.size == 3)

		assert(c.get('a') == 111)

		assert(c.has('a (1)'))
		assert(c.get('a (1)') == 333)


		var n

		assert((n = c.set('a', 444, true)) == 'a (2)')
		assert(c.get(n) == 444)

		assert(c.reset(n, 555))
		assert(c.get(n) == 555)

		assert(c.delete('a (1)'))
		assert(!c.has('a (1)'))

		assert((n = c.set('a', 222, true)) == 'a (1)')

		assert(c.keysOf(222).sort().cmp(['b', 'a'].sort()))

		assert((n = c.rename('a', 'b', true)) == 'b (1)')
	},
})


//---------------------------------------------------------------------

typeof(__filename) != 'undefined'
	&& __filename == (require.main || {}).filename
	&& test.run()



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
