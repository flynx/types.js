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
var object = require('ig-object')

var types = require('./main')
var containers = require('./containers')



//---------------------------------------------------------------------

/*
var setups = test.Setups({
})

var modifiers = test.Modifiers({
})

var tests = test.Tests({
})
//*/


var cases = test.Cases({
	// Object.js
	// 	- flatCopy
	Object: function(assert){
		var o = Object.assign(
			Object.create({
				x: 111,
				y: 222,
			}), {
				y: 333,
				z: 444,
			})
		var oo = Object.flatCopy(o)

		assert(Object.match(oo, {x: 111, y: 333, z: 444}), '')
	},

	// Array.js
	// 	- flat
	// 	- includes
	// 	- first
	// 	- last
	// 	- compact
	// 	- len
	// 	- toKeys
	// 	- toMap
	// 	- unique
	// 	- tailUnique
	// 	- cmp
	// 	- setCmp
	// 	- sortAs
	// 	- mapChunks
	// 	- filterChunks
	// 	- reduceChunks
	Array: function(assert){
	},

	// Set.js
	// 	- unite
	// 	- intersect
	// 	- subtract
	Array: function(assert){
	},
	
	String: function(assert){
		assert(''.capitalize() == '')
		assert('a'.capitalize() == 'A')
		assert('abc'.capitalize() == 'Abc')
	},

	RegExp: function(assert){
	},

	// Date.js
	Date: function(assert){
		var d = new Date()

		var ts = assert(d.getTimeStamp(), '.getTimeStamp()')
		var tsm = assert(d.getTimeStamp(true), '.getTimeStamp(true)')

		var dd = assert(Date.fromTimeStamp(tsm), '.fromTimeStamp(..)')
		var dds = assert(Date.fromTimeStamp(ts), '.fromTimeStamp(..)')

		assert(d.toString() == dd.toString(), 'timestamp reversable')

		assert(d.toShortDate() == dd.toShortDate(), '.toShortDate()')
		assert(d.toShortDate() == dds.toShortDate(), '.toShortDate()')
		assert(d.toShortDate(true) == dd.toShortDate(true), '.toShortDate(true)')

		var a = Date.timeStamp()
		var b = Date.timeStamp(true)

		assert(a == Date.fromTimeStamp(a).getTimeStamp())
		assert(a + '000' == Date.fromTimeStamp(a).getTimeStamp(true))
		assert(b == Date.fromTimeStamp(b).getTimeStamp(true))

		assert(Date.str2ms('1') == 1, 'Date.str2ms("1")')
		assert(Date.str2ms(1) == 1, 'Date.str2ms(1)')
		assert(Date.str2ms('1ms') == 1, 'Date.str2ms("1ms")')
		assert(Date.str2ms('1s') == 1000, 'Date.str2ms("1s")')
		assert(Date.str2ms('1m') == 60*1000, 'Date.str2ms("1m")')
		assert(Date.str2ms('1h') == 60*60*1000, 'Date.str2ms("1h")')
		assert(Date.str2ms('1d') == 24*60*60*1000, 'Date.str2ms("1d")')

		assert(Date.str2ms('5 sec') == 5000, 'Date.str2ms("1 sec")')
		assert(Date.str2ms('5 second') == 5000, 'Date.str2ms("1 second")')
		assert(Date.str2ms('5 seconds') == 5000, 'Date.str2ms("1 seconds")')

		assert(Date.str2ms('2hour') == 2*60*60*1000, 'Date.str2ms("1hour")')
		assert(Date.str2ms('2 Hour') == 2*60*60*1000, 'Date.str2ms("1 Hour")')
		assert(Date.str2ms('2 hours') == 2*60*60*1000, 'Date.str2ms("1 hours")')

		assert(Number.isNaN(Date.str2ms('moo')), 'Date.str2ms("moo")')
		assert(Number.isNaN(Date.str2ms('123 moo')), 'Date.str2ms("moo")')
	},

	// containers.js
	// XXX .reset(..) and .rename(..) should not affect order...
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

		var k = [...c.keys()]

		assert((n = c.rename('a', 'b', true)) == 'b (1)')

		// XXX should .rename(..) affect element order??
		//console.log('>>>>>', k, [...c.keys()])
	},
})


//---------------------------------------------------------------------

typeof(__filename) != 'undefined'
	&& __filename == (require.main || {}).filename
	&& test.run()



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })