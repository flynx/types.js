/**********************************************************************
* 
*
*
* XXX move .zip(..) here from diff.js
* XXX do we need .at(..) / .to(..) methods here and in Map/Set/...???
*
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/




/*********************************************************************/




// Array.prototype.flat polyfill...
//
// NOTE: .flat(..) is not yet supported in IE/Edge...
Array.prototype.flat
	|| (Array.prototype.flat = function(depth){
		depth = typeof(depth) == typeof(123) ? depth : 1
		return this.reduce(function(res, e){ 
			return res.concat(e instanceof Array && depth > 0 ? 
				e.flat(depth-1) 
				: [e]) }, []) })


// Array.prototype.includes polyfill...
//
Array.prototype.includes
	|| (Array.prototype.includes = function(value){
		return this.indexOf(value) >= 0 }) 


// first/last element access short-hands...
//
//	.first()
//	.last()
//		-> elem
//
//	.first(value)
//	.last(value)
//		-> array
//
// NOTE: setting a value will overwrite an existing first/last value.
// NOTE: for an empty array both .first(..)/.last(..) will return undefined 
// 		when getting a value and set the 0'th value when setting...
// NOTE: decided to keep these as methods and not props because methods
// 		have one advantage: they can be chained
// 		...while you can't chain assignment unless you wrap it in .run(..)
Array.prototype.first
	|| (Array.prototype.first = function(value){
		return arguments.length > 0 ?
			((this[0] = value), this)
			: this[0]})
Array.prototype.last
	|| (Array.prototype.last = function(value){
		return arguments.length > 0 ?
			((this[this.length - 1 || 0] = value), this)
			: this[this.length - 1]})


// Compact a sparse array...
//
// NOTE: this will not compact in-place.
Array.prototype.compact = function(){
	return this.filter(function(){ return true }) }


// like .length but for sparse arrays will return the element count...
//
'len' in Array.prototype
	|| Object.defineProperty(Array.prototype, 'len', {
		get : function () {
			return Object.keys(this).length
		},
		set : function(val){},
	})


// Return an array with duplicate elements removed...
//
// NOTE: order is preserved... 
Array.prototype.unique = function(normalize){
	return normalize ? 
		[...new Map(this.map(function(e){ return [normalize(e), e] })).values()]
		: [...new Set(this)] }
Array.prototype.tailUnique = function(normalize){
	return this
		.slice()
		.reverse()
		.unique(normalize)
		.reverse() }


// Compare two arrays...
//
// NOTE: this is diffectent from Object.match(..) in that this compares 
// 		self to other (internal) while match compares two entities 
// 		externally.
// 		XXX not sure if we need the destinction in name, will have to 
// 			come back to this when refactoring diff.js -- all three have
// 			to be similar...
Array.prototype.cmp = function(other){
	if(this === other){
		return true }
	if(this.length != other.length){
		return false }
	for(var i=0; i<this.length; i++){
		if(this[i] != other[i]){
			return false } }
	return true }


// Compare two Arrays as sets...
//
// NOTE: this will ignore order and repeating elments...
Array.prototype.setCmp = function(other){
	return this === other 
		|| (new Set([...this, ...other])).length == (new Set(this)).length }


// Sort as the other array...
//
// This will sort the intersecting items in the head keeping the rest 
// of the items in the same relative order...
//
// NOTE: if an item is in the array multiple times only the first index 
// 		is used...
//
// XXX should this extend/patch .sort(..)???
// 		...currently do not see a clean way to do this...
Array.prototype.sortAs = function(other){
	// NOTE: the memory overhead here is better than the time overhead 
	// 		when using .indexOf(..)...
	other = other.toMap()
	var orig = this.toMap()
	return this.sort(function(a, b){
		var i = other.get(a)
		var j = other.get(b)
		return i == null && j == null ?
				orig.get(a) - orig.get(b)
			: i == null ? 
				1
			: j == null ? 
				-1
			: i - j }) }


// Same as .sortAs(..) but will not change indexes of items not in other...
//
// Example:
// 		['a', 3, 'b', 1, 2, 'c']
// 			.inplaceSortAs([1, 2, 3, 3]) // -> ['a', 1, 'b', 2, 3, 'c']
//
Array.prototype.inplaceSortAs = function(other){
	// sort only the intersection...
	var sorted = this
		.filter(function(e){ 
			return other.includes(e) })
		.sortAs(other)
	// "zip" the sorted items back into this...
	this.forEach(function(e, i, l){
		other.includes(e) 
			&& (l[i] = sorted.shift()) })
	return this }


// Equivalent to .map(..) / .filter(..) / .reduce(..) that process the 
// contents in chunks asynchronously...
//
//	.mapChunks(func)
//	.mapChunks(chunk_size, func)
//	.mapChunks([item_handler, chunk_handler])
//	.mapChunks(chunk_size, [item_handler, chunk_handler])
//		-> promise(list)
//	
//	.filterChunks(func)
//	.filterChunks(chunk_size, func)
//	.filterChunks([item_handler, chunk_handler])
//	.filterChunks(chunk_size, [item_handler, chunk_handler])
//		-> promise(list)
//	
//	.reduceChunks(func, res)
//	.reduceChunks(chunk_size, func, res)
//	.reduceChunks([item_handler, chunk_handler], res)
//	.reduceChunks(chunk_size, [item_handler, chunk_handler], res)
//		-> promise(res)
//
//
//	chunk_handler(chunk, result, offset)
//
//
// chunk_size can be:
// 	20			- chunk size
// 	'20'		- chunk size
// 	'20C'		- number of chunks
//	
//
// The main goal of this is to not block the runtime while processing a 
// very long array by interrupting the processing with a timeout...
//
var makeChunkIter = function(iter, wrapper){
	wrapper = wrapper
		|| function(res, func, array, e){
			return func.call(this, e[1], e[0], array) }
	return function(size, func, ...rest){
		var that = this
		var args = [...arguments]
		size = (args[0] instanceof Function 
				|| args[0] instanceof Array) ? 
			(this.CHUNK_SIZE || 50)
			: args.shift()
		size = typeof(size) == typeof('str') ?
				// number of chunks...
				(size.trim().endsWith('c') || size.trim().endsWith('C') ?
				 	Math.round(this.length / (parseInt(size) || 1)) || 1
				: parseInt(size))
			: size
		var postChunk
		func = args.shift()
		;[func, postChunk] = func instanceof Array ? func : [func]
		rest = args
		var res = []
		var _wrapper = wrapper.bind(this, res, func, this)

		return new Promise(function(resolve, reject){
				var next = function(chunks){
					setTimeout(function(){
						var chunk, val
						res.push(
							val = (chunk = chunks.shift())[iter](_wrapper, ...rest))
						postChunk
							&& postChunk.call(that, 
								chunk.map(function([i, v]){ return v }), 
								val,
								chunk[0][0])
						// stop condition...
						chunks.length == 0 ?
							resolve(res.flat(2))
							: next(chunks) }, 0) }
				next(that
					// split the array into chunks...
					.reduce(function(res, e, i){
						var c = res.slice(-1)[0]
						c.length >= size ?
							// initial element in chunk...
							res.push([[i, e]])
							// rest...
							: c.push([i, e])
						return res }, [[]])) }) } }

Array.prototype.CHUNK_SIZE = 50 
Array.prototype.mapChunks = makeChunkIter('map')
Array.prototype.filterChunks = makeChunkIter('map', 
	function(res, func, array, e){
		return !!func.call(this, e[1], e[0], array) ? [e[1]] : [] })
Array.prototype.reduceChunks = makeChunkIter('reduce',
	function(total, func, array, res, e){
		return func.call(this, 
			total.length > 0 ? 
				total.pop() 
				: res, 
			e[1], e[0], array) })


// Convert an array to object...
//
// Format:
// 	{
// 		<item>: <index>,
// 		...
// 	}
//
// NOTE: items should be strings, other types will get converted to 
// 		strings and thus may mess things up.
// NOTE: this will forget repeating items...
// NOTE: normalize will slow things down...
Array.prototype.toKeys = function(normalize){
	return normalize ? 
		this.reduce(function(r, e, i){
			r[normalize(e)] = i
			return r }, {})
		: this.reduce(function(r, e, i){
			r[e] = i
			return r }, {}) }


// Convert an array to a map...
//
// This is similar to Array.prototype.toKeys(..) but does not restrict 
// value type to string.
//
// Format:
// 	Map([
// 		[<item>, <index>],
// 		...
// 	])
//
// NOTE: this will forget repeating items...
// NOTE: normalize will slow things down...
Array.prototype.toMap = function(normalize){
	return normalize ? 
		this
			.reduce(function(m, e, i){
				m.set(normalize(e), i)
				return m }, new Map())
		: this
			.reduce(function(m, e, i){
				m.set(e, i)
				return m }, new Map()) }


// 	zip(array, array, ...)
// 		-> [[item, item, ...], ...]
//
// 	zip(func, array, array, ...)
// 		-> [func(i, [item, item, ...]), ...]
//
Array.zip = 
function(func, ...arrays){
	var i = arrays[0] instanceof Array ? 
		0 
		: arrays.shift()
	if(func instanceof Array){
		arrays.splice(0, 0, func)
		func = null }
	// build the zip item...
	// NOTE: this is done this way to preserve array sparseness...
	var s = arrays
		.reduce(function(res, a, j){
			//a.length > i
			i in a
				&& (res[j] = a[i])
			return res
		}, new Array(arrays.length))
	return arrays
			// check that at least one array is longer than i...
			.reduce(function(res, a){ 
				return Math.max(res, i, a.length) }, 0) > i ?
		// collect zip item...
		[func ? func(i, s) : s]
			// get next...
			.concat(this.zip(func, i+1, ...arrays))
		// done...
		: [] }
// XXX would be nice for this to use the instance .zip(..) in recursion...
// 		...this might be done by reversign the current implementation, i.e.
// 		for instance .zip(..) to be the main implementation and for 
// 		Array.zip(..) to be a proxy to that...
Array.prototype.zip =
function(func, ...arrays){
	return func instanceof Array ?
		this.constructor.zip(this, func, ...arrays)
		: this.constructor.zip(func, this, ...arrays) }



/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
