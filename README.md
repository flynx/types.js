# types.js

A library of JavaScript type extensions, types and type utilities.

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
    - [Abortable `Array` iteration](#abortable-array-iteration)
      - [`array.STOP` / `array.STOP(..)`](#arraystop--arraystop)
      - [`<array>.smap(..)` / `<array>.sfilter(..)` / `<array>.sreduce(..)` / `<array>.sforEach(..)`](#arraysmap--arraysfilter--arraysreduce--arraysforeach)
    - [Large `Array` iteration (chunked)](#large-array-iteration-chunked)
      - [`array.STOP` / `array.STOP(..)`](#arraystop--arraystop-1)
      - [`<array>.CHUNK_SIZE`](#arraychunk_size)
      - [`<array>.mapChunks(..)` / `<array>.filterChunks(..)` / `<array>.reduceChunks(..)`](#arraymapchunks--arrayfilterchunks--arrayreducechunks)
  - [`Map`](#map)
    - [`<map>.sort(..)`](#mapsort)
  - [`Set`](#set)
    - [`<set>.unite(..)`](#setunite)
    - [`<set>.intersect(..)`](#setintersect)
    - [`<set>.subtract(..)`](#setsubtract)
    - [`<set>.sort(..)`](#setsort)
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
    - [Cooperative promises](#cooperative-promises)
      - [`Promise.cooperative(..)`](#promisecooperative)
      - [`<promise-coop>.set(..)`](#promise-coopset)
      - [`<promise-coop>.isSet`](#promise-coopisset)
    - [Promise iteration](#promise-iteration)
      - [`Promise.iter(..)` / `promise.IterablePromise(..)`](#promiseiter--promiseiterablepromise)
      - [`<promise-iter>.map(..)` / `<promise-iter>.filter(..)` / `<promise-iter>.reduce(..)`](#promise-itermap--promise-iterfilter--promise-iterreduce)
      - [`<promise-iter>.flat(..)`](#promise-iterflat)
      - [`<promise-iter>.then(..)` / `<promise-iter>.catch(..)` / `<promise-iter>.finally(..)`](#promise-iterthen--promise-itercatch--promise-iterfinally)
      - [Advanced handler](#advanced-handler)
  - [Generator extensions and utilities](#generator-extensions-and-utilities)
    - [The basics](#the-basics)
      - [`generator.Generator`](#generatorgenerator)
      - [`generator.iter(..)`](#generatoriter)
    - [Generator instance iteration](#generator-instance-iteration)
      - [`<generator>.map(..)` / `<generator>.filter(..)` / `<generator>.reduce(..)`](#generatormap--generatorfilter--generatorreduce)
      - [`<generator>.slice(..)`](#generatorslice)
      - [`<generator>.at(..)`](#generatorat)
      - [`<generator>.flat(..)`](#generatorflat)
      - [`<generator>.shift()` / `<generator>.pop()`](#generatorshift--generatorpop)
      - [`<generator>.promise()`](#generatorpromise)
      - [`<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`](#generatorthen--generatorcatch--generatorfinally)
      - [`<generator>.toArray()`](#generatortoarray)
    - [Generator constructor iteration](#generator-constructor-iteration)
      - [`<Generator>.at(..)`](#generatorat-1)
      - [`<Generator>.shift()` / `<Generator>.pop()`](#generatorshift--generatorpop-1)
      - [`<Generator>.slice(..)`](#generatorslice-1)
      - [`<Generator>.map(..)` / `<Generator>.filter(..)` / `<Generator>.reduce(..)` / `<Generator>.flat()`](#generatormap--generatorfilter--generatorreduce--generatorflat)
      - [`<Generator>.toArray()`](#generatortoarray-1)
      - [`<Generator>.then(..)` / `<Generator>.catch(..)` / `<Generator>.finally(..)`](#generatorthen--generatorcatch--generatorfinally-1)
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
      - [`STOP`](#stop)
      - [`SKIP`](#skip)
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
    -> <array>
```

Elements not present in `<other>` retain their relative order and are
placed after the sorted elements.

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



## `Map`

```javascript
require('ig-types/Map')
```

### `<map>.sort(..)`



## `Set`

```javascript
require('ig-types/Set')
```


### `<set>.unite(..)`

### `<set>.intersect(..)`

### `<set>.subtract(..)`

### `<set>.sort(..)`


## `Date`

```javascript
require('ig-types/Date')
```

### `Date.timeStamp(..)`

### `Date.fromTimeStamp(..)`

### `Date.str2ms(..)`

### `<date>.toShortDate(..)`

### `<date>.getTimeStamp(..)`

### `<date>.setTimeStamp(..)`


## `String`

```javascript
require('ig-types/String')
```

### `<string>.capitalize()`

### `<string>.indent(..)`


## `RegExp`

```javascript
require('ig-types/RegExp')
```

### `RegExp.quoteRegExp(..)`


## `Promise`

```javascript
require('ig-types/Promise')
```
or
```javascript
var promise = require('ig-types/Promise')
```



### Cooperative promises

#### `Promise.cooperative(..)`

#### `<promise-coop>.set(..)`

#### `<promise-coop>.isSet`


### Promise iteration

An _iterable promise_ is on one hand very similar to `Promise.all(..)` in that it
generally takes a list of values each could be either an explicit value or a 
promise, and it is similar to a _generator_ in that allows iteration over the 
contained values and chaining of operations but unlike `Promise.all(..)` this 
iteration occurs depth first instead of breadth first.

Essentially one can think about _promise iterators_ vs. _generators_ as the former
being internally controlled and asynchronous while the later being externally
controlled and synchronous.

Here is a traditional example using `Promise.all(..)`:
```javascript
var p = Promise.all([ .. ])
    // this will not execute until ALL the inputs resolve...
    .then(function(lst){
        return lst
          .filter(function(e){

          })
          // this will not run until ALL of lst is filtered...
          .map(function(e){

          }) })
```

```javascript
var p = Promise.iter([ .. ])
    // each element is processed as soon as it is ready disregarding of its order
    // in the input array...
    .filter(function(e){

    })
    // items reach here as soon as they are returned by the filter stage...
    // NOTE: the filter handler may return promises, those will not be processed
    //    until they are resolved...
    .map(function(e){

    })
    // .then(..) explicitly waits for the whole list of inputs to resolve...
    .then(function(lst){

    })
```

This approach has a number of advantages:
- items are processed as soon as they are available without waiting for the 
  slowest promise on each level to resolve
- simpler and more intuitive code

And some disadvantages:
- item indexes are unknowable until all the promises resolve.



#### `Promise.iter(..)` / `promise.IterablePromise(..)`

Create an _iterable promise_
```
Promise.iter(<array>)
    -> <iterable-promise>
```
#### `<promise-iter>.map(..)` / `<promise-iter>.filter(..)` / `<promise-iter>.reduce(..)`

#### `<promise-iter>.flat(..)`


#### `<promise-iter>.then(..)` / `<promise-iter>.catch(..)` / `<promise-iter>.finally(..)`

#### Advanced handler

```bnf
Promise.iter(<block-array>, <handler>)
    -> <iterable-promise>

<handler>(<elem>)
    -> [ <elems> ]
```

```bnf
<block-array> ::= 
    []
    | [ <block-elem>, .. ]

<block-elem> ::=
    []
    | [ <value>, .. ]
    | <promise>
    | <non-array>
```

Example:
```javascript
var p = Promise.iter(
        // NOTE: if you want an element to explicitly be an array wrap it in 
        //    an array -- like the last element here...
        [[1, 2], 3, Promise.resolve(4), [[5, 6]]], 
        function(elem){
            return elem % 2 == 0 ?
                    [elem, elem]
                : elem instanceof Array ?
                  [elem]
                : [] })
    .then(function(lst){
        console.log(lst) // -> [2, 2, 4, 4, [5, 6]]
    })
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


#### `generator.Generator`

Exposes the _hidden_ JavaScript generator constructor.

```javascript
Iter instanceof generator.Generator // -> true
```

Note that currently in JavaScript there is no built-in way to test if a 
constructor, `Iter` in this case, is a _generator_ constructor.


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

But `Generator()` takes no arguments and thus can not be used as a wrapper while `.iter(..)` is designed to accept an iterable value like an array object.


### Generator instance iteration

This is a set of `Array`-like iterator methods that enable chaining of 
generators and `Promise`-like API to handle the generated results. 

Chained generators handle items depth-first, i.e. the items are passed as they are yielded down the generator chain.


#### `<generator>.map(..)` / `<generator>.filter(..)` / `<generator>.reduce(..)`

Equivalents to `Array`'s `.map(..)`, `.filter(..)` and `.reduce(..)` but return 
generators that yield the handler return values.

<!--
XXX .reduce(..) can return a non-iterable -- test and document this case...
-->


#### `<generator>.slice(..)`

```bnf
<generator>.slice()
<generator>.slice(<from>)
<generator>.slice(<from>, <to>)
    -> <generator>
```

<!-- XXX check this 
This does not support negative indexes.
-->

Equivalent to `Array`'s `.slice(..)` but will return a generator instead of an 
array, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice


#### `<generator>.at(..)`

```bnf
<generator>.at(<index>)
    -> <generator>
```
Returns a generator that will yield an item at a specific position when it is 
available.


#### `<generator>.flat(..)`

```bnf
<generator>.flat()
<generator>.flat(<depth>)
    -> <generator>
```

Equivalent to `Array`'s `.flat(..)` but will return a generator instead of an 
array, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat


#### `<generator>.shift()` / `<generator>.pop()`

Return the first/last item in generator.
```bnf
<generator>.pop()
    -> <value>
    -> undefined

<generator>.shift()
    -> <value>
    -> undefined
```

Note that there are no equivalents to `.push(..)` and `.unshift(..)` as they 
would require breaking item processing order.

Note that `.shift()` may not yield the actual first item if the generator is 
partially depleted at time of call.


#### `<generator>.promise()`

```bnf
<generator>.promise()
    -> <promise>
```
Return a promise and resolve it with the generator value.

Note that this will deplete the generator.


#### `<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`

```bnf
<generator>.then(<resolve>, <reject>)
    -> <promise>

<generator>.then(<reject>)
    -> <promise>

<generator>.finally(<handler>)
    -> <promise>
```
Shorthands to `<generator>.promise().then(..)` / `<generator>.promise().catch(..)` / `<generator>.promise().finally(..)`

These are the same as equivalent `Promise` methods, for more info see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


#### `<generator>.toArray()`

Unwind a generator into an array
```bnf
<generator>.toArray()
    -> <array>
```

This is equivalent to `[...<generator>]` but more suited for the concatenative style.


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

<!--
XXX only list the differences + reference to the above...
-->


#### `<Generator>.at(..)`

#### `<Generator>.shift()` / `<Generator>.pop()`

#### `<Generator>.slice(..)`

This is like `Array`'s `.slice(..)` but does not support negative indexes.

#### `<Generator>.map(..)` / `<Generator>.filter(..)` / `<Generator>.reduce(..)` / `<Generator>.flat()`

#### `<Generator>.toArray()`

#### `<Generator>.then(..)` / `<Generator>.catch(..)` / `<Generator>.finally(..)`


## Containers

```javascript
var containers = require('ig-types').containers
```
or, to only import containers:
```javascript
var containers = require('ig-types/containers')
```

Note that this will also import `ig-types/Map`.


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

#### `<unique-key-map>.unorderedRename(..)`

#### `<unique-key-map>.keysOf(..)`

#### `<unique-key-map>.originalKey(..)`

#### `<unique-key-map>.uniqueKey(..)`

#### `<unique-key-map>.__key_pattern__`

#### `<unique-key-map>.__unordered_rename__`


## Event

```javascript
var event = require('ig-types/event')
```


### `event.Eventfull(..)`

### `event.Event(..)`

### `event.TRIGGER`

Special value when passed to an event method as first argument will force it 
to trigger event if the first argument was a function.

### `event.EventHandlerMixin`

#### `<obj>.on(..)`

#### `<obj>.one(..)`

#### `<obj>.off(..)`

#### `<obj>.trigger(..)`

### `event.EventDocMixin`

#### `<obj>.eventfull`

#### `<obj>.events`

### `event.EventMixin`

Combines [`event.EventHandlerMixin`](#eventeventhandlermixin) and 
[`event.EventDocMixin`](#eventeventdocmixin).

## Runner

```javascript
var runner = require('ig-types/runner')
```

### Micro task queue


This includes [`event.EventMixin`](#eventeventmixin).

#### `STOP`

#### `SKIP`


#### `Queue(..)` / `Queue.runTasks(..)`

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


#### `<queue>.start(..)`

#### `<queue>.stop(..)`


#### `<queue>.runTask(..)`


#### `<queue>.tasksAdded(..)` (event)

#### `<queue>.taskStarting(..)` (event)

#### `<queue>.taskFailed(..)` (event)

#### `<queue>.taskCompleted(..)` (event)

Event, triggered when a task is completed passing in its result.


#### `<queue>.queueEmpty(..)` (event)


#### `<queue>.prioritize(..)`

#### `<queue>.delay(..)`


#### `<queue>.add(..)`

#### `<queue>.clear(..)`



#### `FinalizableQueue(..)` / `FinalizableQueue.runTasks(..)` (Queue)

This is the similar as `Queue(..)` but adds two terminal states (`"done"` 
and `"aborted"`) and a `promise`-mapping.

```bnf
FinalizableQueue.handle(<func>, ...<data>)
FinalizableQueue.handle(<options>, <func>, ...<data>)
    -> <finalizable-queue>
```

When a `<finalizable-queue>` reaches a terminal state it is frozen.

#### `<finalizable-queue>.done(..)` (event/method)

#### `<finalizable-queue>.abort(..)` (event/method)


#### `<finalizable-queue>.promise(..)`

#### `<finalizable-queue>.then(..)`

#### `<finalizable-queue>.catch(..)`




### Large task management

#### `runner.TaskManager(..)`


This includes [`event.EventMixin`](#eventeventmixin).

#### `<task-manager>.Task(..)`

#### `<task-manager>.sync_start`

#### `<task-manager>.record_times`



#### `<task-manager>.titled(..)`

#### `<task-manager>.send(..)`

#### `<task-manager>.stop(..)`



#### `<task-manager>.done(..)` (event)

#### `<task-manager>.error(..)` (event)

#### `<task-manager>.tasksDone(..)` (event)



#### `runner.TaskTicket(..)`

#### `runner.TaskMixin(..)`



## License

[BSD 3-Clause License](./LICENSE)

Copyright (c) 2020, Alex A. Naanou,  
All rights reserved.


<!-- vim:set ts=4 sw=4 spell : -->