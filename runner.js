/**********************************************************************
* 
*
*
*
* XXX would be helpful to define a task api...
* 		task('abort') vs. task.abort(), task state,  ...etc.
* 	then define Task and TaskQueue(Queue) and extended api to:
* 		- task state introspection
* 		- stop/resume tasks (or task queue?)
* 		- serialize tasks
* 		- ...
* 	would be nice to make the task just a slightly extended or better
* 	defined function/generator, ideally to make them interchangable...
*
**********************************************/  /* c8 ignore next 2 */
((typeof define)[0]=='u'?function(f){module.exports=f(require)}:define)
(function(require){ var module={} // make module AMD/node compatible...
/*********************************************************************/

var object = require('ig-object')

var events = require('./event')



/*********************************************************************/
// helpers...

var makeEvent = function(func, mode){
	return Object.assign(
		func,
		{__event__: mode || true}) }
var makeActionEvent = function(func){
	return makeEvent(func, 'action') }


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// XXX use ./event...
var Queue =
module.Queue = object.Constructor('Queue', Array, {
	// create a running queue...
	run: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

}, {
	// config...
	//
	pool_size: 8,

	poling_delay: 200,

	auto_stop: false,


	__state: null,
	get state(){
		return this.__state 
			|| 'stopped' },
	set state(value){
		if(value == 'running'){
			this.start()
		} else if(value == 'stopped'){
			this.stop() } },


	// event API...
	//
	// XXX mignt be good to make this a generic mixin...
	// XXX should we use actions for this???
	// 		...likely no as it would pull in another dependency...
	//
	// NOTE: .trigger(..) will only call the handlers and not the actual 
	// 		event method unless it is defined as an action event...
	// NOTE: if '!' is appended to the event name .trigger(..) will not
	// 		call the event action.
	trigger: function(evt, ...args){
		var that = this
		// NOTE: needed to break recursion when triggering from an 
		// 		action event...
		var handlers_only = evt.endsWith('!')
		evt = handlers_only ?
			evt.slice(0, -1) 
			: evt

		// run the event action...
		if(!handlers_only
				&& (this[evt] || {}).__event__ == 'action'){
			this[evt]()

		// run the handlers...
		} else {
			;(this['__'+evt] || [])
				.forEach(function(handler){
					handler.call(that, evt, ...args) }) }
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
					that.off(evt, handler) 
					handler.call(this, ...arguments) }, 
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


	// events/actions - state transitions...
	//
	// NOTE: the following are equivalent:
	// 			.start()
	// 			.trigger('start')
	// 			.state = 'running'
	// 		and similar for 'stop'...
	start: makeActionEvent(function(handler){
		// register handler...
		if(typeof(handler) == 'function'){
			return this.on('start', handler) }
		// can't start while running...
		if(this.state == 'running'){
			return this }
		// do the action...
		this.__state = 'running'
		this.trigger('start!')
		this._run()
		return this }),
	stop: makeActionEvent(function(handler){
		// register handler...
		if(typeof(handler) == 'function'){
			return this.on('stop', handler) }
		// can't stop while not running...
		if(this.state == 'stopped'){
			return this }
		// do the action...
		this.__state = 'stopped'
		this.trigger('stop!')
		return this }),


	// events/actions - state transitions...
	//
	clear: makeActionEvent(function(handler){
		if(typeof(handler) == 'function'){
			return this.on('clear', handler) }
		this.splice(0, this.length) 
		return this }),


	// events...
	//
	taskStarting: makeEvent(function(func){
		return this.on('taskStarting', ...arguments) }),
	taskCompleted: makeEvent(function(func){
		return this.on('taskCompleted', ...arguments) }),
	queueEmpty: makeEvent(function(func){
		return this.on('queueEmpty', ...arguments) }),

	// helpers...
	//
	// XXX how do we reference the tasks here???
	// 		- indexes 
	// 		- ranges -- simelar to .slice(..)
	// 		- by value
	// XXX
	prioritize: function(){},
	// XXX same as prioritize but adds stuff to the tail...
	delay: function(){},

	// main runner...
	//
	// NOTE: we do not store the exec results...
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

			var task = this.shift()
			this.trigger('taskStarting', task)

			// run...
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
			this.trigger('queueEmpty')

			// auto-stop...
			this.auto_stop ?
				this.stop()
				// pole...
				: (this.poling_delay
					&& setTimeout(
						this._run.bind(this), 
						this.poling_delay || 200)) }

		return this },


	// constructor argument handling...
	//
	// 	Queue()
	// 		-> queue
	//
	// 	Queue(..,tasks)
	// 		-> queue
	//
	// 	Queue(options)
	// 	Queue(options, ..,tasks)
	// 		-> queue
	//
	__init__: function(options){ 
		if(this[0] instanceof Object 
				&& typeof(this[0]) != 'function'
				&& typeof(this[0].finally) != 'function'){
			Object.assign(this, this.shift()) }
		this._run() },
})





/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
