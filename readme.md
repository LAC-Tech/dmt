A declarative, minimalist testing library for the browser. The API is one function, that takes a simple data structure that is the test suite. No need for special setup, teardown etc methods when you have objects and closures already. It can automatically run on the browser after webpack is done rebuilding, so it's good for running tests on phones.

Example:

```html
<script type="module">
  import dmt from "https://unpkg.com/@lewis-campbell/dmt"

  const tests = {
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
    },
    'Promise': {
      'resolve()': async () => {
        const actual = await Promise.resolve('Success')
        return {check: actual, equals: 'Success'}
      }
    }
  }

  dmt(document.body, tests)
</script>
```