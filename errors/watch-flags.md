# Too Many Watch Flags

#### Why This Error Occurred

When you ran the `micro-dev` command with the `--cold` flag (which disables hot reloading), you've defined more flags that are also related to hot reloading. This is not allowed!

#### Possible Ways to Fix It

When using `--cold`, you cannot use `--watch` or `--poll`. To use one of the latter two flags, you need to enable hot reloading (leave the `--cold` flag away).
