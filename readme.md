# micro-dev

[![Slack Channel](http://zeit-slackin.now.sh/badge.svg)](https://zeit.chat/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

This command line interface provides a belt full of tools that make building microservices using [micro](https://github.com/zeit/micro) a breeze! It's only meant to be used in development, **not in production** (that's where [micro](https://github.com/zeit/micro) comes in).

## Features

- **Hot Reloading:** When making changes to your code, the server will restart by itself
- **Logs:** Incoming and outgoing requests will be logged to `stdout`
- **Beautiful JSON:** When JSON bodies are logged, they're styled and prettified
- **Clipboard Support:** The local address is pasted to the clipboard automatically
- **Port Selection:** Automatic detection and use of an open port (if the specified one is in use)
- **Debug in Your Network:** The network address shown in addition to local one
- **Duraction Logs:** Calculates and shows the duration for each request
- **Pretty Errors:** Prettifies the `Error` object if any exceptions are thrown

## Usage

Firstly, add the package to your project's `devDependencies`:

```bash
npm install -D micro-dev
```

Now add a new `script` property below `micro` inside `package.json`:

```json
"scripts": {
  "start": "micro",
  "dev": "micro-dev"
}
```

As the final step, start the development server:

```bash
npm run dev
```

The production environment should be handled like [this](https://github.com/zeit/micro#usage).

## Caught a Bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Move into the directory of the clone: `cd micro-dev`
3. Link it to the global module directory of Node.js: `npm link`

Inside the project where you want to test your clone of the package, you can now either use `npm link micro-dev` to link the clone to the local dependencies or run `micro-dev` right in your terminal.

## Authors

- Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo)) - [▲ZEIT](https://zeit.co)
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))
