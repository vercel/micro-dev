# `micro` Isn't Installed As A Peer Dependency

#### Why This Error Occurred

`micro-dev` expects `micro` to be installed as well. It doesn't install its own copy, or duplicate the utility of `micro`! Since projects using `micro-dev` will typically use `micro` in production depending on it as a peer helps avoid unexpected changes in behavior later.

#### Possible Ways to Fix It

##### Install `micro` as a dependency
`npm install micro` in your project. If you intend to use `micro` in production (e.g. to power a microservice) you'll need to do this eventually anyway.

##### Install `micro` as a dev dependency
`npm install --save-dev micro` in your project. If you're using `micro` strictly as a development utility (e.g. to locally simulate configured logic later managed by a builder, like `now.json` routes) then consider `micro` as a dev dependency.
