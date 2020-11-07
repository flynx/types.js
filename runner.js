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

var makeEvent = function(func){
	return Object.assign(
		func,
		{__event__: true}) }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var Queue =
module.Queue = object.Constructor('Queue', Array, {
	run: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

},{
	pool_size: 8,
	poling_delay: 200,
	autostop: false,

	__state: null,
	get state(){
		return this.__state 
			|| 'stopped' },
	set state(value){
		if(!['running', 'stopped'].includes(value)){
			return }
		this.__state = value
		value == 'running'
			&& this._run() },

	start: function(){
		this.state = 'running'
		return this },
	stop: function(){
		this.state = 'stopped'
		return this },
	clear: function(){
		this.splice(0, this.length) 
		return this },

	// event API...
	// XXX mignt be good to make this a generic mixin...
	trigger: function(evt, ...args){
		var that = this
		;(this['__'+evt] || [])
			.forEach(function(handler){
				handler.call(that, evt, ...args) })
		return this },
	on: function(evt, handler){
		if(!handler){
			throw new Error('.on(..): need a handler') }
		if(!this[evt] || !this[evt].__event__){
			throw new Error('.on(..): can\'t register handler for non-event:'+ evt) }
		evt = '__'+evt
		handler
			&& (this[evt] = this[evt] || []).push(handler)
		return this },
	one: function(evt, handler){
		var that = this
		return handler ?
			this.on(evt, Object.assign(
				function(){
					handler.call(this, ...arguments)
					that.off(evt, handler) }, 
				{ original_handler: handler }))
			: this },
	off: function(evt, handler){
		var handlers = (this['__'+evt] || [])
		handlers.length > 0
			&& handlers.splice(0, handlers.length,
				...handlers
					.filter(function(func){
						return func === handler
							|| func.original_handler === handler }))
		return this },

	// events...
	taskCompleted: makeEvent(function(func){
		return this.on('taskCompleted', ...arguments) }),

	// NOTE: we do not store the exec results... (XXX ???)
	// NOTE: not intended for direct use and will likely have no effect
	// 		if called directly... 
	__running: null,
	_run: function(){
		// if we are not running stop immidiately...
		if(this.state != 'running'){
			return this }

		var that = this
		var running = this.__running = this.__running || []

		// handle queue...
		while(this.length > 0 
				&& this.state == 'running'
				&& running.length < (this.pool_size || Infinity) ){

			// run...
			var task = this.shift()
			var res = typeof(task) == 'function' ?
				task()
				: task

			// pool async (promise) task...
			if(typeof((res || {}).finally) == 'function'
					// one post handler is enough...
					&& !running.includes(res)){
				running.push(res) 
				res.finally(function(){
					// remove from running...
					running.splice(0, running.length, 
						// NOTE: there can be multiple occurences of res...
						...running
							.filter(function(e){ return e !== res }))
					// finishup...
					that
						.trigger('taskCompleted', task, res)
						._run() })

			// completed sync task...
			} else {
				this.trigger('taskCompleted', task, res) } }

		// empty queue -> pole or stop...
		//
		// NOTE: we endup here in two cases:
		// 		- the pool is full
		// 		- the queue is empty
		// NOTE: we do not care about stopping the timer when changing 
		// 		state as ._run() will stop itself...
		//
		// XXX will this be collected by the GC if it is polling???
		if(this.length == 0 
				&& this.state == 'running'){
			this.autostop ?
				this.stop()
				// pole...
				: (this.poling_delay
					&& setTimeout(
						this._run.bind(this), 
						this.poling_delay || 200)) }

		return this },

	__init__: function(options){ 
		if(this[0] instanceof Object 
				&& typeof(this[0]) != 'function'
				&& typeof(this[0].finally) != 'function'){
			Object.assign(this, this.shift()) }
		this._run() },
})





/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
