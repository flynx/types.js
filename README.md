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
    - [`<array>.unique(..)` / `<array>.tailUnique(..)`](#arrayunique--arraytailunique)
    - [`<array>.cmp(..)`](#arraycmp)
    - [`<array>.setCmp(..)`](#arraysetcmp)
    - [`<array>.sortAs(..)`](#arraysortas)
    - [`<array>.inplaceSortAs(..)`](#arrayinplacesortas)
    - [`<array>.toKeys(..)`](#arraytokeys)
    - [`<array>.toMap(..)`](#arraytomap)
    - [`Array.zip(..)` / `<array>.zip(..)`](#arrayzip--arrayzip)
    - [`Array.iter(..)` / `<array>.iter()`](#arrayiter--arrayiter)
    - [Abortable `Array` iteration](#abortable-array-iteration)
      - [`array.StopIteration`](#arraystopiteration)
      - [`<array>.smap(..)` / `<array>.sfilter(..)` / `<array>.sreduce(..)` / `<array>.sforEach(..)`](#arraysmap--arraysfilter--arraysreduce--arraysforeach)
    - [Large `Array` iteration (chunked)](#large-array-iteration-chunked)
      - [`array.StopIteration`](#arraystopiteration-1)
      - [`<array>.CHUNK_SIZE`](#arraychunk_size)
      - [`<array>.mapChunks(..)`](#arraymapchunks)
      - [`<array>.filterChunks(..)`](#arrayfilterchunks)
      - [`<array>.reduceChunks(..)`](#arrayreducechunks)
    - [`Array` (polyfill)](#array-polyfill)
      - [`<array>.flat()`](#arrayflat)
      - [`<array>.includes()`](#arrayincludes)
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
      - [`Generator`](#generator)
      - [`generator.iter(..)`](#generatoriter)
    - [Generator instance iteration](#generator-instance-iteration)
      - [`<generator>.map(..)` / `<generator>.filter(..)` / `<generator>.reduce(..)` / `<generator>.flat()`](#generatormap--generatorfilter--generatorreduce--generatorflat)
      - [`<generator>.promise()`](#generatorpromise)
      - [`<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`](#generatorthen--generatorcatch--generatorfinally)
      - [`<generator>.toArray()`](#generatortoarray)
    - [Generator constructor iteration](#generator-constructor-iteration)
      - [`Generator.at(..)`](#generatorat)
      - [`Generator.shift()` / `Generator.pop()`](#generatorshift--generatorpop)
      - [`Generator.slice(..)`](#generatorslice)
      - [`Generator.map(..)` / `Generator.filter(..)` / `Generator.reduce(..)` / `Generator.flat()`](#generatormap--generatorfilter--generatorreduce--generatorflat-1)
      - [`Generator.toArray()`](#generatortoarray-1)
      - [`Generator.then(..)` / `Generator.catch(..)` / `Generator.finally(..)`](#generatorthen--generatorcatch--generatorfinally-1)
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
    - [`runner.Queue(..)` / `runner.Queue.run(..)`](#runnerqueue--runnerqueuerun)
      - [`<queue>.state`](#queuestate)
      - [`<queue>.start(..)`](#queuestart)
      - [`<queue>.pause(..)`](#queuepause)
      - [`<queue>.abort(..)`](#queueabort)
      - [`<queue>.on(..)` / `<queue>.one(..)`](#queueon--queueone)
      - [`<queue>.off(..)`](#queueoff)
      - [`<queue>.trigger(..)`](#queuetrigger)
      - [`<queue>.taskCompleted(..)` (event)](#queuetaskcompleted-event)
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
Note that type patching modules are mostly independent.

And to import specific library modules only:
```javascript
var containers = require('ig-types/containers')
```


## `Object`

```javascript
require('ig-types/Object')
```

### `Object.deepKeys(..)`

```
Object.deepKeys(<obj>)
  -> <keys>
```

Get list of keys from all objects in the prototype chain.

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

### `Object.copy(..)` (EXPERIMENTAL)

```
Object.copy(<obj>)
  -> <obj-copy>
```

Create a copy of `<obj>`

This will:
- create a blank `<obj-copy>`
- link `<obj-copy>` to the same prototype chain
- copy all _own_ keys from `<obj>` to `<obj-copy>`

Note that this will make no attempt to clone object type.

_XXX not yet sure how useful this is._


### `Object.flatCopy(..)`

```
Object.flatCopy(<obj>)
  -> <new-obj>
```

Copy all attributes from the prototype chain of `<obj>` into `<new-obj>`.


### `Object.match(..)`

### `Object.matchPartial(..)`

### `<object>.run(..)`

```
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

For more info see:  
https://github.com/flynx/object-run.js


### `Object.sort(..)`

Sort `<obj>` attributes (same as `Array`'s `.sort(..)`)
```
Object.sort(<obj>)
  -> <obj>
```

Sort `<obj>` attributes via `<cmp>` function.
```
Object.sort(<obj>, <cmp>)
  -> <obj>
```

Sort `<obj>` attributes to the same order of `<order-list>`.
```
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
```
<array>.first()
  -> <item>

<array>.last()
  -> <item>
```

Set the first/last items of `<array>`.
```
<array>.first(<item>)
  -> <array>

<array>.last(<item>)
  -> <array>
```

Note that these do not affect `<array>` length unless setting items on 
an empty `<array>`.


### `<array>.rol(..)`

Roll `<array>` in-place left.
```
<array>.rol()
<array>.rol(1)
  -> <array>

<array>.rol(n)
  -> <array>
```

To roll right pass a negative `n` to `.rol(..)`.


### `<array>.compact()`

```
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

### `<array>.unique(..)` / `<array>.tailUnique(..)`

Generate an array with all duplicate elements removed.


### `<array>.cmp(..)`

```
<array>.cmp(<other>)
  -> <bool>
```

Compare `<array>` to `<other>`.

This will return `true` if:
- `<array>` === `<other>` or,
- lengths are the same and,
- values on the same positions are equal.


### `<array>.setCmp(..)`

### `<array>.sortAs(..)`

### `<array>.inplaceSortAs(..)`

### `<array>.toKeys(..)`

### `<array>.toMap(..)`

### `Array.zip(..)` / `<array>.zip(..)`

### `Array.iter(..)` / `<array>.iter()`

Return an iterator/generator from the current array.

This is mostly useful in combination with the [Generator extensions and utilities](#generator-extensions-and-utilities)


### Abortable `Array` iteration

A an alternative to `Array`'s `.map(..)` / `.filter(..)` / .. methods with ability to
stop the iteration process by `throw`ing `StopIteration`.

```javascript
var {StopIteration} = require('ig-types/Array')
```

This can be used in two ways:

1) `throw` as-is to simply stop...
    ```javascript
    ;[1,2,3,4,5]
        .smap(function(e){ 
            // simply abort here and now...
            throw StopIteration })
    ```
    Since we aborted the iteration without passing any arguments to `StopIteration`,
    `.smap(..)` will return `undefined`.

2) `throw` an instance and return the argument...
    ```javascript
    // this will print "4" -- the value passed to StopIteration...
    console.log([1,2,3,4,5]
        .smap(function(e){ 
            if(e > 3){
              // NOTE: new is optional here...
              //    ...StopIteratiom is an object.js constructor.
              throw new StopIteration(e) } }))
    ```

Note that no partial result is returned unless passed through `StopIteration(..)`.


#### `array.StopIteration`

An exception that if raised while iterating via a supporting iterator method 
will abort further execution and correctly exit.


#### `<array>.smap(..)` / `<array>.sfilter(..)` / `<array>.sreduce(..)` / `<array>.sforEach(..)`

Like `Array`'s `.map(..)`, `.filter(..)`, `.reduce(..)` and `.forEach(..)` but 
with added support for aborting iteration by throwing `StopIteration`.


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

#### `array.StopIteration`

Like for [`<array>.smap(..)` and friends](#abortable-array-iteration) iteration 
can be stopped by throwing a `array.StopIteration` and as before there are 
two ways to go:

1) `throw` as-is to simply stop
    ```javascript
    ;[1,2,3,4,5]
        .mapChunks(function(e){ 
            // simply abort here and now...
            throw StopIteration })
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
              throw new StopIteration(e) } })
        .catch(function(e){
            console.log('first value greater than 3:', e) })
   ```


#### `<array>.CHUNK_SIZE`

The default iteration chunk size.

Note that the smaller this is the more _responsive_ the code is, especially 
in UI applications but there is a small overhead added per chunk.

Default value: `50`


#### `<array>.mapChunks(..)`

```
<array>.mapChunks(<func>)
<array>.mapChunks(<chunk-size>, <func>)
  -> <promise>

<func>(<item>, <index>, <array>)
  -> <new-item>
```

```
<array>.mapChunks([<func>, <chunk-handler>])
<array>.mapChunks(<chunk-size>, [<func>, <chunk-handler>])
  -> <promise>

<func>(<item>, <index>, <array>)
  -> <new-item>

<chunk-handler>(<chunk>, <result>, <offset>)
```


#### `<array>.filterChunks(..)`

#### `<array>.reduceChunks(..)`


### `Array` (polyfill)

#### `<array>.flat()`

#### `<array>.includes()`


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

```
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

#### `Generator`

#### `generator.iter(..)`


### Generator instance iteration

#### `<generator>.map(..)` / `<generator>.filter(..)` / `<generator>.reduce(..)` / `<generator>.flat()`

#### `<generator>.promise()`

#### `<generator>.then(..)` / `<generator>.catch(..)` / `<generator>.finally(..)`

#### `<generator>.toArray()`


### Generator constructor iteration

```javascript
var sumOdds = generator.iter
    .filter(function(e){
        return e % 2 == 1 })
    .reduce(function(r, e){ 
        return r + e }, 0)
    .pop()

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

#### `Generator.at(..)`

#### `Generator.shift()` / `Generator.pop()`

#### `Generator.slice(..)`

This is like `Array`'s `.slice(..)` but does not support negative indexes.

#### `Generator.map(..)` / `Generator.filter(..)` / `Generator.reduce(..)` / `Generator.flat()`

#### `Generator.toArray()`

#### `Generator.then(..)` / `Generator.catch(..)` / `Generator.finally(..)`


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

```
<unique-key-map>.reset(<key>, <item>)
    -> <unique-key-map>

<unique-key-map>.reset(<key>, <item>, true)
    -> <new-key>
```

Add an `<item>` to `<unique-key-map>`.

If `<key>` already exists then add an index to it to make it unique.

Key updating is done via [`<unique-key-map>.__key_pattern__`](#unique-key-map__key_pattern__).


#### `<unique-key-map>.reset(..)`

```
<unique-key-map>.reset(<key>, <item>)
    -> <unique-key-map>
```

Explicitly write an `<item>` under `<key>` as-is, this is like `Map`'s `.set(..)`.

#### `<unique-key-map>.rename(..)`

```
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

## Runner

```javascript
var runner = require('ig-types/runner')
```


### `runner.Queue(..)` / `runner.Queue.run(..)`

#### `<queue>.state`

#### `<queue>.start(..)`

#### `<queue>.pause(..)`

#### `<queue>.abort(..)`


#### `<queue>.on(..)` / `<queue>.one(..)`

####  `<queue>.off(..)`

#### `<queue>.trigger(..)`

Trigger an event.

#### `<queue>.taskCompleted(..)` (event)

Event, triggered when a task is completed passing in its result.




## License

[BSD 3-Clause License](./LICENSE)

Copyright (c) 2020, Alex A. Naanou,  
All rights reserved.


<!-- vim:set ts=4 sw=4 spell : -->
