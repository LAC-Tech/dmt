# DMT - Declarative Minimalist Testing

DMT is a testing microframework for JavaScript. It's tiny, runs in the browser, and has a simple but powerful API.

Example:

```html
<script type="module">
  import dmt from "https://unpkg.com/@lewis-campbell/dmt"

  dmt(document.body, {
    'Promise': {
      '#resolve()': async () => {
        const actual = await Promise.resolve('Success')
        return {check: actual, equals: 'Success'}
      }
    },
    
    'Array': {
      '#indexOf()': {
        'should return -1 when the value is not present': () => ({
          check: [1, 2, 3].indexOf(4),
          equals: -1
        })
      },
      '#map()': {
        'should map [] to []': () => ({
          check: [].map(x => x * x),
          deepEquals: []
        })
      }
    }
  })
</script>
```

## Motivation

When I began practicing TDD in Javascript, my first instinct was to
use a popular framework like Mocha.

I hated it:
- test files use un-declared global functions
- needs a separate binary to run tests
- couldn't refresh the browser after bundling

I wanted to create something that was declarative, minmalist, unobtrusive, and got the job done.

## Features

### Declarative

DMT doesn't have global functions like `describe`, `beforeEach`, `afterEach` etc. In fact DMT only has one function - and it runs your tests. The tests themselves are simply trees represented by javascript objects, where the keys are descriptions and the leaf values are es6 arrow functions that return an assertion. This means that test files *do not need to reference this library*.

### Assertions built in 

I'm a simple man, and I really only need two assertions - 'equals' for primitives, and 'deepEquals' for arrays and objects. 

Check out the article [Rethinking Unit Test Assertions](https://medium.com/javascript-scene/rethinking-unit-test-assertions-55f59358253f) by Eric Elliot.

### Doesn't impose a workflow on you.

You decide, when, where, and how you run to tests by passing the test suite to the DMT function

There's no command line switches, or compatability plugins - it's a just a function that you can call whenever you want to

It can automatically run on the browser after webpack is done rebuilding, so it's good for running tests on phones.

## FAQ

### How do I do teardown and setup?

There are no need for special functions when you have objects and closures already.