# types.js

A library of JavaScript type extensions, types and type utilities.

- [types.js](#typesjs)
  - [Installation](#installation)
  - [Basic usage](#basic-usage)
  - [Built-in type extensions](#built-in-type-extensions)
    - [`Object`](#object)
      - [`Object.deepKeys(..)`](#objectdeepkeys)
      - [`Object.match(..)`](#objectmatch)
      - [`Object.matchPartial(..)`](#objectmatchpartial)
      - [`Object.flatCopy(..)`](#objectflatcopy)
      - [`<object>.run(..)`](#objectrun)
    - [`Array`](#array)
      - [`<array>.first(..)` / `<array>.last(..)`](#arrayfirst--arraylast)
      - [`<array>.compact()`](#arraycompact)
      - [`<array>.len`](#arraylen)
      - [`<array>.toKeys(..)`](#arraytokeys)
      - [`<array>.toMap(..)`](#arraytomap)
      - [`<array>.unique(..)` / `<array>.tailUnique(..)`](#arrayunique--arraytailunique)
      - [`<array>.cmp(..)`](#arraycmp)
      - [`<array>.setCmp(..)`](#arraysetcmp)
      - [`<array>.sortAs(..)`](#arraysortas)
      - [`<array>.inplaceSortAs(..)`](#arrayinplacesortas)
      - [`<array>.mapChunks(..)`](#arraymapchunks)
      - [`<array>.filterChunks(..)`](#arrayfilterchunks)
      - [`<array>.reduceChunks(..)`](#arrayreducechunks)
    - [`Array` (polyfill)](#array-polyfill)
      - [`<array>.flat()`](#arrayflat)
      - [`<array>.includes()`](#arrayincludes)
    - [`Set`](#set)
      - [`<set>.unite(..)`](#setunite)
      - [`<set>.intersect(..)`](#setintersect)
      - [`<set>.subtract(..)`](#setsubtract)
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

To have access to library types and utilities:
```javascript
var types = require('ig-types')
```

`types.js` is organized so as to be able to import/extend only specific 
sub-modules mostly independently so...

In case there is a need to only extend a specific constructor:
```javascript
// require `ig-types/<constructor-name>`...
require('ig-types/Array')
```

And to import specific library modules only:
```javascript
var containers = require('ig-types/containers')
```

Note that though mostly independent now some sub-modules may import 
others in the future.


## Built-in type extensions

### `Object`

#### `Object.deepKeys(..)`

#### `Object.match(..)`

#### `Object.matchPartial(..)`

#### `Object.flatCopy(..)`

#### `<object>.run(..)`

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


### `Array`

#### `<array>.first(..)` / `<array>.last(..)`

Get or set the first/last items of `<array>`.


#### `<array>.compact()`

Generate a compact `<array>` from a sparse `<array>`, i.e. removing all
the empty slots.


#### `<array>.len`

Number of non-empty slots/elements in `<array>`.


#### `<array>.toKeys(..)`

#### `<array>.toMap(..)`

#### `<array>.unique(..)` / `<array>.tailUnique(..)`

Generate an array with all duplicate elements removed.

#### `<array>.cmp(..)`

#### `<array>.setCmp(..)`

#### `<array>.sortAs(..)`

#### `<array>.inplaceSortAs(..)`

#### `<array>.mapChunks(..)`

#### `<array>.filterChunks(..)`

#### `<array>.reduceChunks(..)`


### `Array` (polyfill)

#### `<array>.flat()`

#### `<array>.includes()`


### `Set`

#### `<set>.unite(..)`

#### `<set>.intersect(..)`

#### `<set>.subtract(..)`


### `Date`

#### `Date.timeStamp(..)`

#### `Date.fromTimeStamp(..)`

#### `Date.str2ms(..)`

#### `<date>.toShortDate(..)`

#### `<date>.getTimeStamp(..)`

#### `<date>.setTimeStamp(..)`


### `String`

#### `<string>.capitalize()`


### `RegExp`

#### `RegExp.quoteRegExp(..)`


## Containers

```javascript
var containers = require('ig-types').containers
```
or, to only import containers:
```javascript
var containers = require('ig-types/containers')
```

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



## License

[BSD 3-Clause License](./LICENSE)

Copyright (c) 2020, Alex A. Naanou,  
All rights reserved.


<!-- vim:set ts=4 sw=4 spell : -->