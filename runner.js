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
require('./Promise')

var events = require('./event')



/*********************************************************************/

module.STOP = object.STOP



//---------------------------------------------------------------------
// Queue...
//
// A means to manage execution of large-ish number of small tasks...
//
// XXX need to configure to run a specific amount of jobs on each start...
var Queue =
module.Queue = 
object.Constructor('Queue', Array, {
	// create a running queue...
	runTasks: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

}, events.EventMixin('flat', {
	// config...
	//
	pool_size: 8,

	poling_delay: 200,

	auto_stop: false,

	// NOTE: if true this is sync only untill the pool is filled or task 
	// 		list is depleted...
	sync_start: false,

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


	// NOTE: each handler will get called once when the next time the 
	// 		queue is emptied...
	then: function(func){
		var that = this
		return new Promise(function(resolve, reject){
			that.one('queueEmpty', function(){
				resolve(func()) }) }) },


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
	//		-> queue
	//		-> promise
	//		-> func
	//		-> ...
	//
	// NOTE: this intentionally does not handle results as that whould 
	// 		require this to also handle events, and other runtime stuff...
	// 		...to add a new task/result type either handle the non-standard
	// 		result here or wrap it into a standard return value like a 
	// 		promise...
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
	// 	Hanlde 'running' state (async)...
	// 	.__run_tasks__()
	// 		-> this
	//
	// NOTE: we do not store the exec results...
	// NOTE: not intended for direct use and will likely have no effect
	// 		if called directly... 
	__running: null,
	__run_tasks__: function(){
		var that = this

		var run = function(){
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
				this.auto_stop ?
					// auto-stop...
					this.stop()
					// pole...
					: (this.poling_delay
						&& setTimeout(
							this.__run_tasks__.bind(this), 
							this.poling_delay || 200)) } }.bind(this)

		this.state == 'running'
			&& (this.sync_start ?
				run()
				: setTimeout(run, 0))
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

		// closure: running, task, res, stop, next...
		var runningDone = function(){
			running.splice(0, running.length, 
				// NOTE: there can be multiple occurences of res...
				...running
					.filter(function(e){ return e !== res })) 
			that.trigger('taskCompleted', task, res) 
			!stop && next
				&& next() }

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
					// not fully done yet -- re-queue... 
					res.length > 0
						&& that.push(res) 
					runningDone() }) }

		// pool async (promise) task...
		} else if(typeof((res || {}).finally) == 'function'
				// one post handler is enough...
				&& !running.includes(res)){
			running.push(res) 
			res.finally(function(){
				runningDone() })

		// re-queue tasks...
		} else if(typeof(res) == 'function'){
			that.trigger('taskCompleted', task, res)
			this.push(res)

		// completed sync task...
		} else {
			this.trigger('taskCompleted', task, res) }

		this.length == 0
			&& this.trigger('queueEmpty')

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


//---------------------------------------------------------------------
// Task manager...
//
// Externally manage/influence long running tasks...
//
// A task can be:
// 	- Promise.interactive(..)
// 	- function(onmsg, ..)
// 	- object supporting task protocol
//
// The task is controlled by passing messages, default messages include:
// 	- .stop(..)
//
//
// Task protocol:
// 	.then(..)		- registers a completion handler (a-la Promise)
// 	.stop(..)		- triggers a task to stop
//
//

var TaskMixin = 
object.Mixin('TaskMixin', 'soft', {
	// standard messages...
	stop: function(){
		this.send('stop', ...arguments) },
})


// XXX we should keep the API here similar to Queue...
// 		...but this is no a queue in principle (internal vs. external 
// 		management) so we'll also need to keep them different enough to 
// 		avoid confusion...
var TaskManager =
module.TaskManager =
object.Constructor('TaskManager', Array, events.EventMixin('flat', {
	sync_start: false,

	//
	//	.named(name)
	//	.named(name, ..)
	//		-> manager
	//
	named: function(name){
		var names = new Set([...arguments])
		return this
			.filter(function(task){ 
				return names.has(task.name) }) },

	// XXX each task should also trigger this when stopping and this 
	// 		should not result in this and tasks infinitely playing 
	// 		ping-pong...
	// 		XXX one way to go here is to make this an event proxy, i.e.
	// 			when calling/binding to this it actually binds to each 
	// 			task ???)
	stop: events.Event('stop', 
		function(handlers, name){
			name != null ?
				this.named(name).stop()
				: this.forEach(function(task){
					task.stop() }) }),

	done: events.Event('done'),
	error: events.Event('error'),


	//
	//	.Task(task, ..)
	//	.Task(name, task, ..)
	//		-> task-handler
	//
	// NOTE: the task is started as soon as it is accepted.
	Task: function(name, task, ...args){
		var that = this

		// anonymous task...
		if(typeof(name) != typeof('str')){
			;[task, ...args] = arguments
			name = null }

		// normalize handler...
		var run
		var handler = 
			// queue...
			// NOTE: queue is task-compatible...
			task instanceof Queue ?
				task
			// task protocol...
			: task && task.then && task.stop ?
				task
			: TaskMixin(
				// interactive promise...
				task instanceof Promise.interactive ?
					task
				// dumb promise -- will ignore all the messages...
				// XXX should we complain about this???
				: task instanceof Promise ?
					Promise.interactive(
						function(resolve, reject, onmsg){
							onmsg(function(msg){
								msg == 'stop'
									&& reject() })
							task.then(resolve, reject) })
				// function...
				: Promise.interactive(
					function(resolve, reject, onmsg){
						run = function(){
							resolve(task(onmsg, ...args)) } }))
		// set handler name...
		// NOTE: this will override the name of the handler if it was 
		// 		set before...
		if(name){
			handler.name
				&& console.warn(
					'TaskManager.Task(..): task name already defined:', handler.name,
					'overwriting with:', name)
			Object.assign(handler, {name})
		}

		this.push(handler)

		// handle done...
		handler
			.then(
				function(res){
					that.splice(that.indexOf(handler), 1)
					that.trigger('done', task, res) },
				// err...
				function(res){
					that.splice(that.indexOf(handler), 1)
					that.trigger('error', task, res) })
		handler
			.finally(function(){
				that.length == 0
					&& that.done('all') })

		// start the task...
		var start = function(){
			run ?
				run()
			: task.start ?
				task.start()
	   		: null }
		this.sync_start ?
			start()
			: setTimeout(start, 0)

		return handler },
}))




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
