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

require('./Array')

var events = require('./event')



/*********************************************************************/

// XXX need to configure to run a specific amount of jobjs on each start...
// XXX do we need an async mode -- exec ._run(..) in a setTimeout(.., 0)???
var Queue =
module.Queue = object.Constructor('Queue', Array, {
	// create a running queue...
	run: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

}, events.EventMixin('flat', {
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

	// XXX
	run: function(count){
		// XXX start, run count tasks and stop...
	},

	// events/actions - state transitions...
	//
	// XXX would be nice to run a number of tasks...
	start: events.Event('start', function(handle){
		// can't start while running...
		if(this.state == 'running'){
			return handle(false) }
		this.__state = 'running'
		this._run() }),
	stop: events.Event('stop', function(handle){
		// can't stop while not running...
		if(this.state == 'stopped'){
			return handle(false) }
		this.__state = 'stopped' }),


	// events/actions - state transitions...
	//
	clear: events.Event(function(handler){
		this.splice(0, this.length) }),


	// events...
	//
	taskStarting: events.Event('taskStarting'),
	taskCompleted: events.Event('taskCompleted'),
	queueEmpty: events.Event('queueEmpty'),

	// helpers...
	//
	// XXX how do we reference the tasks here???
	// 		- indexes 
	// 		- ranges -- simelar to .slice(..)
	// 		- by value
	// XXX
	prioritize: function(...tasks){
		return this.sortAs(tasks) },
	// same as prioritize but adds stuff to the tail...
	delay: function(...tasks){
		return this.sortAs(tasks, true) },

	
	//
	//	.__run_task__(task)
	//		-> promise
	//		-> func
	//		-> queue
	//		-> ...
	//
	// XXX should this support a task being a queue ???
	// XXX do we actually need this??
	// 		...should this include result processing???
	__run_task__: function(task){
		return typeof(task) == 'function' ?
				task()
			: task instanceof Queue ?
				// XXX should we run one item or trigger and wait for event???
				// 		...should this be an option???
				task.start()
			: task },


	// main runner...
	//
	// NOTE: we do not store the exec results...
	// NOTE: not intended for direct use and will likely have no effect
	// 		if called directly... 
	//
	// XXX should this support a task being returning a queue???
	// XXX need to configure this to run a number of tasks only...
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
			// XXX BUG this executes the task for some reson...
			this.trigger('taskStarting', task)

			// run...
			var res = this.__run_task__(task)

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
						// XXX BUG this executes the task for some reson...
						.trigger('taskCompleted', task, res)
						._run() })

			// re-queue tasks...
			// XXX revise...
			} else if(typeof(res) == 'function'){
				this.push(res)

			// queue...
			} else if(res instanceof Queue){
				// XXX should this be done on stop or on .length == 0???
				if(queue.state == 'stopped'){
					this.trigger('taskCompleted', task, res)

				} else {
					running.push(res)
					res.stop(function(){
						// XXX not done yet -- re-queue... 
						res.length > 0
							&& that.push(res) 
						// XXX remove from running...
						// XXX trigger event...
					}) }

			// completed sync task...
			} else {
				// XXX BUG this executes the task for some reson...
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
}))





/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
