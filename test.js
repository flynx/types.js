#!/usr/bin/env node
/**********************************************************************
* 
*
*
**********************************************************************/
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
})


//---------------------------------------------------------------------

typeof(__filename) != 'undefined'
	&& __filename == (require.main || {}).filename
	&& test.run()



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
