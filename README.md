# Micro (Dev) — Asynchronous HTTP microservices

This command line interface provides a belt full of tools that make building microservices using [micro](https://github.com/vercel/micro) a breeze! It's only meant to be used in development, **not in production** (that's where [micro](https://github.com/vercel/micro) comes in).

## Features

-   **Hot Reloading:** When making changes to your code, the server will restart by itself
-   **Logs:** Incoming and outgoing requests will be logged to `stdout`
-   **Beautiful JSON:** When JSON bodies are logged, they're styled and prettified
-   **Clipboard Support:** The local address is pasted to the clipboard automatically
-   **Port Selection:** Automatic detection and use of an open port (if the specified one is in use)
-   **Debug in Your Network:** The network address shown in addition to local one
-   **Duration Logs:** Calculates and shows the duration for each request
-   **Pretty Errors:** Prettifies the `Error` object if any exceptions are thrown

## Usage

**Important:** This tool is only meant to be used in development. In production, you should use [micro](https://github.com/vercel/micro), which is much lighter and faster (and also comes without the belt of tools used when developing microservices).

When preparing your development environment, firstly install `micro-dev`:

```bash
npm install --save-dev micro-dev
```

**Note:** You'll need at least Node.js v7.6.0 to run `micro-dev`.

Next, add a new `script` property below `micro` inside `package.json`:

```json
"scripts": {
  "start": "micro",
  "dev": "micro-dev"
}
```

As the final step, start the development server like this:

```bash
npm run dev
```

## Debugging

The package can be used in conjunction with the Node.js inspector like this:

```json
"scripts": {
  "inspect": "node --inspect node_modules/.bin/micro-dev"
}
```

As the final step, start the development server like this:

```bash
npm run inspect
```

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Move into the directory of the clone: `cd micro-dev`
3. Link it to the global module directory of Node.js: `npm link`

Inside the project where you want to test your clone of the package, you can now either use `npm link micro-dev` to link the cloned source to your project's local dependencies or run `micro-dev` right in your terminal.

## Authors

-   Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo))
-   Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens)) - [Vercel](https://vercel.com)
