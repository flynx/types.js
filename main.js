/**********************************************************************
* 
*
*
**********************************************************************/
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

// Extend built-in types...
require('./Object')
require('./Array')
require('./Set')
require('./String')
require('./RegExp')
module.patchDate = require('./Date').patchDate


// Additional types...
module.containers = require('./containers')



/*********************************************************************/




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
