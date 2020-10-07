# types.js

A library of JavaScript type extensions, types and type utilities.

- [types.js](#typesjs)
  - [Built-in type extenstions](#built-in-type-extenstions)
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
    - [`UniqueKeyMap()` (`Map`)](#uniquekeymap-map)
      - [`<unique-key-map>.reset(..)`](#unique-key-mapreset)
      - [`<unique-key-map>.uniqueKey(..)`](#unique-key-mapuniquekey)
      - [`<unique-key-map>.rename(..)`](#unique-key-maprename)
      - [`<unique-key-map>.keysOf(..)`](#unique-key-mapkeysof)

## Built-in type extenstions

### `Object`

#### `Object.deepKeys(..)`

#### `Object.match(..)`

#### `Object.matchPartial(..)`

#### `Object.flatCopy(..)`

#### `<object>.run(..)`


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

### `UniqueKeyMap()` (`Map`)

`UniqueKeyMap` extends the `Map` constructor.

XXX

For more info on `Map` see:  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

#### `<unique-key-map>.reset(..)`

#### `<unique-key-map>.uniqueKey(..)`

#### `<unique-key-map>.rename(..)`

#### `<unique-key-map>.keysOf(..)`




<!-- vim:set ts=4 sw=4 spell : -->