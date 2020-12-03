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
// A queue is a list of async functions that get executed in order and 
// not more than .pool_size can run at a time, i.e. new tasks get 
// started only only when tasks in the running pool either finish or 
// release their spot in the pool.
//
// XXX need to configure to run a specific amount of jobs on each start...
// XXX triggering .tasksAdded(..)...
// 		there are two ways to go here:
// 			- wrap the queue in a proxy
// 				+ transparent-ish
// 				- reported in a confusing way by node/chrome...
// 			- force the user to use specific API
// 				- not consistent -- a task can be added via .add(..) and 
// 				  the Array interface and only .add(..) will trigger the 
// 				  proper events...
// XXX document the Queue({handler: e => e*e}, 1,2,3,4) use-case...
// 		...this is essentially a .map(..) variant...
var Queue =
module.Queue = 
object.Constructor('Queue', Array, {
	// create a running queue...
	runTasks: function(...tasks){
		return this({ state: 'running' }, ...tasks) },

}, events.EventMixin('flat', {
	// Config...
	//
	// Number of tasks to be running at the same time...
	pool_size: 8,

	// Number of tasks to run before letting go of the exec frame...
	pause_after_sync: 4,

	// Start synchronously...
	//
	// NOTE: this affects the start only, all other timeouts apply as-is... 
	sync_start: false,

	catch_errors: true,

	// If true, stop after queue is depleted...
	auto_stop: false,

	// Sub-queue handling mode...
	//
	// This can be:
	// 	'wait'		- wait fot the sun-queue to stop
	// 	'unwind'	- run sub-task and requeue parent
	//
	// XXX do we need this???
	// XXX should the nested queue decide??? ...how???
	sub_queue: 'unwind',

	// If true only add unique items to queue...
	// XXX not implemented yet... 
	// 		...how should this be done?
	// 			- keep a set of seen elements and check against it?
	// 			- check against the queue contents?
	unique_items: false,

	// Timeouts...
	//
	// Time to wait when pool is full...
	// if 'auto', wait the average task time * .busy_timeout_scale.
	// XXX revise defaults...
	busy_timeout: 50,

	//busy_timeout: 'auto',
	busy_timeout_scale: 5,

	// Time to wait between checks for new tasks in an empty queue...
	poling_timeout: 200,

	// Time to pause after a set of .pause_after_sync sync tasks...
	pause_timeout: 0,

	// Runtime statistics...
	//
	// To disable set to false
	//
	// NOTE: this, if true, will get replaced with the stats...
	runtime_stats: true,


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
	// NOTE: to start synchronously call .start(true), this will not 
	// 		affect further operation...
	// XXX would be nice to run a specific number of tasks and stop...
	start: events.Event('start', function(handle, sync){
		// can't start while running...
		if(this.__state == 'running'){
			return handle(false) }
		this.__state = 'running'
		this.__run_tasks__(sync) }),
	stop: events.Event('stop', function(handle){
		// can't stop while not running...
		if(this.state == 'stopped'){
			return handle(false) }
		this.__state = 'stopped' }),

	// events...
	//
	// 	.tasksAdded(func(evt, [task, ..]))
	// 	.taskStarting(func(evt, task))
	// 	.taskCompleted(func(evt, task))
	// 	.queueEmpty(func(evt))
	//
	tasksAdded: events.PureEvent('tasksAdded'),
	taskStarting: events.PureEvent('taskStarting'),
	taskCompleted: events.PureEvent('taskCompleted'),
	taskFailed: events.PureEvent('taskFailed'),
	queueEmpty: events.PureEvent('queueEmpty'),


	// NOTE: each handler will get called once when the next time the 
	// 		queue is emptied...
	// XXX should this trigger on empty or on stop???
	then: function(func){
		var that = this
		return new Promise(function(resolve, reject){
			that.one('queueEmpty', function(){
				resolve(func()) }) }) },

	// Runner API...
	//
	//	Run the given task type...
	//	.handler(task[, next])
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
	handler: function(task, next){
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
	// NOTE: .sync_start affects only the first run...
	// NOTE: we do not store the exec results...
	// NOTE: not intended for direct use and will likely have no effect
	// 		if called directly... 
	//
	// XXX will this be collected by the GC if it is polling???
	__running: null,
	__run_tasks__: function(sync){
		var that = this
		sync = sync == null ?
				this.sync_start
			: sync == 'async' ?
				false
			: !!sync

		var run = function(){
			var c = 0
			var pause = this.pause_after_sync
			var running = this.__running || []

			// run queue...
			while(this.length > 0 
					&& this.state == 'running'
					// do not exceed pool size...
					&& running.length < this.pool_size
					// do not run too many sync tasks without a break...
					&& (pause == null
						|| c < pause)){
				var p = running.length

				this.runTask(this.__run_tasks__.bind(this)) 

				// NOTE: only count sync stuff that does not get added 
				// 		to the pool...
				p == running.length
					&& c++ }

			// empty queue -> pole or stop...
			//
			// NOTE: we endup here in two cases:
			// 		- the pool is full
			// 		- the queue is empty
			// NOTE: we do not care about stopping the timer when changing 
			// 		state as .__run_tasks__() will stop itself...
			if(this.state == 'running'){
				var timeout = 
					// idle -- empty queue...
					this.length == 0 ?
						this.poling_timeout
					// busy poling -- pool full...
					: c < pause ?
						//this.busy_timeout
						(this.runtime_stats && this.busy_timeout == 'auto' ?
							(this.runtime_stats.avg_t || 50) * (this.busy_timeout_scale || 2)
						: this.busy_timeout == 'auto' ?
							50 * (this.busy_timeout_scale || 2)
						: this.busy_timeout)
					// pause -- let other stuff run...
					: (this.pause_timeout || 0)

				;(this.length == 0 && this.auto_stop) ?
					// auto-stop...
					(timeout != null ?
						// wait a bit then stop if still empty...
						setTimeout(function(){
							that.length > 0 ?
								that.__run_tasks__()
								: that.stop()
							}, timeout)
						// stop now...
						: this.stop())
					// pole / pause...
					: timeout != null
						&& setTimeout(
							this.__run_tasks__.bind(this), timeout) } }.bind(this)

		this.state == 'running'
			&& (sync ?
				run()
				: setTimeout(run, 0))
		return this },
	// run one task from queue...
	// NOTE: this does not care about .state...
	// XXX revise error handling...
	// XXX add task runtime stat...
	runTask: function(next){
		var that = this
		var running = this.__running = this.__running || []

		// can't run... 
		if(this.length == 0
				|| running.length >= this.pool_size ){
			return this }

		// closure: running, task, res, stop, next...
		var taskCompleted = function(){
			// calculate runtime statistics...
			if(that.runtime_stats){
				var x = Date.now() - t0
				var s = that.runtime_stats = 
					that.runtime_stats 
						|| {max_t: x, min_t: x, avg_t: x, count: 0}
				s.max_t = Math.max(s.max_t, x)
				s.min_t = Math.min(s.min_t, x)
				var i = ++s.count
				var a = s.avg_t 
				s.avg_t = a + (x - a)/i }

			that.trigger('taskCompleted', task, res) }
		var runningDone = function(){
			running.splice(0, running.length, 
				// NOTE: there can be multiple occurences of res...
				...running
					.filter(function(e){ return e !== res })) 
			taskCompleted()
			!stop && next
				&& next() }

		var task = this.shift()

		this.trigger('taskStarting', task)
		var t0 = this.runtime_stats && Date.now()

		// run...
		// catch and pass errors to .taskFailed(...)
		if(this.catch_errors){
			var err
			try {
				var res = this.handler(task, next)

			} catch(err){
				this.trigger('taskFailed', task, err) }

			// promise result...
			// XXX is the err test here needed???
			res 
				&& err === undefined 
				&& res.catch
				&& res.catch(function(err){
					that.trigger('taskFailed', task, err) })

		// ignore errors...
		} else {
			var res = this.handler(task, next) }

		// handle stop...
		var stop = res === module.STOP 
			|| res instanceof module.STOP
		res = res instanceof module.STOP ?
			res.value
			: res

		// handle task results...
		//
		// queue -- as a set of tasks...
		if(res instanceof Queue
				&& this.sub_queue == 'unwind'){
			if(res.length > 0){
				this.push(res) }
			taskCompleted()

		// queue -- as a task...
		} else if(res instanceof Queue
				&& this.sub_queue == 'wait'){
			if(res.state == 'stopped'){
				taskCompleted()

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
			res.finally(runningDone)

		// re-queue tasks...
		} else if(typeof(res) == 'function'){
			taskCompleted()
			this.push(res)

		// completed sync task...
		} else {
			taskCompleted() }

		this.length == 0
			&& this.trigger('queueEmpty')

		stop
			&& this.stop()

		return this },


	// helpers...
	//
	// move tasks to head/tail of queue resp.
	prioritize: function(...tasks){
		return this.sortAs(tasks) },
	delay: function(...tasks){
		return this.sortAs(tasks, true) },


	// edit/add API...
	//
	// trigger .tasksAdded(..) on relevant methods...
	//
	// NOTE: adding tasks via the [..] notation will not trigger the 
	// 		event...
	push: function(...tasks){
		res = object.parentCall(Queue.prototype.push, this, ...tasks)
		this.trigger('tasksAdded', tasks)
		return res },
	unsift: function(...tasks){
		res = object.parentCall(Queue.prototype.unshift, this, ...tasks)
		this.trigger('tasksAdded', tasks)
		return res },
	splice: function(...args){
		res = object.parentCall(Queue.prototype.splice, this, ...args)
		var tasks = args.slice(2)
		tasks.length > 0
			&& this.trigger('tasksAdded', tasks)
		return res },

	// shorthands...
	add: function(...tasks){
		this.push(...tasks)
		return this },
	clear: function(){
		this.splice(0, this.length) 
		if(this.state == 'running'){
			this.trigger('queueEmpty')
			this.trigger('stop') } },


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
		this.length > 0
			&& this.trigger('tasksAdded', [...this])
		// see if we need to start...
		this.__run_tasks__() },
}))



//---------------------------------------------------------------------
// Task manager...

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Helpres...

// Task ticket...
//
// This lets the client control the task object and receive messages 
// from it.
//
// NOTE: this is not intended for direct use...
var TaskTicket =
// XXX do we let the user see this???
module.TaskTicket =
object.Constructor('TaskTicket', Promise, {
	__data: null,

	title: null,
	task: null,

	get state(){
		return this.__data.state },

	resolve: function(...args){
		if(this.__data.state == 'pending'){
			this.__data.state = 'resolved'
			this.__data.resolve(...args) }
		return this },
	reject: function(...args){
		if(this.__data.state == 'pending'){
			this.__data.state = 'rejected'
			this.__data.reject(...args) }
		return this },
	onmessage: function(msg, func){
		this.__data.onmessage(
			typeof(msg) == 'function' ?
				msg
				: function(m, ...args){
					m == msg
						&& func(...args) })
		return this },

	then: Promise.iter.prototype.then,

	__new__: function(_, title, resolve, reject, onmessage, task){
		var handlers
		var resolver = arguments[1]

		var obj = Reflect.construct(
			TaskTicket.__proto__, 
			[function(resolve, reject){
				handlers = {resolve, reject} 
				// NOTE: this is here to support builtin .then(..)
				typeof(resolver) == 'function'
					&& resolver(resolve, reject) }], 
			TaskTicket) 
		// if we got a resolver then it's an internal constructor we are
		// not using (likely in base .then(..)) so there is no point in 
		// moving on...
		// NOTE: this may be a potential source of bugs so we need to 
		// 		keep tracking this (XXX)
		if(typeof(resolver) == 'function'){
			return obj }

		// bind this to external resolve/reject...
		obj.then(
			function(){
				resolve(...arguments) }, 
			function(){
				reject(...arguments) })
		// setup state...
		obj.title = title
		obj.task = task
		Object.defineProperty(obj, '__data', {
			value: {
				resolve: handlers.resolve, 
				reject: handlers.reject, 
				onmessage,
				state: 'pending',
			},
			enumerable: false,
		}) 
		return obj },
})


// NOTE: this is not intended for direct use...
var TaskMixin = 
module.TaskMixin =
object.Mixin('TaskMixin', 'soft', {
	// standard messages...
	stop: function(){
		this.send('stop', ...arguments) },
})



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Task manager...
//
// Externally manage/influence long running tasks...
//
// A task can be:
// 	- Promise.interactive(..)
// 	- Queue(..)
// 	- function(ticket, ..)
// 	- object supporting task protocol
//
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
// NOTE: we should keep the API here similar to Queue...
// 		...but this is not a queue in principle (internal vs. external 
// 		management) so we'll also need to keep them different enough to 
// 		avoid confusion...
//
// XXX should a task manager have a pool size???
// 		...if yes it would be fun to use the queue to manage the pool...
var TaskManager =
module.TaskManager =
object.Constructor('TaskManager', Array, events.EventMixin('flat', {
	__task_ticket__: TaskTicket,
	__task_mixin__: TaskMixin,

	// settings...
	//
	// if true start/end times will be set on the task:
	// 	.time_started
	// 	.time_ended
	record_times: true,

	// if true the task will be started sync before .Task(..) is returns..
	//
	// NOTE: this is not recommended as the default as this can block the
	// 		manager...
	sync_start: false,


	//
	//	.titled(title)
	//	.titled(title, ..)
	//		-> manager
	//
	titled: function(title){
		if(title == 'all' || title == '*'){
			return this }
		var titles = new Set([...arguments])
		return this
			.filter(function(task){ 
				return titles.has(task.title) }) },

	// actions...
	//
	// commands to test as methods...
	// 	i.e. task.send(cmd, ...args) -> task[cmd](...args)
	__send_commands__: [ 'stop' ],
	send: function(title, ...args){
		var that = this
		if(title == 'all' || title == '*'){
			this.forEach(function(task){
				'send' in task ?
					task.send(...args) 
				: that.__send_commands__.includes(args[0]) ?
					task[args[0]](...args.slice(1))
				// XXX
				: console.warn('.send(..): can\'t .send(..) to:', task) 
			})
			return this }
		return this.titled(
				...(title instanceof Array) ?
					title
					: [title])
			.send('all', ...args) },
	// XXX should this be an event???
	//		the best way to go would be to proxy this to task-specific
	//		variants and register handlers on the tasks...
	//		...should work with .on(..) / ... and other event methods...
	stop: function(title='all'){
		this.send(title, 'stop') 
		return this },

	// events...
	//
	// XXX need to be able to bind to proxy events...
	done: events.PureEvent('done'),
	error: events.PureEvent('error'),
	tasksDone: events.PureEvent('tasksDone'),


	// Create/start a task...
	//
	//	Create a task...
	//	.Task(task)
	//	.Task(title, task)
	//		-> task-handler
	//
	//
	//	Create a function task...
	//	.Task(func, ..)
	//	.Task(title, func, ..)
	//		-> task-handler
	//
	//	func(ticket, ..)
	//
	//
	// A task can be:
	// 	- Promise.cooperative instance
	// 	- Queue instance
	// 	- function
	// 	- Promise instance
	//
	// The task-manager is a Promise.interactive(..) instance with 
	// TaskMixin added.
	//
	// The ticket is a TaskTicket instance, see it for reference...
	//
	//
	//
	// We can also force a specific task to start sync/async regardless 
	// of the .sync_start setting:
	//
	//	.Task('sync', task)
	//	.Task('sync', title, task)
	//	.Task(title, 'sync', task)
	//		-> task-handler
	//
	//	.Task('async', task)
	//	.Task('async', title, task)
	//	.Task(title, 'async', task)
	//		-> task-handler
	//
	//
	// sync/async start mode apply only to function tasks and tasks that
	// have a .start() method like Queue's...
	//
	//
	// NOTE: 'sync' more for a blocking task will block the task manager.
	// NOTE: only function tasks accept args.
	// NOTE: the task is started as soon as it is accepted.
	// NOTE: tasks trigger events only on the task-manager instance that
	// 		they were created in...
	// 		XXX try and make all event handlers to be registered in the 
	// 			task itself and all the manager events just be proxies 
	// 			to tasks...
	// 			...this needs to work with all the event methods...
	Task: function(title, task, ...args){
		var that = this
		var _args = [...arguments]

		// parse args...
		var sync_start = this.sync_start
		if(title == 'sync' || title == 'async'){
			;[sync_start, title, task, ...args] = _args
			sync_start = sync_start == 'sync'

		} else if(task == 'sync' || task == 'async'){
			;[title, sync_start, task, ...args] = _args
			sync_start = sync_start == 'sync' }

		// anonymous task...
		if(typeof(title) != typeof('str')){
			;[task, ...args] = _args
			title = null }

		// normalize handler...
		var run
		var handler = 
			// queue...
			// NOTE: queue is task-compatible...
			task instanceof Queue ?
				task
			// task protocol...
			: task && task.then 
					&& (task.stop || task.send) ?
				task
			: this.__task_mixin__(
				// interactive promise...
				task instanceof Promise.interactive ?
					task
				// dumb promise -- will ignore all the messages...
				// XXX should we complain about this???
				: task instanceof Promise ?
					Promise.interactive(
						function(resolve, reject, onmsg){
							// NOTE: since this is a promise, we can't
							// 		stop it externally...
							onmsg(function(msg){
								msg == 'stop'
									&& reject('stop') })
							task.then(resolve, reject) })
				// function...
				: Promise.interactive(
					function(resolve, reject, onmessage){
						// NOTE: we need to start this a bit later hence 
						// 		we wrap this into run(..) and call it when
						// 		the context is ready...
						run = function(){
							var res = 
								task(
									that.__task_ticket__(title, resolve, reject, onmessage, handler), 
									...args) 
							// NOTE: if the client calls resolve(..) this 
							// 		second resolve(..) call has no effect,
							// 		and the same is true with reject...
							// XXX is double binding like this (i.e. 
							// 		ticket + .then()) a good idea???
							res instanceof Promise
								&& res.then(resolve, reject) } }))
		// set handler title...
		// NOTE: this will override the title of the handler if it was 
		// 		set before...
		if(title){
			handler.title
				&& console.warn(
					'TaskManager.Task(..): task title already defined:', handler.title,
					'overwriting with:', title)
			Object.assign(handler, {title}) }

		this.push(handler)

		this.record_times
			&& (handler.time_started = Date.now())

		// handle task manager state...
		var cleanup = function(evt){
			return function(res){
				that.record_times
					&& (handler.time_ended = Date.now())
				that.splice(that.indexOf(handler), 1)
				that.trigger(evt, task, res) 
				that.length == 0
					&& that.trigger('tasksDone') } }
		handler
			.then(cleanup('done'), cleanup('error'))

		// start...
		var start = function(){
			run ?
				run()
			: task.start ?
				task.start()
	   		: null }
		// trigger task start...
		sync_start ?
			start()
			: setTimeout(start, 0)

		return handler },
}))




/**********************************************************************
* vim:set ts=4 sw=4 :                               */ return module })
