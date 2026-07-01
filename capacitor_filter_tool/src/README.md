# Source Directory

Application source code lives here.

Current layout:

```text
src/
  app/
  components/
  solver/
```

Keep numerical code independent from UI components so it can be tested and reused by workers.

Planned future layout:

```text
src/
  data/
  models/
  validation/
  workers/
```
