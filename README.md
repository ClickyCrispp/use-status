
# <em><b>useStatusHook</b></em>

This is a React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) for Status Enums

## Features

- 📜 Supports (Tested on 4.1+) [TypeScript](https://www.typescriptlang.org) type definition.
- 🦔 Tiny size. No external dependencies, aside for the `react`;

## Requirement

To use `use-status-hook`, you must use `react@16.8.0` or greater which includes hooks.

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/use-status-hook).

```sh
$ yarn add use-status-hook
# or
$ npm install --save use-status-hook
```

## Usage

Here are some minimal examples of how does it work. 

## API

```js
const [state, handle] = useStatusHook(defaultValue, overrideActionsList);
```

### Basic Use Case
```js
import useStatusHook from "use-status-hook";

const App = () => {
	const [state, handle] = useStatusHook();

	// Set current state like so
	React.useEffect(() => {
		handle.onReady();
	}, []);
	
	const submit = () => {
		handle.onLoading();
		// Do something
		handle.onSuccess();
	}
	return (
	  <div>
		<button onClick={submit}>
			Test Submission
		</button>
		
	    {state.isReady && 'Ready Case'}
	    {state.isLoading && 'Loading Case'}
        {state.isSuccess && 'Success Case'}
	  </div>
	);
};
```

### Advanced Use Case
```js
import useStatusHook, { DEFAULT_ACTIONS }  from "use-status-hook";

/*
* Extend actions like so
* Note: typescripts 'as const' is necessary here to get proper type completion
**/
const extendActions = [...DEFAULT_ACTIONS, 'exploding'] as const;  // <---

const App = () => {
	const [state, handle] = useStatusHook('exploding', extendActions); // <---

	// Set current state like so
	React.useEffect(() => {
		handle.onReady();
	}, []);
	
	const explode = () => {
		handle.onLoading();
		// Do something
		handle.onExploding(); // <---
	}
	return (
	  <div>
		<button onClick={explode}>
			Test Explosion
		</button>
		
	    {state.isReady && 'Ready Case'}
	    {state.isLoading && 'Loading Case'}
        {state.isExploding && 'Success Case'} // <---
	  </div>
	);
};
```


### Return object


```js
const [state, handle] = useStatusHook(defaultValue, overrideActionsList);

state = { is<Action>: boolean }
handle =  { on<Action>: () => void }
```

## Contributors ✨
Just me

