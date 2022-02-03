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
- test files used un-declared global functions
- it needed a separate binary to run tests
- the browser output couldn't refresh after bundling

I wanted to create something that was declarative, minmalist, unobtrusive, and got the job done.

## Features

### The Test Suite doesn't depend on the library

One thing you might notice about the example test suite - it doesn't depend on any imports from DMT at all! This is by design.

Test suites are just a javascript object of a certain shape. This means your usual tooling will work (ie, typechecking) and you're free to generate and compose test suites in whatever way you seem fit.

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