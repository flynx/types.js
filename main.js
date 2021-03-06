/**********************************************************************
* 
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')

// Extend built-in types...
require('./Object')
require('./Array')
require('./Set')
require('./Map')
require('./String')
require('./RegExp')
require('./Promise')
module.patchDate = require('./Date').patchDate


// Additional types...
module.containers = require('./containers')
module.generator = require('./generator')
module.event = require('./event')
module.runner = require('./runner')


// Shorthands...
module.STOP = object.STOP
// NOTE: this is a generic enough type to be accessible at the root...
module.Generator = module.generator.Generator




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
