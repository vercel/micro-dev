# micro-dev

This command line interface provides a belt full of tools that make building microservices using [micro](https://github.com/zeit/micro) a breeze! It's only meant to be used in development, **not in production** (that's where [micro](https://github.com/zeit/micro) comes in).

Things this package handles for you:

- Hot code reloading
- Logs for incoming and outgoing requests
- JSON bodies are logged in a beautiful way
- The local address is pasted to the clipboard automatically
- Automatic detection and use of an open port
- Network address shown in addition to local one
- Calculates and shows request duration
- Prettifies the `Error` object if any exceptions are thrown

## Usage

Firstly, add the package to your project's `devDependencies`:

```bash
npm install -D micro-dev
```

Now add a new sub property to `scripts` inside `package.json`:

```json
"scripts": {
  "dev": "micro-dev"
}
```

As the final step, start the development server:

```bash
npm run dev
```

## Caught a Bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Move into the directory of the clone: `cd micro-dev`
3. Link it to the global module directory of Node.js: `npm link`

Inside the project where you want to test your clone of the package, you can now either use `npm link micro-dev` to link the clone to the local dependencies or run `micro-dev` right in your terminal.

## Authors

- Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo)) - [▲ZEIT](https://zeit.co)
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))
