DMT is a declarative, minimalist testing library written in typescript.
There's one testing method, 'run', that takes a simple data structure that is itself the test suite. No need for special setup, teardown methods when you have objects and closures already.

It can be used directly in html:

```html
<script type="module">
  import dmt from "https://unpkg.com/@lewis-campbell/dmt"

  const clientTests =	{
    'Array': {
      '#indexOf()': {
        'should return -1 when the value is not present': () => ({
          check: [1, 2, 3].indexOf(4),
          equals: -1
        })
      }
    }
  }

  dmt.run(document.body, {client: clientTests})
</script>
```

Or you can have it built in a seperate module, using HMR or browsersync to re-run the tests each time code changes.