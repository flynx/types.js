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

module.STOP = object.STOP



//---------------------------------------------------------------------

// XXX need to configure to run a specific amount of jobjs on each start...
// XXX do we need an async mode -- exec .__run_tasks__(..) in a 
// 		setTimeout(.., 0)???
var Queue =
module.Queue = object.Constructor('Queue', Array, {
	// create a running queue...
	runTasks: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

}, events.EventMixin('flat', {
	// config...
	//
	pool_size: 8,

	poling_delay: 200,

	auto_stop: false,

	//
	// This can be:
	// 	'wait'		- wait fot the sun-queue to stop
	// 	'unwind'	- run sub-task and requeue parent
	//
	// XXX do we need this???
	// XXX should the nested queue decide???
	// 		...how???
	sub_queue: 'unwind',


	//
	// This can be:
	// 		'running'
	// 		'stopped'
	//
	__state: null,
	get state(){
		return this.__state 
			|| 'stopped' },
	set state(value){
		if(value == 'running'){
			this.start()
		} else if(value == 'stopped'){
			this.stop() } },

	// events/actions - state transitions...
	//
	// XXX would be nice to run a number of tasks...
	start: events.Event('start', function(handle){
		// can't start while running...
		if(this.state == 'running'){
			return handle(false) }
		this.__state = 'running'
		this.__run_tasks__() }),
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
	// move tasks to head/tail of queue resp.
	prioritize: function(...tasks){
		return this.sortAs(tasks) },
	delay: function(...tasks){
		return this.sortAs(tasks, true) },


	// Runner API...
	//
	//	Run the given task type...
	//	.__run_task__(task[, next])
	//		-> STOP
	//		-> STOP(value)
	//		-> promise
	//		-> func
	//		-> queue
	//		-> ...
	//
	__run_task__: function(task, next){
		return typeof(task) == 'function' ?
				task()
			: (task instanceof Queue 
					&& this.sub_queue == 'unwind') ?
				(task.runTask(next), task)
			: (task instanceof Queue 
					&& this.sub_queue == 'wait') ?
				task.start()
			: task },
	//
	// 	Hanlde 'running' state...
	// 	.__run_tasks__()
	// 		-> this
	//
	// NOTE: we do not store the exec results...
	// NOTE: not intended for direct use and will likely have no effect
	// 		if called directly... 
	__running: null,
	__run_tasks__: function(){
		var that = this

		// if we are not running stop immidiately...
		if(this.state != 'running'){
			return this }

		// handle queue...
		while(this.length > 0 
				&& this.state == 'running'
				&& (this.__running || []).length < (this.pool_size || Infinity) ){
			this.runTask(this.__run_tasks__.bind(this)) }

		// empty queue -> pole or stop...
		//
		// NOTE: we endup here in two cases:
		// 		- the pool is full
		// 		- the queue is empty
		// NOTE: we do not care about stopping the timer when changing 
		// 		state as .__run_tasks__() will stop itself...
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
						this.__run_tasks__.bind(this), 
						this.poling_delay || 200)) }
		return this },

	// run one task from queue...
	//
	// NOTE: this does not care about .state...
	runTask: function(next){
		var running = this.__running = this.__running || []

		// can't run... 
		if(this.length == 0
				|| running.length >= this.pool_size ){
			return this }

		var cleanupRunning = function(res){
			running.splice(0, running.length, 
				// NOTE: there can be multiple occurences of res...
				...running
					.filter(function(e){ return e !== res })) }

		var task = this.shift()

		this.trigger('taskStarting', task)

		// run...
		var res = this.__run_task__(task, next)

		// handle stop...
		var stop = res === module.STOP 
			|| res instanceof module.STOP
		res = res instanceof module.STOP ?
			res.value
			: res
		stop
			&& this.stop()

		// handle task results...
		//
		// queue -- as a set of tasks...
		if(res instanceof Queue
				&& this.sub_queue == 'unwind'){
			if(res.length > 0){
				this.push(res) }
			this.trigger('taskCompleted', task, res)

		// queue -- as a task...
		} else if(res instanceof Queue
				&& this.sub_queue == 'wait'){
			if(res.state == 'stopped'){
				this.trigger('taskCompleted', task, res)

			} else {
				running.push(res)
				res.stop(function(){
					cleanupRunning(res)
					// not done yet -- re-queue... 
					res.length > 0
						&& that.push(res) 
					that.trigger('taskCompleted', task, res) 
					!stop && next
						&& next() }) }

		// pool async (promise) task...
		} else if(typeof((res || {}).finally) == 'function'
				// one post handler is enough...
				&& !running.includes(res)){
			running.push(res) 
			res.finally(function(){
				cleanupRunning(res)
				// finishup...
				that.trigger('taskCompleted', task, res)
				!stop && next
					&& next() })

		// re-queue tasks...
		} else if(typeof(res) == 'function'){
			this.push(res)

		// completed sync task...
		} else {
			this.trigger('taskCompleted', task, res) }

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
		// options...
		if(!(this[0] instanceof Queue)
				&& this[0] instanceof Object 
				&& typeof(this[0]) != 'function'
				&& typeof(this[0].finally) != 'function'){
			Object.assign(this, this.shift()) }
		// see if we need to start...
		this.__run_tasks__() },
}))





/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
