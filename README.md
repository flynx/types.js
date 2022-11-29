# types.js

Library of JavaScript type extensions, types and utilities.

- [types.js](#typesjs)
  - [Installation](#installation)
  - [Basic usage](#basic-usage)
  - [`Object`](#object)
    - [`Object.deepKeys(..)`](#objectdeepkeys)
    - [`Object.copy(..)` (EXPERIMENTAL)](#objectcopy-experimental)
    - [`Object.flatCopy(..)`](#objectflatcopy)
    - [`Object.match(..)`](#objectmatch)
    - [`Object.matchPartial(..)`](#objectmatchpartial)
    - [`<object>.run(..)`](#objectrun)
    - [`Object.sort(..)`](#objectsort)
  - [`Function`](#function)
    - [`func.AsyncFunction`](#funcasyncfunction)
  - [`Array`](#array)
    - [`<array>.first(..)` / `<array>.last(..)`](#arrayfirst--arraylast)
    - [`<array>.rol(..)`](#arrayrol)
    - [`<array>.compact()`](#arraycompact)
    - [`<array>.len`](#arraylen)
    - [`<array>.unique()` / `<array>.tailUnique()`](#arrayunique--arraytailunique)
    - [`<array>.trim()` / `<array>.trimStart()` / `<array>.trimEnd()`](#arraytrim--arraytrimstart--arraytrimend)
    - [`<array>.cmp(..)`](#arraycmp)
    - [`<array>.setCmp(..)`](#arraysetcmp)
    - [`<array>.sortAs(..)`](#arraysortas)
    - [`<array>.inplaceSortAs(..)`](#arrayinplacesortas)
    - [`<array>.toKeys(..)`](#arraytokeys)
    - [`<array>.toMap(..)`](#arraytomap)
    - [`Array.zip(..)` / `<array>.zip(..)`](#arrayzip--arrayzip)
    - [`Array.iter(..)` / `<array>.iter()`](#arrayiter--arrayiter)
    - [`<array>.between(..)`](#arraybetween)
    - [Abortable `Array` iteration](#abortable-array-iteration)
      - [`array.STOP` / `array.STOP(..)`](#arraystop--arraystop)
      - [`<array>.smap(..)` / `<array>.sfilter(..)` / `<array>.sreduce(..)` / `<array>.sforEach(..)`](#arraysmap--arraysfilter--arraysreduce--arraysforeach)
    - [Large `Array` iteration (chunked)](#large-array-iteration-chunked)
      - [`array.STOP` / `array.STOP(..)`](#arraystop--arraystop-1)
      - [`<array>.CHUNK_SIZE`](#arraychunk_size)
      - [`<array>.mapChunks(..)` / `<array>.filterChunks(..)` / `<array>.reduceChunks(..)`](#arraymapchunks--arrayfilterchunks--arrayreducechunks)
  - [`Map`](#map)
    - [`<map>.replaceKey(..)`](#mapreplacekey)
    - [`<map>.sort(..)`](#mapsort)
  - [`Set`](#set)
    - [`<set>.unite(..)`](#setunite)
    - [`<set>.intersect(..)`](#setintersect)
    - [`<set>.subtract(..)`](#setsubtract)
    - [`<set>.splice(..)`](#setsplice)
    - [`<set>.replace(..)`](#setreplace)
    - [`<set>.replaceAt(..)`](#setreplaceat)
    - [`<set>.sort(..)`](#setsort)
    - [`<set>.filter(..)` / `<set>.map(..)` / `<set>.forEach(..)` / `<set>.reduce(..)` / `<set>.reduceRight(..)`](#setfilter--setmap--setforeach--setreduce--setreduceright)
  - [`Date`](#date)
    - [`Date.timeStamp(..)`](#datetimestamp)
    - [`Date.fromTimeStamp(..)`](#datefromtimestamp)
    - [`Date.str2ms(..)`](#datestr2ms)
    - [`<date>.toShortDate(..)`](#datetoshortdate)
    - [`<date>.getTimeStamp(..)`](#dategettimestamp)
    - [`<date>.setTimeStamp(..)`](#datesettimestamp)
  - [`String`](#string)
    - [`<string>.capitalize()`](#stringcapitalize)
    - [`<string>.indent(..)`](#stringindent)
  - [`RegExp`](#regexp)
    - [`RegExp.quoteRegExp(..)`](#regexpquoteregexp)
  - [`Promise`](#promise)
    - [Interactive promises](#interactive-promises)
      - [`Promise.interactive(..)`](#promiseinteractive)
      - [`<promise-inter>.send(..)`](#promise-intersend)
      - [`<promise-inter>.then(..)`](#promise-interthen)
    - [Cooperative promises](#cooperative-promises)
      - [`Promise.cooperative()`](#promisecooperative)
      - [`<promise-coop>.set(..)`](#promise-coopset)
      - [`<promise-coop>.isSet`](#promise-coopisset)
      - [`<promise-coop>.then(..)`](#promise-coopthen)
    - [Promise iteration](#promise-iteration)
      - [`Promise.iter(..)` / `promise.IterablePromise(..)`](#promiseiter--promiseiterablepromise)
      - [`<promise>.iter()`](#promiseiter)
      - [`<promise-iter>.iter()`](#promise-iteriter)
      - [`<promise-iter>.map(..)` / `<promise-iter>.filter(..)` / `<promise-iter>.reduce(..)`](#promise-itermap--promise-iterfilter--promise-iterreduce)
    - [`<promise-iter>.between(..)`](#promise-iterbetween)
      - [`<promise-iter>.flat(..)`](#promise-iterflat)
      - [`<promise-iter>.reverse()`](#promise-iterreverse)
      - [`<promise-iter>.concat(..)`](#promise-iterconcat)
      - [`<promise-iter>.push(..)` / `<promise-iter>.unshift(..)`](#promise-iterpush--promise-iterunshift)
      - [`<promise-iter>.at(..)` / `<promise-iter>.first()` / `<promise-iter>.last()`](#promise-iterat--promise-iterfirst--promise-iterlast)
      - [`<promise-iter>.join(..)`](#promise-iterjoin)
      - [`<promise-iter>.some(..)` / `<promise-iter>.find(..)`](#promise-itersome--promise-iterfind)
      - [Array proxy methods returning `<promise-iter>`](#array-proxy-methods-returning-promise-iter)
      - [Array proxy methods returning a `<promise>`](#array-proxy-methods-returning-a-promise)
      - [`<promise-iter>.then(..)` / `<promise-iter>.catch(..)` / `<promise-iter>.finally(..)`](#promise-iterthen--promise-itercatch--promise-iterfinally)
      - [`promise.IterablePromise.STOP` / `promise.IterablePromise.STOP(..)`](#promiseiterablepromisestop--promiseiterablepromisestop)
      - [Advanced handler](#advanced-handler)
      - [Stopping the iteration](#stopping-the-iteration)
    - [Promise proxies](#promise-proxies)
      - [`<promise>.as(..)`](#promiseas)
      - [`<promise-proxy>.<method>(..)`](#promise-proxymethod)
    - [Promise utilities](#promise-utilities)
      - [`Promise.awaitOrRun(..)`](#promiseawaitorrun)
  - [Generator extensions and utilities](#generator-extensions-and-utilities)
    - [The basics](#the-basics)
      - [`generator.Generator`](#generatorgenerator)
      - [`generator.iter(..)`](#generatoriter)
      - [`generator.STOP`](#generatorstop)
    - [Generator instance iteration](#generator-instance-iteration)
      - [`<generator>.iter(..)`](#generatoriter-1)
      - [`<generator>.map(..)` / `<generator>.filter(..)`](#generatormap--generatorfilter)
      - [`<generator>.reduce(..)` / `<generator>.greduce(..)`](#generatorreduce--generatorgreduce)
      - [`<generator>.forEach(..)` (EXPERIMENTAL)](#generatorforeach-experimental)
      - [`<generator>.between(..)`](#generatorbetween)
      - [`<generator>.slice(..)`](#generatorslice)
      - [`<generator>.at(..)` / `<generator>.gat(..)`](#generatorat--generatorgat)
      - [`<generator>.flat(..)`](#generatorflat)
      - [`<generator>.shift()` / `<generator>.pop()` / `<generator>.gshift()` / `<generator>.gpop()`](#generatorshift--generatorpop--generatorgshift--generatorgpop)
      - [`<generator>.unshift(..)` / `<generator>.push(..)`](#generatorunshift--generatorpush)
      - [`<generator>.join(..)`](#generatorjoin)
      - [`<generator>.unwind(..)`](#generatorunwind)
      - [`<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`](#generatorthen--generatorcatch--generatorfinally)
      - [`<generator>.toArray()`](#generatortoarray)
    - [Treating iterators the same as generators](#treating-iterators-the-same-as-generators)
    - [Generator constructor iteration](#generator-constructor-iteration)
      - [`<Generator>.iter(..)`](#generatoriter-2)
      - [`<Generator>.at(..)` / `<Generator>.gat(..)`](#generatorat--generatorgat-1)
      - [`<Generator>.shift()` / `<Generator>.pop()` / `<Generator>.gshift()` / `<Generator>.gpop()`](#generatorshift--generatorpop--generatorgshift--generatorgpop-1)
      - [`<generator>.unshift(..)` / `<generator>.push(..)`](#generatorunshift--generatorpush-1)
      - [`<Generator>.slice(..)`](#generatorslice-1)
      - [`<Generator>.map(..)` / `<Generator>.filter(..)` / `<Generator>.reduce(..)` / `<Generator>.flat()`](#generatormap--generatorfilter--generatorreduce--generatorflat)
      - [`<Generator>.between(..)`](#generatorbetween-1)
      - [`<Generator>.toArray()`](#generatortoarray-1)
      - [`<Generator>.join(..)`](#generatorjoin-1)
      - [`<Generator>.unwind(..)`](#generatorunwind-1)
    - [Generator combinators](#generator-combinators)
      - [`<Generator>.chain(..)` / `<generator>.chain(..)`](#generatorchain--generatorchain)
      - [`<Generator>.concat(..)` / `<generator>.concat(..)`](#generatorconcat--generatorconcat)
    - [Generator library](#generator-library)
      - [`generator.range(..)`](#generatorrange)
      - [`generator.repeat(..)`](#generatorrepeat)
      - [`generator.produce(..)`](#generatorproduce)
    - [Generator helpers](#generator-helpers)
      - [`generator.stoppable(..)`](#generatorstoppable)
  - [Async generator extensions](#async-generator-extensions)
      - [`generator.AsyncGenerator`](#generatorasyncgenerator)
      - [`<async-generator>.unwind(..)`](#async-generatorunwind)
      - [`<async-generator>.then(..)` / `<async-generator>.catch(..)` / `<async-generator>.finally(..)`](#async-generatorthen--async-generatorcatch--async-generatorfinally)
      - [`<async-generator>.iter(..)`](#async-generatoriter)
      - [`<async-generator>.map(..)` / `<async-generator>.filter(..)` / `<async-generator>.reduce(..)`](#async-generatormap--async-generatorfilter--async-generatorreduce)
      - [`<async-generator>.chain(..)`](#async-generatorchain)
      - [`<async-generator>.flat(..)`](#async-generatorflat)
      - [`<async-generator>.concat(..)`](#async-generatorconcat)
      - [`<async-generator>.push(..)` / `<async-generator>.unshift(..)`](#async-generatorpush--async-generatorunshift)
  - [Containers](#containers)
    - [`containers.UniqueKeyMap()` (`Map`)](#containersuniquekeymap-map)
      - [`<unique-key-map>.set(..)`](#unique-key-mapset)
      - [`<unique-key-map>.reset(..)`](#unique-key-mapreset)
      - [`<unique-key-map>.rename(..)`](#unique-key-maprename)
      - [`<unique-key-map>.orderedRename(..)`](#unique-key-maporderedrename)
      - [`<unique-key-map>.unorderedRename(..)`](#unique-key-mapunorderedrename)
      - [`<unique-key-map>.keysOf(..)`](#unique-key-mapkeysof)
      - [`<unique-key-map>.originalKey(..)`](#unique-key-maporiginalkey)
      - [`<unique-key-map>.uniqueKey(..)`](#unique-key-mapuniquekey)
      - [`<unique-key-map>.__key_pattern__`](#unique-key-map__key_pattern__)
      - [`<unique-key-map>.__unordered_rename__`](#unique-key-map__unordered_rename__)
  - [Event](#event)
    - [`event.Eventfull(..)`](#eventeventfull)
    - [`event.Event(..)`](#eventevent)
    - [`event.PureEvent(..)`](#eventpureevent)
    - [`event.TRIGGER`](#eventtrigger)
    - [`event.EventHandlerMixin`](#eventeventhandlermixin)
      - [`<obj>.on(..)`](#objon)
      - [`<obj>.one(..)`](#objone)
      - [`<obj>.off(..)`](#objoff)
      - [`<obj>.trigger(..)`](#objtrigger)
    - [`event.EventDocMixin`](#eventeventdocmixin)
      - [`<obj>.eventfull`](#objeventfull)
      - [`<obj>.events`](#objevents)
    - [`event.EventMixin`](#eventeventmixin)
  - [Runner](#runner)
    - [Micro task queue](#micro-task-queue)
      - [`runner.STOP`](#runnerstop)
      - [`runner.SKIP`](#runnerskip)
      - [`Queue(..)` / `Queue.runTasks(..)`](#queue--queueruntasks)
      - [`Queue.handle(..)`](#queuehandle)
      - [`<queue>.state`](#queuestate)
      - [`<queue>.start(..)`](#queuestart)
      - [`<queue>.stop(..)`](#queuestop)
      - [`<queue>.runTask(..)`](#queueruntask)
      - [`<queue>.tasksAdded(..)` (event)](#queuetasksadded-event)
      - [`<queue>.taskStarting(..)` (event)](#queuetaskstarting-event)
      - [`<queue>.taskFailed(..)` (event)](#queuetaskfailed-event)
      - [`<queue>.taskCompleted(..)` (event)](#queuetaskcompleted-event)
      - [`<queue>.queueEmpty(..)` (event)](#queuequeueempty-event)
      - [`<queue>.prioritize(..)`](#queueprioritize)
      - [`<queue>.delay(..)`](#queuedelay)
      - [`<queue>.add(..)`](#queueadd)
      - [`<queue>.clear(..)`](#queueclear)
      - [`FinalizableQueue(..)` / `FinalizableQueue.runTasks(..)` (Queue)](#finalizablequeue--finalizablequeueruntasks-queue)
      - [`<finalizable-queue>.done(..)` (event/method)](#finalizable-queuedone-eventmethod)
      - [`<finalizable-queue>.abort(..)` (event/method)](#finalizable-queueabort-eventmethod)
      - [`<finalizable-queue>.promise(..)`](#finalizable-queuepromise)
      - [`<finalizable-queue>.then(..)`](#finalizable-queuethen)
      - [`<finalizable-queue>.catch(..)`](#finalizable-queuecatch)
    - [Large task management](#large-task-management)
      - [`runner.TaskManager(..)`](#runnertaskmanager)
      - [`<task-manager>.Task(..)`](#task-managertask)
      - [`<task-manager>.sync_start`](#task-managersync_start)
      - [`<task-manager>.record_times`](#task-managerrecord_times)
      - [`<task-manager>.titled(..)`](#task-managertitled)
      - [`<task-manager>.send(..)`](#task-managersend)
      - [`<task-manager>.stop(..)`](#task-managerstop)
      - [`<task-manager>.done(..)` (event)](#task-managerdone-event)
      - [`<task-manager>.error(..)` (event)](#task-managererror-event)
      - [`<task-manager>.tasksDone(..)` (event)](#task-managertasksdone-event)
      - [`runner.TaskTicket(..)`](#runnertaskticket)
      - [`runner.TaskMixin(..)`](#runnertaskmixin)
  - [License](#license)

## Installation

```shell
$ npm install -s 'ig-types'
```


## Basic usage

To extend everything:
```javascript
require('ig-types')
```

To have access to additional library types and utilities:
```javascript
var types = require('ig-types')
```

`types.js` is organized so as to be able to import/extend only specific 
sub-modules mostly independently so...

In case there is a need to only extend a specific constructor just import 
the module dealing with that constructor (`Array` in this case):
```javascript
// require `ig-types/<constructor-name>`...
require('ig-types/Array')
```
Note that type patching modules are _mostly_ independent.

And to import specific library modules only:
```javascript
var containers = require('ig-types/containers')
```


## `Object`

```javascript
require('ig-types/Object')
```

Note that this module imports from 
[`object.js`](https://github.com/flynx/object.js) and 
[`object-run.js`](https://github.com/flynx/object-run.js),
see those modules for more details.


### `Object.deepKeys(..)`

Get list of keys from all objects in the prototype chain.
```bnf
Object.deepKeys(<obj>)
    -> <keys>
```

This is different from `Object.keys(..)` which only gets _own_ keys from the 
current object.

Example:
```javascript
var a = { x: 123 }
var b = Object.create(a)
b.y = 321

// get own keys of b...
Object.keys(b) // -> ['y']

// get all keys accessible from b...
Object.deepKeys(b) // -> ['x', 'y']
```

For more details see:
https://github.com/flynx/object.js#deepkeys


### `Object.copy(..)` (EXPERIMENTAL)

Create a copy of `<obj>`
```bnf
Object.copy(<obj>)
    -> <obj-copy>

Object.copy(<obj>, <constructor>)
    -> <obj-copy>
```

This will:
- create a blank `<obj-copy>`
- link `<obj-copy>` to the same prototype chain
- assign all _own_ keys from `<obj>` to `<obj-copy>`

This is similar to `Object.clone(..)` but instead of creating a new descendant of 
the input object with no data this will instead create a new sibling with a copy
of the instance data.

`<constructor>` if given is called to create the instance to be populated, 
otherwise `Object.create(<obj>)` is used.

Note that `.assign(..)` is used to copy data, thus properties will be copied as values, to copy instance properties use `object.js`'s 
[`.mixinFlat(..)`](https://github.com/flynx/object.js#mixinflat).

Note that this will make no attempt to clone object type, a `<constructor>` 
should be passed manually if any instance type other that `Object` is required.


### `Object.flatCopy(..)`

Copy all attributes from the prototype chain of `<obj>` into `<new-obj>`.
```bnf
Object.flatCopy(<obj>)
    -> <new-obj>

Object.flatCopy(<obj>, <constructor>)
    -> <new-obj>
```

This is different to [`.copy(..)`](#objectcopy-experimental) in that if 
no `<constructor>` is given `<new-obj>` will _not_ be linked into the 
prototype chain of `<obj>`, if this behavior is desired use `o => Object.create(o)`
as the `<constructor>`.


### `Object.match(..)`

Attribute/value match two objects (non-recursive).
```bnf
Object.match(<object>, <other>)
    -> <bool>
```

Objects `A` and `B` match iff:
- `A` and `B` are _identical_, i.e. `A === B`

or
- `typeof A == typeof B` _and_,
- `A` and `B` have the same number of attributes _and_,
- attribute names match _and_,
- attribute values are _identical_.

And for a less strict match:
```bnf
Object.match(<object>, <other>, true)
    -> <bool>
```
Like the default case but uses _equality_ instead of _identity_ to match values.


For more details see:
https://github.com/flynx/object.js#match

<!-- 
XXX should this test based on equality or on identity by default??? 
    ...see: Array.cmp(..)
-->


### `Object.matchPartial(..)`

```bnf
Object.matchPartial(<object>, <other>)
    -> <bool>

Object.matchPartial(<object>, <other>, true)
    -> <bool>
```
Like `.match(..)` but will check for a _partial_ match, i.e. when `<other>` is a non-strict subset of `<object>`.

For more details see:
https://github.com/flynx/object.js#matchpartial

<!-- 
XXX should this test based on equality or on identity by default??? 
    ...see: Array.cmp(..)
-->


### `<object>.run(..)`

```bnf
<object>.run(<func>)
    -> <object>
    -> <other>
```

Run a function in the context of `<object>` returning either `<object>` 
itself (if returning `undefined`) or the result.

Note that this is accessible from all JavaScript non-primitive objects, 
i.e. everything that inherits from `Object`.

Example:
```javascript
var L = [1, 2, 3]
    .map(function(e){
        return e * 2 })
    // see if the first element is 1 and prepend 1 if it is not...
    .run(function(){
        if(this[0] != 1){
            this.unshift(1) } })

console.log(L) // -> [1, 2, 6, 8]
```

`.run(..)` is also available standalone via:

```shell
$ npm install -s object-run
```

For more details see:  
https://github.com/flynx/object-run.js


### `Object.sort(..)`

Sort `<obj>` attributes (similar to `Array`'s `.sort(..)`)
```bnf
Object.sort(<obj>)
    -> <obj>
```

Sort `<obj>` attributes via `<cmp>` function.
```
Object.sort(<obj>, <cmp>)
    -> <obj>
```

Sort `<obj>` attributes to the same order of `<order-list>`.
```bnf
Object.sort(<obj>, <order-list>)
    -> <obj>
```

Note that this rewrites all the keys of `<obj>` thus for very large
sets of keys/attributes this may be quite expensive.

Note that some keys of `Object` may misbehave in JavaScript, currently keys
that are string values of numbers are sorted automatically by _number value_
and are not affected by `.sort(..)`, this affects both _Chrome_ and _Firefox_.

Example:
```javascript
var o = {x: 0, a: 1, '100':2, '0':3, ' 27 ':4, b:5}

// notice that the order is already different to the order of attributes above...
Object.keys(o) 
//    -> ['0', '100', 'x', 'a', ' 27 ', 'b']

// '0' and '100' are not affected by .sort(..) while ' 27 ' is...
Object.keys(Object.sort(o, ['x', 'a', '100'])) 
//    -> [ '0', '100', 'x', 'a', ' 27 ', 'b' ]
```

This is similar to [`<map>.sort(..)`](#mapsort) and [`<ser>.sort(..)`](#setsort).


## `Function`

```javascript
var func = require('ig-types/Function')
```

### `func.AsyncFunction`

The async function constructor.

This enables us to test if an object is an instance of an async function. 

```javascript
var a = async function(){
    // ...
}

a instanceof func.AsyncFunction // -> true
```

This is hidden by JavaScript by default.



## `Array`

```javascript
require('ig-types/Array')
```
or
```javascript
var array = require('ig-types/Array')
```

### `<array>.first(..)` / `<array>.last(..)`

Get the first/last items of `<array>`.
```bnf
<array>.first()
    -> <item>

<array>.last()
    -> <item>
```

Set the first/last items of `<array>`.
```bnf
<array>.first(<item>)
  -> <array>

<array>.last(<item>)
  -> <array>
```

Note that these do not affect `<array>` length unless setting items on 
an empty `<array>`.


### `<array>.rol(..)`

Roll `<array>` in-place left.
```bnf
<array>.rol()
<array>.rol(1)
    -> <array>

<array>.rol(n)
    -> <array>
```

To roll _right_ pass a negative `n` to `.rol(..)`.


### `<array>.compact()`

```bnf
<array>.compact()
    -> <compact-array>
```

Generate a compact `<array>` from a sparse `<array>`, i.e. removing all
the empty slots.


### `<array>.len`

Number of non-empty slots/elements in `<array>`.

This is similar to:
```javascript
var L = [,,, 1,, 2, 3,,]

// this is the same as L.len...
L.compact().length 
```

Note that this is different from `.length` in that writing to `.len` has
no effect.


### `<array>.unique()` / `<array>.tailUnique()`

Generate an array with all duplicate elements removed.
```bnf
<array>.unique()
    -> <array>

<array>.tailUnique()
    -> <array>
```

The difference between the two versions is in that `.unique(..)` keeps the 
first occurrence of a value while `.tailUnique(..)` keeps the last.


### `<array>.trim()` / `<array>.trimStart()` / `<array>.trimEnd()`

Copy array removing empty slots from array start, end or both.
```bnf
<array>.trim()
    -> <array>

<array>.trimStart()
    -> <array>
    
<array>.trimEnd()
    -> <array>
```

This is similar to `String`'s equivalent methods but removing _empty_ slots 
instead of spaces.


### `<array>.cmp(..)`

Compare two arrays.
```bnf
<array>.cmp(<other>)
    -> <bool>
```

This will return `true` if:
- `<array> === <other>` 

or
- lengths are the same and,
- values on the same positions are equal.

<!-- 
XXX should this test based on equality or on identity by default??? 
    ...see: Object.match(..)
-->


### `<array>.setCmp(..)`

Compare to arrays ignoring element order and count.
```bnf
<array>.setCmp(<other>)
    -> <bool>
```


### `<array>.sortAs(..)`

Sort array as a different array.
```bnf
<array>.sortAs(<other>)
<array>.sortAs(<other>, 'head')
    -> <array>

<array>.sortAs(<other>, 'tail')
    -> <array>
```

Elements not present in `<other>` retain their relative order and are
placed after the sorted elements if `'head'` (i.e. _"sorted at head of 
array"_) is passed as second argument (default) and before them if 
`'tail'` (_"sorted at tail"_) is passed.

Example:
```javascript
var L = [1, 2, 3, 4, 5, 6]
var O = [5, 3, 1, 0]

L.sortAs(O) // -> [5, 3, 1, 2, 4, 6]
```


### `<array>.inplaceSortAs(..)`

Sort array as a different array keeping positions of unsorted elements.
```bnf
<array>.inplaceSortAs(<other>)
    -> <array>
```

Example:
```javascript
var L = [1, 2, 3, 4, 5, 6]
var O = [5, 3, 1, 0]

L.inplaceSortAs(O) // -> [5, 2, 3, 4, 1, 6]
```

### `<array>.toKeys(..)`

Create an object with array values as keys and index as value.
```bnf
<array>.toKeys()
    -> <object>
```

Normalize resulting `<object>` keys:
```bnf
<array>.toKeys(<normalize>)
    -> <object>

<normalize>(<elem>, <index>)
    -> <key>
```

If `<array>` contains the same value multiple times it will be written 
to `<object>` only once with the last occurrences' index.

Since `object` keys can only be `string`s array items that are not
strings will be converted to strings. If this is not desired use `.toMap(..)`
instead.


### `<array>.toMap(..)`

Create a map with array values as keys and index as value.
```bnf
<array>.toMap()
    -> <map>
```

Normalize resulting `<map>` keys:
```bnf
<array>.toMap(<normalize>)
    -> <map>

<normalize>(<elem>, <index>)
    -> <key>
```

Note that if `<array>` contains the same value multiple times it will be used 
as key only once and retain the last occurrences' index.


### `Array.zip(..)` / `<array>.zip(..)`

_Zip_ input array items.
```bnf
Array.zip(<array>, <array>, ..)
    -> <array>

<array>.zip(<array>, <array>, ..)
    -> <array>
```

Example:
```javascript
var A = [1, 2, 3]
var B = ['a', 'b', 'c', 'd']

Array.zip(A, B) // -> [[1, 'a'], [2, 'b'], [3, 'c'], [, 'd']]
```

Array _sparseness_ is retained -- if one of the arrays has an empty slot, or is 
not long enough, the corresponding spot in the result will be empty.

Resulting array length is strictly equal to the longest input array length.


### `Array.iter(..)` / `<array>.iter()`

Return an iterator/generator from the current array.

This is mostly useful in combination with the [Generator extensions and utilities](#generator-extensions-and-utilities)


### `<array>.between(..)`

```bnf
<array>.between(<value>)
    -> <array>
<array>.between(<func>)
    -> <array>

<func>([<pre>, <post>], <index-in>, <index-out>, <array>)
    -> <value>
```


### Abortable `Array` iteration

A an alternative to `Array`'s `.map(..)` / `.filter(..)` / .. methods with ability to
stop the iteration process by `throw`ing `STOP` or `STOP(<value>)`.

```javascript
var {STOP} = require('ig-types/Array')
```

This can be used in two ways:

1) `throw` as-is to simply stop...
    ```javascript
    ;[1,2,3,4,5]
        .smap(function(e){ 
            // simply abort here and now...
            throw STOP })
    ```
    Since we aborted the iteration without passing any arguments to `STOP`,
    `.smap(..)` will return `undefined`.

2) `throw` an instance and return the argument...
    ```javascript
    // this will print "4" -- the value passed to STOP...
    console.log([1,2,3,4,5]
        .smap(function(e){ 
            if(e > 3){
              // NOTE: new is optional here...
              //    ...StopIteratiom is an object.js constructor.
              throw new STOP(e) } }))
    ```

Note that no partial result is returned unless passed through `STOP(..)`.


#### `array.STOP` / `array.STOP(..)`

An _object/constructor_ that if raised (as an exception) while iterating via 
a supporting iterator method will abort further execution and correctly exit.


#### `<array>.smap(..)` / `<array>.sfilter(..)` / `<array>.sreduce(..)` / `<array>.sforEach(..)`

Like `Array`'s `.map(..)`, `.filter(..)`, `.reduce(..)` and `.forEach(..)` but 
with added support for aborting iteration by throwing `STOP` or `STOP(<value>)`.


### Large `Array` iteration (chunked)

Iterating over very large `Array` instances in JavaScript can block execution,
to avoid this `types.js` implements `.map(..)`/`.filter(..)`/`.reduce(..)`
equivalent methods that iterate the array in chunks and do it asynchronously 
giving the runtime a chance to run in between.

In the simplest cases these are almost a drop-in replacements for the equivalent
methods but return a promise.
```javascript
var a = [1,2,3,4,5]
    .map(function(e){ 
        return e*2 })

var b
;[1,2,3,4,5]
    .mapChunks(function(e){ 
        return e*2 })
    .then(function(res){
        b = res })

// or with await...
var c = await [1,2,3,4,5]
    .mapChunks(function(e){ 
        return e*2 })
```

These support setting the chunk size (default: `50`) as the first argument:
```javascript
var c = await [1,2,3,4,5]
    .mapChunks(2, function(e){ 
        return e*2 })
```

#### `array.STOP` / `array.STOP(..)`

Like for [`<array>.smap(..)` and friends](#abortable-array-iteration) iteration 
can be stopped by throwing a `array.STOP` / `array.STOP(<value>)` and as before 
there are two ways to go:

1) `throw` as-is to simply stop
    ```javascript
    ;[1,2,3,4,5]
        .mapChunks(function(e){ 
            // simply abort here and now...
            throw STOP })
        .catch(function(){
            console.log('done.') })
    ```

2) `Throw` an instance and pass a value to `.catch(..)`
   ```javascript
    ;[1,2,3,4,5]
        .mapChunks(function(e){ 
            if(e > 3){
              // NOTE: new is optional here...
              //    ...StopIteratiom is an object.js constructor.
              throw new STOP(e) } })
        .catch(function(e){
            console.log('first value greater than 3:', e) })
   ```


#### `<array>.CHUNK_SIZE`

The default iteration chunk size.

Note that the smaller this is the more _responsive_ the code is, especially 
in UI applications but there is a small overhead added per chunk.

Default value: `50`


#### `<array>.mapChunks(..)` / `<array>.filterChunks(..)` / `<array>.reduceChunks(..)`

The `.map(..)`, `.filter(..)` and `.reduce(..)` alternatives respectively:
```bnf
<array>.mapChunks(<func>)
<array>.mapChunks(<chunk-size>, <func>)
  -> <promise>

<func>(<item>, <index>, <array>)
  -> <new-item>
```

```bnf
<array>.filterChunks(<func>)
<array>.filterChunks(<chunk-size>, <func>)
  -> <promise>

<func>(<item>, <index>, <array>)
  -> <bool>
```

```bnf
<array>.reduceChunks(<func>, <state>)
<array>.mreduceChunks(<chunk-size>, <func>, <state>)
  -> <promise>

<func>(<state>, <item>, <index>, <array>)
  -> <state>
```
<!-- XXX Example -->



All three support chunk handlers in the same way (illustrated on `.mapChunks(..)`):
```bnf
<array>.mapChunks([<func>, <chunk-handler>])
<array>.mapChunks(<chunk-size>, [<func>, <chunk-handler>])
  -> <promise>

<func>(<item>, <index>, <array>)
  -> <new-item>

<chunk-handler>(<chunk>, <result>, <offset>)
```

The `<chunk-handler>` gets the completed chunk of data after it is computed 
but before the timeout.

<!-- XXX Example -->



## `Map`

```javascript
require('ig-types/Map')
```


### `<map>.replaceKey(..)`

Replace key in map retaining item order
```bnf
<map>.replaceKey(<old>, <new>)
<map>.replaceKey(<old>, <new>, true)
    -> <map>
```

Replace the key without sorting
```bnf
<map>.replaceKey(<old>, <new>, false)
    -> <map>
```

Note that when sorting large maps this can get expensive.



### `<map>.sort(..)`

Sort `<map>` keys in-place
```bnf
<map>.sort()
    -> <map>

<map>.sort(<cmp>)
    -> <map>
```

In the general case this is similar to 
[`<array>.sort(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 
with the addition of the [`<array>.sortAs(..)`](#arraysortas)'s ability to sort 
as a list
```bnf
<map>.sort(<sorted-keys>)
    -> <map>
```

This is similar to [`<set>.sort(..)`](#setsort) and [`Object.sort(..)`](#objectsort), 
see the later for more info.


## `Set`

```javascript
require('ig-types/Set')
```


### `<set>.unite(..)`

Unite two sets and return the resulting set
```bnf
<set>.unite(<other>)
    -> <union-set>
```

This is a shorthand for `new Set([...<set>, ...<other>])`


### `<set>.intersect(..)`

Intersect two sets and return the intersection set
```bnf
<set>.untersect(<other>)
    -> <intersection-set>
```


### `<set>.subtract(..)`

Subtract `<other>` from set and return resulting set
```bnf
<set>.subtract(<other>)
    -> <sub-set>
```


### `<set>.splice(..)`

In-place splice a set
```bnf
<set>.splice(<from>)
<set>.splice(<from>, <count>)
<set>.splice(<from>, <count>, ...<items>)
    -> <removed>
```

This is the same as 
[`<array>.splice(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) 
but without the ability to add more than one instance of an item.


### `<set>.replace(..)`

Replace value in set with other value retaining item order (in-place)
```bnf
<set>.replace(<old>, <new>)
<set>.replace(<old>, <new>, true)
    -> <set>
```

Replace the value without sorting
```bnf
<set>.replace(<old>, <new>, false)
    -> <set>
```

Note that when sorting large sets this can get expensive.


### `<set>.replaceAt(..)`

Replace item at position in set retaining order (in-place)
```bnf
<set>.replaceAt(<index>, <new>)
<set>.replaceAt(<index>, <new>, true)
    -> <set>
```

If `<index>` is less than `0` the `<new>` item will be prepended to `<set>`,
if the `<index>` is greater than or equal to `<set>.size` then `<new>` is 
appended.

Replace the value at index without sorting
```bnf
<set>.replaceAt(<index>, <new>, false)
    -> <set>
```

Here, if `<index>` is less than `0` or greater than or equal to `<set>.size`
`<new>` will always be appended to `<set>`.

Note that when sorting large sets this can get expensive.


### `<set>.sort(..)`

Sort `<set>` (in-place)
```bnf
<set>.sort()
    -> <set>

<set>.sort(<cmp>)
    -> <set>
```

In the general case this is similar to 
[`<array>.sort(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 
with the addition of the [`<array>.sortAs(..)`](#arraysortas)'s ability to sort 
as a list
```bnf
<set>.sort(<sorted-values>)
    -> <set>
```

This is similar to [`<map>.sort(..)`](#mapsort) and [`Object.sort(..)`](#objectsort),
see the later for more info.


### `<set>.filter(..)` / `<set>.map(..)` / `<set>.forEach(..)` / `<set>.reduce(..)` / `<set>.reduceRight(..)`

For more info see corresponding stoppable methods in 
[`Array`'s section](#arraysmap--arraysfilter--arraysreduce--arraysforeach).



## `Date`

```javascript
require('ig-types/Date')
```


### `Date.timeStamp(..)`

Generate a timestamp (format: `'YYYYMMDDHHMMSS'`)
```bnf
Date.timeStamp()
    -> <timestamp>
```

Generate a full timestamp, including milliseconds (format: `'YYYYMMDDHHMMSSmmm'`)
```bnf
Date.timeStamp(true)
    -> <timestamp>
```

This is a shorthand to: [`(new Date()).getTimeStamp(..)`](#dategettimestamp)

The timestamp is generated from the time of call, for generating timestamps form specific `<date>` objects see:
[`<date>.getTimeStamp(..)`](#dategettimestamp)


### `Date.fromTimeStamp(..)`

Create a `<date>` from a timestamp
```bnf
Date.fromTimeStamp(<timestamp>)
    -> <date>
```

This is a shorthand to: [`(new Date()).setTimeStamp(<timestamp>)`](#datesettimestamp)


### `Date.str2ms(..)`

Convert a string describing a time period into milliseconds.
```bnf
Date.str2ms(<str>)
    -> <number>
```

Examples:
```javascript
// time units (d/h/m/s/ms) and their variants...
var a = Date.str2ms('3 seconds') // -> 3000

var b = Date.str2ms('0.1h') // -> 360000

// time period (DD:HH:MM:SS:mmm)...
var c = Date.str2ms('00:20:001') // -> 20001
var d = Date.str2ms('1:3') // -> 63000
```

Note that time periods are seconds-based by default unless it contains three 
digits then it defaults to milliseconds:
```javascript
// least significant unit is seconds by default...
var e = Date.str2ms(':3') // -> 3000

// when the least significant unit contains 3 digits it is read as ms...
var f = Date.str2ms(':030') // -> 30
```


Supported formats:
```bnf
<str> ::=
    <milliseconds>
    | <seconds>
    | <minutes>
    | <hours>
    | <days>
    | <period>

<milliseconds> ::=
    <number>
    | <number>ms
    | <number>m[illi][-]s[ec[ond[s]]]

<seconds> ::=
    <number>s
    | <number>s[ec[ond[s]]]

<seconds> ::=
    <number>m
    | <number>m[in[ute[s]]]

<seconds> ::=
    <number>h
    | <number>h[our[s]]
    
<seconds> ::=
    <number>d
    | <number>d[ay[s]]

<period> ::= 
    [[[DD:]HH:]MM]:SS[:mmm]
    | [[[[DD:]HH:]MM]:SS]:mmm
```


### `<date>.toShortDate(..)`

Generate a short date string from `<date>` 
(format: `'YYYY-MM-DD HH:MM:SS'`)
```bnf
<date>.toShortDate()
    -> <short-date>
```

Generate a short date string including milliseconds from `<date>` 
(format: `'YYYY-MM-DD HH:MM:SS:mmm'`)
```bnf
<date>.toShortDate(true)
    -> <short-date>
```

Note that `<short-date>` is directly parseable by `new Date(..)`
```javascript
var a = (new Date()).toShortDate(true)

// parse the <short-date> and generate a new short date from it...
var b = (new Date(a)).toShortDate(true)

a == b // -> true
```


### `<date>.getTimeStamp(..)`

Generate a timestamp from `<date>`
(format `'YYYYMMDDHHMMSS'`)
```bnf
<date>.getTimeStamp()
    -> <timestamp>
```

Generate a timestamp from `<date>` including milliseconds 
(format `'YYYYMMDDHHMMSSmmm'`)
```bnf
<date>.getTimeStamp(true)
    -> <timestamp>
```


### `<date>.setTimeStamp(..)`

Update a `<date>` from a timestamp
```bnf
<date>.setTimeStamp(<timestamp>)
    -> <date>
```


## `String`

```javascript
require('ig-types/String')
```

### `<string>.capitalize()`

Capitalize the first character of a string
```bnf
<string>.capitalize()
    -> <string>
```


### `<string>.indent(..)`

Indent each line in `<string>` by `<size>` spaces
```bnf
<string>.indent(<size>)
    -> <string>
```

Indent/prepend each line in `<string>` by the `<prefix>` string
```bnf
<string>.indent(<prefix>)
    -> <string>
```


## `RegExp`

```javascript
require('ig-types/RegExp')
```


### `RegExp.quoteRegExp(..)`

Quote regexp reserved characters in a string
```bnf
RegExp.quoteRegExp(<str>)
    -> <str>
```

This is mainly used to quote strings to be matched as-is within a regular expression.



## `Promise`

```javascript
require('ig-types/Promise')
```
or
```javascript
var promise = require('ig-types/Promise')
```


### Interactive promises

_Interactive promises_ can be sent messages and then handle them.


```javascript
var printer = Promise.interactive(function(resolve, reject, onmessage){
    var buf = []
    var state = 'pending'
    onmessage(function(type, ...args){
        type == 'flush' ?
            (buf = buf
                .filter(function([type, state, ...args]){
                    console[type](`(${ state }):`, ...args) }))
        : type == 'close' ?
            (resolve(...args), 
                state = 'resolved')
        : buf.push([type, state, ...args]) }) })

printer
    .send('log', 'some message...')
    .send('warn', 'some warning...')
    .send('flush')
    .send('close')
```

Note that message handling is independent of promise state, so in the above case 
we can still populate the buffer and _flush_ it even if the promise is resolved
```javascript
printer
    .send('log', 'some other message...')
    .send('flush')
```

If the user wants to handle messages differently (ignore for example) after the
promise is finalized it is their responsibility 
(see: [`<onmessage>(..)`](#promiseinteractive) for more info)



#### `Promise.interactive(..)`

Create and interactive promise
```bnf
Promise.interactive(<handler>)
    -> <promise-inter>
```

The `<handler>` accepts one additional argument, compared to the `Promise(..)`
handler, `<onmessage>`, used to register message handlers.
```bnf
<handler>(<resolve>, <reject>, <onmessage>)

<onmessage>(<message-handler>)
```

Remove `<message-handler>`
```bnf
<onmessage>(<message-handler>, false)
```

Remove all handlers
```bnf
<onmessage>(false)
```

`<message-handler>` is called when a message is sent via 
[`<promise-inter>.send()`](#promise-intersend).


#### `<promise-inter>.send(..)`

Send a message to an interactive promise
```bnf
<promise-inter>.send()
<promise-inter>.send(...)
    -> <promise-inter>
```

Sending a message triggers message handlers registered via `<onmessage>(..)` 
passing each handler the arguments.


#### `<promise-inter>.then(..)`

Extended `.then(..)` implementation.

See [`<promise-iter>.then(..)`](#promise-iterthen--promise-itercatch--promise-iterfinally) for details.



### Cooperative promises

A _cooperative promise_ is one that can be finalized externally/cooperatively.

This can be useful for breaking recursive dependencies between promises or when
it is simpler to thread the result receiver promise down the stack than building 
a promise stack and manually threading the result up.

Example:
```javascript
// NOTE: implementing this via Promise.any(..) would also require implementing a 
//      way to stop the "workers" after the result is found...
async function controller(trigger){
    while(!trigger.isSet)

        // do things...

        trigger.isSet
            || trigger.set(result) } }

async function controlled(trigger){

    // do things independently of trigger...

    trigger
        .then(function(){
            // do things after trigger...
        }) }


var t = Promise.cooperative()

// multiple cooperative controllers competing to create a result...
controller(t)
controller(t)
controller(t)
// ...

// prepare and process result...
// NOTE: calling .then() here is completely optional and done out of role
//      hygene -- isolating cooperative API from the client...
controlled(t.then())
// ...
```

Note that this functionally can be considered a special-case of an 
[interactive promise](#interactive-promises), but in reality they are two 
different implementations, the main differences are:
- _Cooperative promise_ constructor does not need a resolver function,
- _Cooperative promises_ do not the implement `.send(..)` API.

Note that implementing _Cooperative promises_ on top of _Interactive promises_ 
cleanly, though feeling more _"beautiful"_, would be more complex than the 
current standalone implementation, as it would require both implementing 
the `.set(..)` API/logic _and_ active encapsulation of the message API.



#### `Promise.cooperative()`

Create a cooperative promise
```bnf
Promise.cooperative()
    -> <promise-coop>
```


#### `<promise-coop>.set(..)`

Resolve `<promise-coop>` with `<value>`
```bnf
<promise-coop>.set(<value>)
<promise-coop>.set(<value>, true)
    -> <promise-coop>
```

If `<value>` is a promise, then `<promise-coop>` will be bound to its state, i.e.
resolved if `<value>` is resolved and rejected if it is rejected with the same
values.

Reject `<promise-coop>` with `<value>`
```bnf
<promise-coop>.set(<value>, false)
    -> <promise-coop>
```

Calling `.set(..)` will set `.isSet` to `true`.


#### `<promise-coop>.isSet`

Property representing if the cooperative promise was _set_ / `.set(..)` was 
called (value is `true`) or no (`false`).

This property is read-only.


#### `<promise-coop>.then(..)`

Extended `.then(..)` implementation.

See [`<promise-iter>.then(..)`](#promise-iterthen--promise-itercatch--promise-iterfinally) for details.



### Promise iteration

An _iterable promise_ is on one hand very similar to `Promise.all(..)` in that it
generally takes a list of values each could be either an explicit value or a 
promise, and it is similar to a _generator_ in that it allows iteration over the 
contained values and chaining of operations but unlike `Promise.all(..)` this 
iteration occurs depth-first instead of breadth first.

One can think of _promise iterators_ vs. _generators_ as the former being 
internally controlled and asynchronous while the later being externally
controlled and synchronous.

Here is a traditional example using `Promise.all(..)`:
```javascript
var p = Promise.all([ .. ])
    // this will not execute until ALL the inputs resolve...
    .then(function(lst){
        return lst
          .filter(function(e){
              // ...
          })
          // this will not run until ALL of lst is filtered...
          .map(function(e){
              // ...
          }) })
```

And a _promise iterator_:
```javascript
var p = Promise.iter([ .. ])
    // each element is processed as soon as it is ready disregarding of its order
    // in the input array...
    .filter(function(e){
        // ...
    })
    // items reach here as soon as they are returned by the filter stage handler...
    .map(function(e){
        // ...
    })
    // .then(..) explicitly waits for the whole list of inputs to resolve...
    .then(function(lst){
        // ...
    })
```

This approach has a number of advantages:
- items are processed as soon as they are available without waiting for the 
  slowest promise on each level to resolve
- simpler and more intuitive code

And some disadvantages:
- item indexes are unknowable until all the promises resolve.

Calling each of the `<promise-iter>` methods will return a new and unresolved 
promise, even if the original is resolved.

If all values are resolved the `<promise-iter>` will resolve on the next 
execution frame.

There are two types of iterator methods here, both are transparent but different
in how they process values:
- *Parallel methods*  
  These handle elements as soon as they are available even if the parent promise
  is not yet resolved.
  <!-- XXX list -->
- *Proxies*
  These methods simply wait for the main promise to resolve and then call the
  appropriate method on the result.
  <!-- XXX list + mark definitions as "(proxy)" -->

Promise iterators directly support _for-await-of_ iteration:

```javascript
for await (var elem of Promise.iter(/* ... */)){
    // ...
}
```

<!-- 
XXX should we support generators as input?
    ...not sure about the control flow direction here, on one hand the generator
    should be unwound by the client (not sure how to do this within a promise) on 
    the other hand...
    ...not sure if it is possible/correct to control the flow upstream in a 
    promise chain...
    ...might be a good idea to at least provide some means to control flow up
    the chain, for instance to abort execution...
XXX should we support infinite generators as input?
-->


#### `Promise.iter(..)` / `promise.IterablePromise(..)`

Create an _iterable promise_

```bnf
Promise.iter(<array>)
Promise.iter(<promise>)
    -> <promise-iter>
```

#### `<promise>.iter()`

Wrap a promise in an promise iterator. 

```bnf
<promise>.iter()
    -> <promise-iter>
```

If `<promise>` resolves to a non-array value it will be treated as a single 
element, otherwise the array will be iterated over.


#### `<promise-iter>.iter()`

Return a shallow copy of the current promise iterator.

```bnf
<promise-iter>.iter()
    -> <promise-iter>
```


#### `<promise-iter>.map(..)` / `<promise-iter>.filter(..)` / `<promise-iter>.reduce(..)`

Methods similar but not fully equivalent to `Array`'s 
[`.map(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), 
[`.filter(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
and [`.reduce(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
```bnf
<promise-iter>.map(<handler>)
    -> <promise-iter>

<handler>(<elem>)
    -> <elem>
```

```bnf
<promise-iter>.filter(<handler>)
    -> <promise-iter>

<handler>(<elem>)
    -> <bool>
```

```bnf
<promise-iter>.reduce(<handler>, <state>)
    -> <promise>

<handler>(<state>, <elem>)
    -> <state>
```

Note that these are different to `Array`'s equivalents in some details: 
- `<handler>` is _not_ called in the order of element occurrence but rather 
    in the order of elements are resolved/ready.
- `<handler>` does not get either the element _index_ or the _container_.  
    this is because in _out-of-order_ and _depth-first_ execution the 
    index is _unknowable_ and the container is a promise/black-box.

This is especially critical for `.reduce(..)` as the iteration in an order
different from the order of elements _can_ affect actual result if this is 
not expected.

`.reduce(..)` is also a bit different here in that it will return a basic 
`<promise>` rather than an iterable promise object as we can't know what 
will it will reduce to.

Note that since `.reduce(..)` handler's execution order can not be known,
there is no point in implementing `.reduceRigth(..)`.


### `<promise-iter>.between(..)`

```bnf
<promise-iter>.between(<value>)
    -> <promise-iter>
<promise-iter>.between(<func>)
    -> <promise-iter>

<func>([<pre>, <post>], <index-in>, <index-out>, <promise-iter>)
    -> <value>
```


#### `<promise-iter>.flat(..)`

```bnf
<promise-iter>.flat()
<promise-iter>.flat(<depth>)
    -> <promise-iter>
```

This is similar to [`<array>.flat(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) see it for more info.


#### `<promise-iter>.reverse()`

```bnf
<promise-iter>.reverse()
    -> <promise-iter>
```

This is deferent from `<array>.reverse()` in that it will _not_ reverse in-place, 
but rather a _reversed copy_ will be created.

This is similar to [`<array>.reverse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) see it for more info.


#### `<promise-iter>.concat(..)`

```bnf
<promise-iter>.concat(<other>)
    -> <promise-iter>
```

This is similar to [`<array>.concat(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) see it for more info.


#### `<promise-iter>.push(..)` / `<promise-iter>.unshift(..)`

```bnf
<promise-iter>.push(<elem>)
    -> <promise-iter>

<promise-iter>.unshift(<elem>)
    -> <promise-iter>
```

These are similar to [`<array>.push(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 
and [`<array>.unshift(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) 
see them for more info.


#### `<promise-iter>.at(..)` / `<promise-iter>.first()` / `<promise-iter>.last()`

Proxies to the appropriate array methods with a special-case: when getting elements 
at positions `0` or `-1` (i.e. `.first()` / `.last()`) these _can_ resolve before the
parent `<promise-iter>`.

XXX


#### `<promise-iter>.join(..)`

XXX


#### `<promise-iter>.some(..)` / `<promise-iter>.find(..)`

```bnf
<promise-iter>.some(<func>)
    -> <promise>

<promise-iter>.find(<func>)
    -> <promise>
```

The main difference between `.some(..)` and `.find(..)` is in that the `<promise>`
returned from the former will resolve to either `true` or `false`, and in the later
to the found value or `undefined`.

`.find(..)` supports an additional argument that controls what returned `<promise>`
is resolved to...

```bnf
<promise-iter>.find(<func>)
<promise-iter>.find(<func>, 'value')
    -> <promise>

<promise-iter>.find(<func>, 'bool')
    -> <promise>

<promise-iter>.find(<func>, 'result')
    -> <promise>
```

- `value` (default)  
  resolve to the stored value if found and `undefined` otherwise.
- `bool`  
  resolve to `true` if the value is found and `false` otherwise, this is how 
  `.some(..)` is impelemnted.
- `result`  
  resolve to the return value of the test `<func>`.

These are similar to [`<array>.some(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 
and [`<array>.find(..)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 
see them for more info.

#### Array proxy methods returning `<promise-iter>`

- `<promise-iter>.sort(..)`
- `<promise-iter>.slice(..)`
- `<promise-iter>.entries()` / `<promise-iter>.keys()` / `<promise-iter>.values()` 

These methods are proxies to the appropriate array methods.

```bnf
<promise-iter>.<method>(..)
    -> <promise-iter>
```

These methods need the parent `<promise-iter>` to resolve before resolving themselves.

XXX links...


#### Array proxy methods returning a `<promise>`

- `<promise-iter>.indexOf(..)` 
- `<promise-iter>.includes(..)` 
- `<promise-iter>.every(..)`
- `<promise-iter>.findIndex(..)`

These methods are proxies to the appropriate array methods.

```bnf
<promise-iter>.<method>(..)
    -> <promise>
```

These methods need the parent `<promise-iter>` to resolve before resolving themselves.

Since the equivalent array methods do not return iterables these will return a basic
(non-iterable) `<promise>`.

XXX links...


#### `<promise-iter>.then(..)` / `<promise-iter>.catch(..)` / `<promise-iter>.finally(..)`

An extension to
[`<promise>.then(..)` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
this adds the ability to pass no arguments
```bnf
<promise-iter>.then()
    -> <promise>
```

This will return a generic promise wrapper passing through the results as-is. This 
can be useful to hide the extended promise API from further code.

#### `promise.IterablePromise.STOP` / `promise.IterablePromise.STOP(..)`

A special object that when thrown from a function/promise handler will stop 
further iteration.

This is `undefined` until the `ig-types/Array` module is loaded.

For more info see: [Stopping the iteration](#stopping-the-iteration) below, and
[the 'Array' STOP section](#arraystop--arraystop)


#### Advanced handler

```bnf
Promise.iter(<block>, <handler>)
    -> <iterable-promise>
```

The `<handler>` will get passed each resolved `<value>` of the input `<block>` 
as soon as it's available/resolved.

The `<handler>` return value is unwrapped into the resulting array, allowing
each call to both remove elements (i.e. returning `[]`) from the resulting 
`<block>` as well as insert multiple items (by returning an array of items).

<!-- XXX returning promises from handler needs to be documented/tested... -->

```bnf
<handler>(<value>)
    -> []
    -> [ <elem>, .. ]
    -> <non-array>
```

```bnf
<block> ::= 
    []
    | [ <elem>, .. ]

<elem> ::= 
    <value>
    | <promise>(<value>)
```

Example:
```javascript
var p = Promise.iter(
        [1, 2, 3, Promise.resolve(4), [5, 6]], 
        function(elem){
            // duplicate even numbers...
            return elem % 2 == 0 ?
                    [elem, elem]
                // return arrays as-is...
                : elem instanceof Array ?
                    [elem]
                // remove other elements...
                : [] })
    .then(function(lst){
        console.log(lst) }) // -> [2, 2, 4, 4, [5, 6]]
```

#### Stopping the iteration

Like the [`Array`](#arraystop--arraystop) module, this support throwing `STOP` to 
stop iteration. As we uses [`.smap(..)`](#arraysmap--arraysfilter--arraysreduce--arraysforeach) 
stopping support is supported if `ig-types/Array` module is loaded.

```javascript
require('ig-types/Array')
```

This is also different semantically, as promise iteration can happen out of order,
stopping affects the order of processing and not order of the input array with one exception: promises already created can not be stopped in `JavaScript`.

Any handler function passed to a `<promise-iter>` method can `throw` a STOP.

For more details see: [the 'Array' STOP section](#arraystop--arraystop)



### Promise proxies

_Promise proxies_ generate a set of prototype methods returning promises that when the parent promise is resolved will resolve to a specific method call.

Example:
```javascript
var o = {
    method: function(...args){
        console.log('method:', ...args)
    },
}

var p = Peomise.cooperative().as(o)

p.method(1, 2, 3) // returns a promise...

// ...

// resolving a promise will trigger all the proxy emthod execution, so 
// here 'method: 1, 2, 3' will get printed...
p.set(o)

```

#### `<promise>.as(..)`

Create a promise proxy

```bnf
<promise>.as(<object>)
<promise>.as(<constructor>)
    -> <promise-proxy>
```

A proxy promise will be populated with proxy methods to all the methods of the `<object>` or `<constructor>.prototype`.

#### `<promise-proxy>.<method>(..)`

When `<promise>` resolves, call the `.<method>(..)` on the resolved value.

```bnf
<promise-proxy>.<method>(..)
    -> <method-promise>
```

`<method-promise>` will resolve the the return value of the `<method>` when 
the main `<promise>` is resolved.



### Promise utilities

#### `Promise.awaitOrRun(..)`

Await for inputs if any of them is a promise and then run a function with 
the results, otherwise run the function in sync.

```dnf
Promise.awaitOrRun(<value>, <func>)
Promise.awaitOrRun(<value>, .. , <func>)
	-> <promise(value)>
	-> <value>
```



## Generator extensions and utilities

```javascript
var generator = require('ig-types/generator')
```


### The basics

The _generator_ hierarchy in JavaScript is a bit complicated.

Consider the following:
```javascript
// generator constructor function...
var Iter = function*(L){
    for(var e of L){
        yield e }}

// generator instance...
var iter = Iter([1, 2, 3])
```

We can test that `iter` is an instance of `Iter`:
```javascript
iter instanceof Iter // -> true
```

Note that there is no generator constructor constructor or _meta-generator_, 
i.e. `Iter` is created syntactically and not constructed via a `new` _constructor_.

Due to the three level structure of generators we use a slightly different 
terminology to reference different levels of API's:
- `Generator` - the generator meta-constructor.  
    This is a constructor that is used to create/prototype `<Generator>`'s, i.e.
    generator constructors.  
    `Generator` is mainly used for `instanceof` checks, but can be used as a 
    prototype for extending generators.
- `<Generator>` - the generator constructor.  
    This is the product of either a `Generator` meta-constructor or a 
    `function*(..){ .. }` statement.  
    In the above example `Iter` is a generator constructor.
- `<generator>` - the generator instance.  
    Generator instances are created by calling a `<Generator>` / generator 
    constructor.  
    In the above example `iter` is a generator instance.


Iterators and generators are similar but not the same. Some objects like `Array`'s, 
`Map`'s and `Set`'s provide a number of generic iterators that are not implemented 
as generators. These objects are also extended by `ig-types/generator` to match the 
`<generator>` object API defined below.



#### `generator.Generator`

Exposes the _hidden_ JavaScript generator meta-constructor.

This is similar to the JavaScript's
[`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) constructor
```javascript
var g = generator.Generator(`
    yield 123
    yield 321 `)

// prints 123 then 321...
for(var e of g()){
    console.log(e.value) }
```

This can be used to test if a function is a _generator constructor_
```javascript
Iter instanceof generator.Generator // -> true
```

Note that currently in JavaScript there is no _built-in_ way to test if a 
constructor/function, `Iter` in this case, is a _generator_ constructor.


#### `generator.iter(..)`

Generic generator wrapper
```bnf
generator.iter()
    -> <generator>

generator.iter(<iterable>)
    -> <generator>
```

Example:
```javascript
for(var i of generator.iter([1, 2, 3])){
    console.log(i) }
```

The following are equivalent:
```javascript
var a = generator.iter()

var b = new generator.Generator()
```

But `Generator()` takes no arguments and thus can not be used as a wrapper 
while `.iter(..)` is designed to accept an iterable value like an array object.


#### `generator.STOP`

<!-- XXX -->



### Generator instance iteration

This is a set of `Array`-like iterator methods that enable chaining of 
generators and `Promise`-like API to handle the generated results. 

Chained generators handle items depth-first, i.e. the items are passed as they 
are yielded down the generator chain.


#### `<generator>.iter(..)`

Iterate over the generator.
```bnf
<generator>.iter()
    -> <generator>
```

XXX move this to `generator.iter(..)`

Compatible with [`<array>`'s `.iter()`](#arrayiter--arrayiter).

`.iter(..)` also supports a handler function
```bnf
<generator>.iter(<handler>)
    -> <generator>


<handler>(<elem>, <index>)
    -> <elem>
    -> [<elem>, ..]
    -> []
```

Note that the iterables returned by `<handler>(..)` will be expanded, to prevent 
this wrap them in an array.


#### `<generator>.map(..)` / `<generator>.filter(..)` 

Equivalents to `Array`'s `.map(..)`, `.filter(..)` and `.reduce(..)` but return 
generators that yield the handler return values.

`.map(..)` here also supports a generator as a handler
```javascript
var expand = function*(n){ 
    yield* (new Array(n)).fill(n) }

// will create: [1, 2, 2, 3, 3, 3]
var L = [1,2,3]
    .iter()
        .map(expand)
        .toArray()
```

Throwing `STOP` form within the handler will stop generation, throwing 
`STOP(<value>)` will yield the `<value>` then stop.
```javascript
var stopAt = function(n){
    return function(e){
        if(e == n){
            // stop iteration yielding the value we are stopping at...
            throw generator.STOP(e) } 
        return e } }

var L = [1,2,3,4,5]
    .iter()
        .map(stopAt(3))
        .toArray()
```


#### `<generator>.reduce(..)` / `<generator>.greduce(..)`

<!--
XXX .reduce(..) can return a non-iterable -- test and document this case...
    ...compare with Array.prototype.reduce(..)
-->

#### `<generator>.forEach(..)` (EXPERIMENTAL)

```bnf
<generator>.forEach(<func>)
    -> <array>
```

This is different from the above in that this will unwind the `<generator>`.

Note that this differs from `<array>.forEach(..)` in that his will return the 
resulting array, essentially behaving like `.map(..)`.


#### `<generator>.between(..)`

```bnf
<generator>.between(<value>)
    -> <generator>
<generator>.between(<func>)
    -> <generator>

<func>([<pre>, <post>], <index-in>, <index-out>, <generator>)
    -> <value>
```


#### `<generator>.slice(..)`

```bnf
<generator>.slice()
<generator>.slice(<from>)
<generator>.slice(<from>, <to>)
    -> <generator>
```

Note that this does not support negative indexes as it not possible to know the
generator length until it is fully done.

Otherwise this is similar to `Array`'s `.slice(..)` but will return a generator 
instead of an array, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice


#### `<generator>.at(..)` / `<generator>.gat(..)`

```bnf
<generator>.at(<index>)
    -> <value>
    -> undefined

<generator>.gat(<index>)
    -> <generator>
```
<!-- XXX -->


#### `<generator>.flat(..)`

```bnf
<generator>.flat()
<generator>.flat(<depth>)
    -> <generator>
```

Equivalent to `Array`'s `.flat(..)` but will return a generator instead of an 
array, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat


#### `<generator>.shift()` / `<generator>.pop()` / `<generator>.gshift()` / `<generator>.gpop()`

Return the first/last item in generator.
```bnf
<generator>.shift()
<generator>.pop()
    -> <value>
    -> undefined
```

Return a `<generator>` that will yield the first/last item in the generator.
```bnf
<generator>.gshift()
<generator>.gpop()
    -> <generator>
```

Note that there are no equivalents to `.push(..)` and `.unshift(..)` as they 
would require breaking item processing order.

Note that `.shift()`/`.gshift()` will yield the item the generator is at at 
time of call, this may not be the _first_ item if the generator is partially 
depleted.

#### `<generator>.unshift(..)` / `<generator>.push(..)`

Add a value to the generator sequence at start/end.
```bnf
<generator>.unshift(<value>)
<generator>.push(<value>)
    -> <generator>
```

Value added by `.unshift(..)` will be yielded by `<generator>` "first", i.e. on 
_next_ call to `.next()`, regardless of the current generator state.


#### `<generator>.join(..)`

XXX


#### `<generator>.unwind(..)`

XXX


#### `<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`

Return a promise and resolve it with the generator value.

```bnf
<generator>.then()
    -> <promise>
```

Adding handlers to the promise

```bnf
<generator>.then(<resolve>, <reject>)
    -> <promise>

<generator>.then(<resolve>)
    -> <promise>

<generator>.finally(<handler>)
    -> <promise>
```

Note that this will deplete the generator.

These are the same as equivalent `Promise` methods, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


#### `<generator>.toArray()`

Unwind a generator into an array
```bnf
<generator>.toArray()
    -> <array>
```

This is equivalent to `[...<generator>]` but more suited for the concatenative style.


### Treating iterators the same as generators

Most _iterator_ methods of `Array`, `Set` and `Map` are extended with the same
API supported by the [`<generator>`](#generator-instance-iteration), so 
effectively most built-in iterator methods can be transparently treated as 
generators.

```javascript
// this will generate: [1, 4, 9]
var L = [ ...[1, 2, 3]
    // Note that this is implemented as an iterator in JS and not a generator...
    .values()
    .map(function(e){
        return e * e }) ]
```


### Generator constructor iteration

This API is essentially the same as [generator iteration](#generator-instance-iteration) 
with some minor omissions, but will return a reusable generator _pipeline_ 
instead of a generator.

```javascript
var sumOdds = generator.iter
    .filter(function(e){
        return e % 2 == 1 })
    .reduce(function(r, e){ 
        return r + e }, 0)
    .pop()

// sumOdds(..) is essentially a function that can be reused...
console.log(sumOdds([1, 2, 3])) // -> 4
console.log(sumOdds([1, 2, 3, 4, 5, 6, 7])) // -> 16
```

The above code is the same in function to:
```javascript
var sumOdds = function(lst){
    return generator.iter(lst)
        .filter(function(e){
            return e % 2 == 1 })
        .reduce(function(r, e){ 
            return r + e }, 0)
        .pop() }

console.log(sumOdds([1, 2, 3])) // -> 4
console.log(sumOdds([1, 2, 3, 4, 5, 6, 7])) // -> 16
```


<!-- XXX explain this as a language -->

`<Generator>` methods fall into two categories:
- `<constructor>`  
  create a new chained `<Generator>` object that when called will return 
  a `<generator>`
- `<finalizer>`  
  create a chained _function_ that when called will return a `<value>`/`undefined`

```bnf
<Generator>.<constructor>(..)
    -> <Generator>

<Generator>.<finalizer>(..)
    -> <func>

<Generator>(<iterable>)
    -> <generator>

<func>(<iterable>)
    -> <value>
    -> undefined
```

<!--
XXX list the differences...
-->


#### `<Generator>.iter(..)`

This is a shorthand to [`iter(..)`](#generatoriter).

This is here mainly for compatibility with 
[`Array`'s `.iter(..)`](#arrayiter--arrayiter).

#### `<Generator>.at(..)` / `<Generator>.gat(..)`

```bnf
<Generator>.at(<index>)
    -> <func>

<Generator>.gat(<index>)
    -> <Generator>
```

Equivalents to [`<generator>`'s `.at(..)`/`.gat(..)`](#generatorat--generatorgat) 
but returning a reusable `<func>`/`<Generator>`.


#### `<Generator>.shift()` / `<Generator>.pop()` / `<Generator>.gshift()` / `<Generator>.gpop()`

```bnf
<Generator>.shift()
<Generator>.pop()
    -> <func>

<Generator>.gshift()
<Generator>.gpop()
    -> <Generator>
```

Note that `.shift()`/`.gshift()` will get the element the generator is at 
currently which may not be the first element in the sequence.

Equivalents to [`<generator>`'s `.shift(..)`/`.pop(..)`/..](#generatorshift--generatorpop--generatorgshift--generatorgpop) 
but returning a reusable `<func>`/`<Generator>`.


#### `<generator>.unshift(..)` / `<generator>.push(..)`

```bnf
<Generator>.unshift(<value>)
<Generator>.push(<value>)
    -> <Generator>
```

Equivalents to [`<generator>`'s `.unshift(..)`/`.push(..)`](#generatorunshift--generatorpush) 
but returning a reusable `<Generator>`.


#### `<Generator>.slice(..)`

```bnf
<Generator>.slice(<from>)
<Generator>.slice(<from>, <to>)
    -> <Generator>
```

Unlike `Array`'s `.slice(..)` this does not support negative indexes.

Equivalent to [`<generator>`'s `.slice(..)`](#generatorslice) 
but returning a reusable `<Generator>`.


#### `<Generator>.map(..)` / `<Generator>.filter(..)` / `<Generator>.reduce(..)` / `<Generator>.flat()`

Counterparts to `<generator>`'s 
[`.map(..)`, `.filter(..)`](#generatormap--generatorfilter), [`.reduce(..)`/`.greduce(..)`](#generatorreduce--generatorgreduce) and 
[`.flat(..)`](#generatorflat) 
but return a `<Generator>`.

<!-- XXX -->


#### `<Generator>.between(..)`

```bnf
<Generator>.between(<value>)
    -> <Generator>
<Generator>.between(<func>)
    -> <Generator>

<func>([<pre>, <post>], <index-in>, <index-out>, <Generator>)
    -> <value>
```


#### `<Generator>.toArray()`

Return a function that will return a `<generator>` output as an `Array`.
```bnf
<Generator>.toArray()
    -> <function>
```

#### `<Generator>.join(..)`

XXX


#### `<Generator>.unwind(..)`

<!-- XXX -->



### Generator combinators

<!-- XXX -->

#### `<Generator>.chain(..)` / `<generator>.chain(..)`

```bnf
<Generator>.chain(<Generator>, ..)
    -> <Generator>
    
<generator>.chain(<Generator>, ..)
    -> <generator>
```
<!-- XXX -->

```javascript
// double each element...
var x2 = generator.iter
    .map(function(e){ return e * 2 })

generator.range(0, 100).chain(x2)
```

#### `<Generator>.concat(..)` / `<generator>.concat(..)` 

Concatenate the results from generators
```bnf
<Generator>.concat(<Generator>, ..)
    -> <Generator>
    
<generator>.concat(<generator>, ..)
    -> <generator>
```


<!-- XXX Example -->


<!-- XXX
#### generator.zip(..) / `<Generator>.zip(..)` / `<generator>.zip(..)` 
-->

<!-- XXX
#### `<Generator>.tee(..)` / `<generator>.tee(..)` 
-->



### Generator library

#### `generator.range(..)`

Create a generator yielding a range of numbers
```bnf
range()
range(<to>)
range(<from>, <to>)
range(<from>, <to>, <step>)
    -> <generator>
```

<!-- XXX examples... -->


#### `generator.repeat(..)`

Create a generator repeatedly yielding `<value>`
```bnf
repeat()
repeat(<value>)
repeat(<value>, <stop>)
    -> <generator>

<stop>(<value>)
    -> <bool>
```

If no value is given `true` is yielded by default.

`<stop>` if given will be called with each `<value>` before it is yielded and 
if it returns `false` the iteration is stopped.

<!-- XXX examples... -->


#### `generator.produce(..)`

Create a generator calling a function to produce yielded values
```bnf
produce()
produce(<func>)
    -> <generator>

<func>()
    -> <value>
```

`<func>(..)` can `throw` `STOP` or `STOP(<value>)` to stop production at any time.

<!-- XXX examples... -->



### Generator helpers

#### `generator.stoppable(..)`

Wrap function/generator adding support for stopping mid-iteration by throwing `STOP`.

```bnf
stoppable(<generator>)
    -> <generator>
```

<!-- XXX example? -->

## Async generator extensions

XXX EXPERIMENTAL

#### `generator.AsyncGenerator`

#### `<async-generator>.unwind(..)`

#### `<async-generator>.then(..)` / `<async-generator>.catch(..)` / `<async-generator>.finally(..)`

#### `<async-generator>.iter(..)`

#### `<async-generator>.map(..)` / `<async-generator>.filter(..)` / `<async-generator>.reduce(..)`

#### `<async-generator>.chain(..)`

#### `<async-generator>.flat(..)`

#### `<async-generator>.concat(..)`

#### `<async-generator>.push(..)` / `<async-generator>.unshift(..)`



## Containers

```javascript
var containers = require('ig-types').containers
```
or, to only import containers:
```javascript
var containers = require('ig-types/containers')
```

Note that this will also import [`ig-types/Map`](#map).


### `containers.UniqueKeyMap()` (`Map`)

`UniqueKeyMap` implements a key-value container (i.e. `Map`) that supports
and maintains _duplicate_ keys by appending an index to them.  
The original keys are stored internally thus the renaming mechanics are 
stable.

`UniqueKeyMap` extends the `Map` constructor, so all the usual `Map` 
methods and properties apply here.

To construct an instance:
```javascript
var x = new UniqueKeyMap()
```
or:
```javascript
// new is optional...
var y = UniqueKeyMap()
```

`UniqueKeyMap` supports the same initialization signature as `Map` but 
treats repeating keys differently.
```javascript
var z = UniqueKeyMap([['a', 1], ['a', 2], ['b', 1]])
```

The second `"a"` item will automatically get re-keyed as `"a (1)"`:
```javascript
console.log([...z.keys()]) // -> ['a', 'a (1)', 'b']
```

Note that `.set(..)` will never rewrite an element:
```javascript
z.set('a', 3)

console.log([...z.keys()]) // -> ['a', 'a (1)', 'b', 'a (2)']

z.get('a') // -> 1
z.get('a (1)') // -> 2
```

To get the generated key:
```javascript
var k = z.set('a', 4, true)

console.log(k) // -> 'a (3)'
```

To explicitly rewrite an item:
```javascript
z.reset('a (1)', 4)

z.get('a (1)') // -> 4
```

And we can _rename_ items, i.e. change their key:
```javascript
z.rename('a (2)', 'c')

console.log([...z.keys()]) // -> ['a', 'a (1)', 'b', 'a (3)', 'c']
```

For more info on `Map` see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map


#### `<unique-key-map>.set(..)`

```bnf
<unique-key-map>.reset(<key>, <item>)
    -> <unique-key-map>

<unique-key-map>.reset(<key>, <item>, true)
    -> <new-key>
```

Add an `<item>` to `<unique-key-map>`.

If `<key>` already exists then add an index to it to make it unique.

Key updating is done via [`<unique-key-map>.__key_pattern__`](#unique-key-map__key_pattern__).


#### `<unique-key-map>.reset(..)`

```bnf
<unique-key-map>.reset(<key>, <item>)
    -> <unique-key-map>
```

Explicitly write an `<item>` under `<key>` as-is, this is like `Map`'s `.set(..)`.


#### `<unique-key-map>.rename(..)`

```bnf
<unique-key-map>.rename(<from-key>, <to-key>)
    -> <unique-key-map>

<unique-key-map>.rename(<from-key>, <to-key>, true)
    -> <new-key>
```

Rename item key from `<from-key>` to `<to-key>`.

Same mechanics apply as for [`.set(..)`](#unique-key-mapset) for key uniqueness.

Note, if [`.__unordered_rename__`](#unique-key-map__unordered_rename__) is 
`false` (default) this calls [`.orderedRename(..)`](#unique-key-maporderedrename) 
otherwise [`.unorderedRename(..)`](#unique-key-mapunorderedrename) is called.


#### `<unique-key-map>.orderedRename(..)`

<!-- XXX -->


#### `<unique-key-map>.unorderedRename(..)`

<!-- XXX -->


#### `<unique-key-map>.keysOf(..)`

<!-- XXX -->


#### `<unique-key-map>.originalKey(..)`

<!-- XXX -->


#### `<unique-key-map>.uniqueKey(..)`

<!-- XXX -->


#### `<unique-key-map>.__key_pattern__`

<!-- XXX -->


#### `<unique-key-map>.__unordered_rename__`

<!-- XXX -->



## Event

This module defines a set of pure-JavaScript event-like method constructors 
and utilities.

```javascript
var event = require('ig-types/event')
```


### `event.Eventfull(..)`

Create and eventful method.
```dnf
event.Eventfull(<name>[, <options>])
event.Eventfull(<name>, <func>[, <options>])
	-> <method>
```

An eventful method is a method that can be called either directly or via
`.trigger(<method-name>, ..)`.


Calling an eventful method will call `<func>(..)` if defined and will 
trigger the eventful method's handlers trigger, either after `<func>(..)` 
returns or when `<hander>(..)` is called within `<func>(..)`.
```dnf
<method>(..)
	-> <value>
```

Note that if `<func>(..)` returns `undefined` then `<method>(..)` will 
return either `this` or `undefined` depending on `<options>.defaultReturn` 
being set to `'context'` (default) or `undefined` resp.


Handlers can be bound to an eventful method via `.on(<method-name>, ...)`,
unbound via `.off(<method-name>)`, 
see: [`event.EventHandlerMixin`](#eventeventhandlermixin) for more info.

```dnf
<handler>(<event-name>, ...)
```


The event `<func>(..)` gets the `<handle-func>(..)` as first argument 
followed by the arguments passed to `<method>(..)` when called.
```dnf
<func>(<handle-func>, ...)
	-> <value>
```

`<handle-func>(..)` controls when the event handlers are called.
```dnf
<handle-func>()
<handle-func>(true)
	-> true
	-> false

<handle-func>(true, ...)
	-> true
	-> false
```

Calling `<handle-func>(..)` is optional, if not called the handlers will 
get triggered after `<func>(..)` returns.


Passing `false` to `<handle-func>(..)` will prevent the event handlers 
from being called.
```dnf
<handle-func>(false)
	-> undefined
```

Note that for `async` event `<func>(..)` it might be useful to trigger 
the handlers after the promise resolves, this can be done by first calling
`<handle-func>(false)` to prevent the handlers from being triggered as soon
as the promise is returned and after an appropriate `await`ing calling
`<handle-func>()` to actually trigger the handlers.

Example:
```javascript
var evt = event.Event('evt', async function(handler, ...args){
	handler(false)
	var value = await something()
	handler()
	return value })
```


**Special case: `<event-commands>`**

`<event-command>`s are instances of `EventCommand` that are handled by 
event methods in a special way.

```dnf
<method>(<event-command>, ...)
	-> <value>

<func>(<handle-func>, <event-command>, ...)
	-> <value>
```

`EventCommand` instance can be passed as the first argument of `<method>(..)`, 
in this case the event function will get it but the event handlers 
will not.

This is done to be able to externally pass commands to event methods
that get handled in a special way by the function but not passed to 
the event handlers.

For an example of a built-in `<event-command>` see: [`event.TRIGGER`](#eventtrigger) 



### `event.Event(..)`

Extends `Eventful(..)` adding ability to bind events via the resulting 
method directly by passing it a function.

```dnf
<method>(<handler>)
	-> <this>
```


### `event.PureEvent(..)`

Like `Event(..)` but produces an event method that can only be triggered 
via .trigger(name, ...), calling this is a no-op.



### `event.TRIGGER`

Special value (`<event-command>`) that when passed to an event method as 
first argument will force it to trigger event if the first argument was 
a function.



### `event.EventHandlerMixin`

A _mixin_ defining the basic event API.

For more info on mixins see: 
https://github.com/flynx/object.js#mixin


#### `<obj>.on(..)`

Bind a handler to an _event_ or an _eventful_ method.
```dnf
<obj>.on(<event-name>, <handler>)
	-> <obj>
```


#### `<obj>.one(..)`

Like `<obj>.on(..)` but the `<handler>` will be called only once.
```dnf
<obj>.one(<event-name>, <handler>)
	-> <obj>
```


#### `<obj>.off(..)`

Unbind `<handler>` from _event_.
```dnf
<obj>.off(<event-name>, <handler>)
	-> <obj>
```


#### `<obj>.trigger(..)`

Trigger an _event_.
```dnf
<obj>.trigger(<event-name>)
<obj>.trigger(<event-name>, ...)
	-> <obj>
```



### `event.EventDocMixin`

A _mixin_ defining the basic event introspection API.

For more info on mixins see: 
https://github.com/flynx/object.js#mixin


#### `<obj>.eventfull`

Property listing the _eventful_ method names in the current context.


#### `<obj>.events`

Property listing the _event_ method names in the current context, this 
also will include _eventful_ method names.


### `event.EventMixin`

Combines [`event.EventHandlerMixin`](#eventeventhandlermixin) and 
[`event.EventDocMixin`](#eventeventdocmixin).

For more info on mixins see: 
https://github.com/flynx/object.js#mixin


## Runner

```javascript
var runner = require('ig-types/runner')
```

### Micro task queue

<!-- XXX -->



This includes [`event.EventMixin`](#eventeventmixin).

#### `runner.STOP`

<!-- XXX -->


#### `runner.SKIP`

<!-- XXX -->



#### `Queue(..)` / `Queue.runTasks(..)`

<!-- XXX -->


#### `Queue.handle(..)`

Create a handler queue object.
```bnf
Queue.handle(<func>, ...<data>)
Queue.handle(<options>, <func>, ...<data>)
    -> <queue>
```

A handler queue is a queue that has a single handler function (`.handle(..)`) 
that handles the queue data.

This is a shorthand for:
```javascript
var handler_queue = Queue({
        handler: function(item){ .. }, 
        .. 
    }, 
    .. )
```

<!-- XXX settings... -->


#### `<queue>.state`

<!-- XXX -->



#### `<queue>.start(..)`

<!-- XXX -->


#### `<queue>.stop(..)`

<!-- XXX -->



#### `<queue>.runTask(..)`

<!-- XXX -->



#### `<queue>.tasksAdded(..)` (event)

<!-- XXX -->


#### `<queue>.taskStarting(..)` (event)

<!-- XXX -->


#### `<queue>.taskFailed(..)` (event)

<!-- XXX -->


#### `<queue>.taskCompleted(..)` (event)

Event, triggered when a task is completed passing in its result.

<!-- XXX -->



#### `<queue>.queueEmpty(..)` (event)

<!-- XXX -->



#### `<queue>.prioritize(..)`

<!-- XXX -->


#### `<queue>.delay(..)`

<!-- XXX -->



#### `<queue>.add(..)`

<!-- XXX -->


#### `<queue>.clear(..)`

<!-- XXX -->




#### `FinalizableQueue(..)` / `FinalizableQueue.runTasks(..)` (Queue)

This is similar to `Queue(..)` but adds two terminal states (`"done"` and 
`"aborted"`) and a `promise`-mapping.

```bnf
FinalizableQueue.handle(<func>, ...<data>)
FinalizableQueue.handle(<options>, <func>, ...<data>)
    -> <finalizable-queue>
```

When a `<finalizable-queue>` reaches a terminal state it is frozen.

#### `<finalizable-queue>.done(..)` (event/method)

<!-- XXX -->


#### `<finalizable-queue>.abort(..)` (event/method)

<!-- XXX -->



#### `<finalizable-queue>.promise(..)`

<!-- XXX -->


#### `<finalizable-queue>.then(..)`

<!-- XXX -->


#### `<finalizable-queue>.catch(..)`

<!-- XXX -->





### Large task management

<!-- XXX -->


#### `runner.TaskManager(..)`

<!-- XXX -->



This includes [`event.EventMixin`](#eventeventmixin).

#### `<task-manager>.Task(..)`

<!-- XXX -->


#### `<task-manager>.sync_start`

<!-- XXX -->


#### `<task-manager>.record_times`

<!-- XXX -->




#### `<task-manager>.titled(..)`

<!-- XXX -->


#### `<task-manager>.send(..)`

<!-- XXX -->


#### `<task-manager>.stop(..)`

<!-- XXX -->




#### `<task-manager>.done(..)` (event)

<!-- XXX -->


#### `<task-manager>.error(..)` (event)

<!-- XXX -->


#### `<task-manager>.tasksDone(..)` (event)

<!-- XXX -->




#### `runner.TaskTicket(..)`

<!-- XXX -->


#### `runner.TaskMixin(..)`

<!-- XXX -->




## License

[BSD 3-Clause License](./LICENSE)

Copyright (c) 2020, Alex A. Naanou,  
All rights reserved.


<!-- vim:set ts=4 sw=4 spell : -->
