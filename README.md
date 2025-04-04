<img src='./redux-current-logo.png' alt='Redux Current Logo' width='800' />

# redux-current

[![npm package][npm-badge]][npm]

A simple zero-configuration library that allows to use dependency injection in redux.

Utilizes redux context to split and enhance state as standard react providers do.

Does NOT require any middlewares or preconfigurations.

Also solves two of the react + redux main issues:
1. selecting data during list mapping
2. creating reusable smart-modules

# Getting started

## Install

```sh
$ npm install redux-current
```

or

```sh
$ yarn add redux-current
```

## Usage

```tsx
import { createInjectableSelector, CurrentProvider } from 'redux-current'
import type { IProduct } from './types';

// create a selector detached from store with no concrete value
export const selectProduct = createInjectableSelector<IProduct>()

const Sample = () => {
  return (
    <>
      {/* Provider injects given value into the redux state */}
      <CurrentProvider
        // injectable selector as a key for injection
        name={selectProduct}
        // a concrete value
        value={{ id: 123, name: 'Best product', price: 9.99 }}
        // a concrete selector may be used instead
        // value={selectMyProduct}
      >
        {/* nested elements can now query selectProduct for given value */}
        ...
      </CurrentProvider>

      {/* Mapper renderes every item a separate node */}
      <CurrentProvider.Mapper
        name={selectProduct}
        // a concrete array
        value={[{ id: 123, name: 'Best product', price: 9.99 }]}
        // or a concrete selector returning an array may be used instead
        // value={selectMyProductList}
      >
        {/* nested elements can now query selectProduct for given value */}
        ...
      </CurrentProvider.Mapper>
    </>
  )
}
```


# Step by step

## Basic Usage
Basic API allows you to declare a selector detached from store:

#### `selectors.ts`

```tsx
import { createInjectableSelector } from 'redux-current'

// declare an interface for data
type IProduct = {
  id: number
  name: string
  price: number
}

// create an abstract injectable selector
export const selectProduct = createInjectableSelector<IProduct>()

// derived selectors can then be created normally with or without reselect
export const selectProductTitle = (state) => selectProduct(state).name
export const selectProductPrice = (state) => selectProduct(state).price
```


Selectors can normally be queried with `react-redux`

#### `components.tsx`

```tsx
import { useSelector, connect } from 'react-redux'
import { selectProductTitle, selectProductPrice } from './selectors'

// selectors can be executed via useSelector
export const ProductTitleRC = () => {
  const title = useSelector(selectProductTitle);
  return (
    <div>
      Title: {title}
    </div>
  )
}

// or via connect
const Price = ({ value }) => <div>Price: {value} USD</div>;
export const ProductPriceRC = connect((state) => ({
  value: selectProductPrice(state)
}))(Price)

```

> NOTE: `~RC` postfix is an optional agreement to identify components with **R**edux **C**urrent

The selector can later be attached to a concrete value inside react

#### `Sample.tsx`

```tsx
import { CurrentProvider } from 'redux-current'
import { ProductPriceRC, ProductTitleRC } from './components'
import { selectProduct } from './selectors'

// use CurrentProvider to inject concrete value or selector in react context
const Sample = () => {
  return (
    <CurrentProvider
      name={selectProduct}
      value={{ id: 123, name: 'Best product', price: 9.99 }}
    >
      <ProductTitleRC />
      <ProductPriceRC />
    </CurrentProvider>
  )
}
// Will result in following markup:
//   <div>Title: Best product</div>
//   <div>Price: 9.99 USD</div>
```

`CurrentProvider` accepts `name` and `value` in a variety of different formats:

```tsx
import { generateCurrentKey } from 'redux-current';
// value can be a raw json
<CurrentProvider name={selectProduct} value={{ title: 'Best product', price: 9.99}} />
// a concrete selector
<CurrentProvider name={selectProduct} value={selectMyProduct} />
// or even an inline selector
<CurrentProvider name={selectProduct} value={() => ({ title: 'Best product', price: 9.99})} />

// key can be extracted from injectable selector .KEY field
<CurrentProvider name={selectProduct.KEY} value={selectMyProduct} />
// manually created by calling generateCurrentKey
const PRODUCT_KEY = generateCurrentKey();
<CurrentProvider name={PRODUCT_KEY} value={selectMyProduct} />
// or even a passed as a primitive value (not recommended as different keys may collide)
<CurrentProvider name="ProductKey" value={selectMyProduct} />

// NOTE, that custom keys must be manually attached to createInjectableSelector as second parameter
const selectProduct = createInjectableSelector(undefined, PRODUCT_KEY);


// There is also a shorthand for passing multiple values in a bulk
<CurrentProvider bulk={{ [selectProduct.KEY]: selectMyProduct }} />
```

## Advanced usage: Mapper
Sometimes we need to map lists of items, to do that, we usually write the following code:

```tsx
const getProductId = (product: IProduct) => product.id;

const SampleMapper = () => {
  // an ordinary list selector
  const products = useSelector(selectMyProductList)
  return products.map((product) => (
    <CurrentProvider
      name={selectProduct}
      value={product}
      // not to forget key when mapping jsx in react
      key={getProductId(product)}
    >
      ...
    </CurrentProvider>
  ));
}
```

But the code above can be greatly simplified using `CurrentProvider.Mapper`:

```tsx
// getProductId is passed as a first argument to calculate react key
const selectProduct = createInjectableSelector<IProduct>(
  (product) => product.id
);
const SampleMapper = () => {
  return (
    <CurrentProvider.Mapper
      name={selectProduct}
      value={selectMyProductList}
    >
      ...
    </CurrentProvider.Mapper>
  );
}
```

And just like basic `CurrentProvider`, we can pass `name` and `value` in variety of ways:

```tsx
// value can be an array of raw json
<CurrentProvider.Mapper name={selectProduct} value={[{ title: 'Best product', price: 9.99}]} />
// a concrete selector, that returns an array
<CurrentProvider.Mapper name={selectProduct} value={selectMyProductList} />
// or even an inline selector, that returns an array
<CurrentProvider.Mapper name={selectProduct} value={() => [{ title: 'Best product', price: 9.99}]} />

// or even a bulk, but name will become mandatory, since otherwise we lose track of id getter
<CurrentProvider.Mapper name={selectProduct} bulk={{ [selectProduct.KEY]: selectMyProductList }} />
```

## Advanced usage: reusable modules
As widely known, atomic-design introduces a concept of reusable molecule and organism-components.

The concept can be easily applied by `redux-current` syntactic-sugar API called `CurrentModule`.

First, declare desired input parameters by creating a module:
```tsx
const selectProduct = createInjectableSelector();
const ProductModule = createCurrentModule({
  product: selectProduct
})
```

Connected components can then be wrapped with a neatly typed module:
```tsx
// pass product as a concrete selector
<ProductModule product={selectMyProduct}>
  ...
</ProductModule>
// a raw json
<ProductModule product={{ title: 'Best product', price: 9.99}} />
// or an inline selector
<ProductModule product={() => ({ title: 'Best product', price: 9.99})} />
```

And same as `CurrentProvider`, modules also have a built-in Mapper:
```tsx
// that accepts a raw json array
<ProductModule.Mapper product={[{ title: 'Best product', price: 9.99}]} />
// a concrete selector returning an array
<ProductModule.Mapper product={selectMyProductList} />
// or even an inline selector returning an array
<ProductModule.Mapper product={() => [{ title: 'Best product', price: 9.99}]} />
```

However, there is an exception: if module is created from multiple injectables, the primary identifier must be passed explicitly:
```typescript jsx
// by default getId takes id ?? index as react key
const selectProduct = createInjectableSelector<IProduct>();
const onProductClick = createInjectableAction();
const selectDiscountedFlag = createInjectableSelector<boolean>();

const ProductModule = createCurrentModule({
  product: selectProduct,
  isDisconted: selectDiscountedFlag,
  onProductClick
}, { primary: 'product' }) // 'product' is explicitly marked as a field for mapping
```


# API
Table of contents
- [Basic API](#basic-api)
  - [`createInjectableSelectors`](#createinjectableselector)
  - [`createInjectableAction`](#createinjectableaction)
  - [`CurrentProvider`](#currentprovider)
  - [`CurrentProvider.Mapper`](#currentprovidermapper)
  - [`createCurrentModule`](#createcurrentmodule)
- [Low-level API](#lowlevel-api)
  - [`generateCurrentKey`](#generatecurrentkey)
  - [`composeCurrentKeySelector`](#composecurrentkeyselector)

## Basic API

### `createInjectableSelector`
```tsx
createInjectableSelector<T>(
  getId?: GetItemId <T>,
  KEY?: string | symbol
): Selector<T>
```

#### Parameters
- `getId` (GetItemId, optional): A function to calculate unique key based on concrete value
  - Defaults to: `(item: T, index: number) => item.id ?? number`
- `KEY` (string | symbol, optional): A key to store value in a hidden state field
  - Defaults to: `generateCurrentKey()`

#### GetItemId Type
```ts
type GetItemId = <DataType>(item: DataType, index: number) => PropertyKey
```

#### Returns
`(state: any) => DataType`: A selector to be attached to a concrete value

#### Description
Creates a selector detached from concrete value, that can later be reattached via Provider

#### Examples
```tsx
createInjectableSelector<IProduct>()
createInjectableSelector((product: IProduct) => product.id)

const KEY = generatCurrentKey();
createInjectableSelector<IProduct>(undefined, KEY)
```

----------------------------

### `createInjectableAction`
```tsx
createInjectableAction<Args, ReturnValue>(KEY?: string | symbol): (...args: Args) => ThunkAction<ReturnValue>

```
#### Parameters
- `KEY` (string | symbol, optional): A key to store value in a hidden state field
  - Defaults to: `generateCurrentKey()`

#### Returns
`(...args: Args): ThunkAction`: A detached redux thunk action that can be dispatched from store.

#### Description
Creates an action with no concrete implementation, that can later be provided via `CurrentProvider`

#### Examples
```tsx
const doSomething = createInjectableAction<{ foo: string }>()
dispatch(doSomething({ foo: 123 }));
```


----------------------------

### `<CurrentProvider/>`
```tsx
<CurrentProvider
  name={<KeyOrInjectable>}
  value={<ValueOrSelector>}
  bulk={<BulkValueOrSelector>}
>
  {<children>}
</CurrentProvider>
```

#### Parameters
- `name` (KeyOrInjectable, optional): A key to store value in a hidden state field
  - _Required if value is used_
- `value` (ValueOrSelector, optional):
  - Either value or bulk is required
- `bulk` (BulkValueOrSelector, optional):
  - Either value or bulk is required
- `children`: React children

#### KeyOrInjectable type
Injectables have a hidden KEY attached to them. When passed as selector, Provider extracts it
```ts
type KeyOrSelector = symbol | string | InjectableSelector<any>
```

#### ValueOrSelector type
If Selector is passed, Provider queries it with react-redux base api
```ts
type ValueOrSelector<DataType> = DataType | Selector<DataType>
```

#### BulkValueOrSelector type
```tsx
type BulkValueOrSelector<BulkValueType> = { [key in keyof BulkValueType]: ValueOrSelector<BulkValueType[key]> }
```

#### Description
Injects value or bulk values into redux state monkey patched and passed down to descending elements

Note that not only does provider pass value down the children components, but also into the thunked actions, so with redux-thunk, you can select and dispatch injectables.

#### Examples
```tsx
<CurrentProvider name={selectProduct} value={{ title: 'Best product', price: 9.99}} />
<CurrentProvider name={selectProduct} value={selectMyProduct} />
<CurrentProvider name={selectProduct} value={() => ({ title: 'Best product', price: 9.99})} />
<CurrentProvider name={selectProduct.KEY} value={selectMyProduct} />
<CurrentProvider name="ProductKey" value={selectMyProduct} />
```
-----

### `<CurrentProvider.Mapper/>`
```tsx
<CurrentProvider.Mapper
  name={<InjectableSelector>}
  value={<ArrayValueOrSelector>}
  bulk={<BulkMixedValueOrSelector>}
>
  {<children>}
</CurrentProvider.Mapper>
```

#### Parameters
- `name` (InjectableSelector): An injectable selector with key to store value in a hidden state field
- `value` (ArrayValueOrSelector, optional):
  - Either value or bulk is required
- `bulk` (BulkMixedValueOrSelector, optional):
  - Either value or bulk is required
- `children`: React children

#### KeyOrInjectable type
Injectables have a hidden KEY attached to them. When passed as selector, Provider extracts it
```ts
type KeyOrSelector = symbol | string | InjectableSelector<any>
```

#### ArrayValueOrSelector type
If Selector is passed, Provider queries it with react-redux base api
```ts
type ArrayValueOrSelector<DataType> = DataType[] | Selector<DataType[]>
```

#### BulkValueOrSelector type
```tsx
type BulkMixedValueOrSelector<BulkValueType> = { [key in keyof BulkValueType]: ValueOrSelector<BulkValueType[key] | BulkValueType[key][]> }
```

#### Description
For each value item - creates a `CurrentProvider` with injected value or bulk values into redux state monkey patched and passed down to descending elements

React keys are calculated based on `getId` from injectable passed in `name`

#### Examples
```tsx
<CurrentProvider.Mapper name={selectProduct} value={[{ title: 'Best product', price: 9.99}]} />
<CurrentProvider.Mapper name={selectProduct} value={selectMyProductList} />
<CurrentProvider.Mapper name={selectProduct} value={() => [{ title: 'Best product', price: 9.99}]} />
<CurrentProvider.Mapper
  name={selectProduct}
  value={selectMyProductList}
  bulk={{ [selectDiscount.KEY]: true }}
/>
<CurrentProvider.Mapper
  name={selectProduct}
  bulk={{
    [selectMyProduct.KEY]: selectMyProductList,
    [selectDiscount.KEY]: true
  }}
/>
```

-----

### `createCurrentModule`
```tsx
createCurrentModule<K>(
  injectables: Record<K, KeyOrInjectable>,
  options?: ModuleOptions
): React.FC<K>
```

#### Parameters
- `injectables` (Record<string | symbol, KeyOrInjectable>): A key-value record, where each injectable selector gets an alias as a key
- `options` (ModuleOptions, optional)
  - `primary` (string | symbol, optional): Mark one of the keys as primary for mapping using .Mapper API
    - Required for modules with more than one injectable if .Mapper usage is expected

#### KeyOrInjectable type
Injectables have a hidden KEY attached to them. When passed as selector, Provider extracts it
```ts
type KeyOrSelector = symbol | string | InjectableSelector<any>
```

#### Returns
`CurrentModule<K>` and `CurrentModule.Mapper<K>`

That accept `Record<K, ValueOrSelector<DataType>>` as arguments, and provide capabilities similar `CurrentProvider` and `CurrentProvider.Mapper`

Key marked as primary expects `ValueOrSelector<DataType[]>`

#### ValueOrSelector type
If Selector is passed, Provider queries it with react-redux base api
```ts
type ValueOrSelector<DataType> = DataType | Selector<DataType>
```

#### Description
A syntactic sugar on top of CurrentProvider to create a provider Module with predefined injectables and proper type-hinting.

#### Examples
```tsx
const selectProduct = createInjectableSelector()
const ProductModule = createCurrentModule({
  // product is an arbitrary key that will be used as prop in resulting module
  product: selectProduct
});
// fill product with concrete selector
<ProductModule product={selectMyProduct}>...</ProductModule>
// or a raw json value
<ProductModule product={{ title: 'Best product', price: 9.99}} />
// can also use a mapper
<ProuctModule.Mapper product={selectMyProductList}>...</ProuctModule.Mapper>
```
-----

### Low-level API
Unless you are creating a meta library, you probably do not need these methods

### `generateCurrentKey`
```tsx
generateCurrentKey(): symbol
```

#### Returns
KEY (symbol) A unique symbol that will be used to store and access The Current

#### Description
A method used in all other library methods to create a unique KEY.

#### Example
```tsx
const PRODUCT_KEY = generateCurrentKey();
```
----
### `composeCurrentKeySelector`
```tsx
composeCurrentKeySelector<T>(KEY: string | symbol, options: SelectorOptions): T
```

#### Parameters
- `KEY` (string | symbol): A key to store value in a hidden state field
- `options` (SelectorOptions, optional)
  - `__dangerouslySuppressError` (boolean, optional): should selector throw an error if current doesn't exist, defaults to false

#### Description
Creates a selector, that returns a concrete value or throws an error if given KEY is not injected

#### Examples
```tsx
const selectProduct = composeCurrentKeySelector(generateCurrentKey())
const selectProduct = composeCurrentKeySelector('productId')
const selectProduct = composeCurrentKeySelector(generateCurrentKey(), { __dangerouslySuppressError: true })
```
[//]: # (Work in progress)



## License

Copyright (c) 2025 Ivan Malyugin

Licensed under The MIT License (MIT).

[npm]: https://www.npmjs.org/package/redux-current
[npm-badge]: https://img.shields.io/npm/v/redux-current.svg?style=for-the-badge
