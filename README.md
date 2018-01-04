# DOM Tennis 2k18
A browser game using HTML, CSS and [vanilla JavaScript](http://vanilla-js.com/).  
The goal of the game is to kick the ball with the cursor over and over without touching the floor.

The game is developed without using any game framework, nor using canvas neither WebGL, just for
the sake of testing the performance with the [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) at 60 fps.

[Play it now!](https://raohmaru.com/lab/game/dom-tennis-2k18/)

## Getting Started
You will need [node.js](https://nodejs.org/en/) v6.9.2 or greater installed on your machine.

Clone the repository, open the folder in the terminal and run the following commands:

- `npm install` (will install all dependencies listed at [package.json](https://github.com/raohmaru/DOM-Tennis-2k18/blob/master/package.json).
- `npm run build` (will generate game files at dist/ folder).

### Development
The entry point of the game is the file [src/index.html](https://github.com/raohmaru/DOM-Tennis-2k18/blob/master/src/index.html).
There we found all the screens of the game.

Some "modern" features of CSS are used, such [variables](https://www.w3.org/TR/css-variables/) and
[nesting](http://tabatkins.github.io/specs/css-nesting/). With the help of [PostCSS](http://postcss.org/),
compatible CSS is generated for old and current browsers.

JavaScript is written using features of [ECMAScript 2015+](https://github.com/lukehoban/es6features#readme)
and transpiled with [Babel](https://babeljs.io/). The game is rendered using the DOM and the HTML
elements are animated using CSS.

### Available npm commands
`npm run build`  
Generate CSS files and copies HTML and JS files to dist/ folder.

`npm run build:prod`  
Cleans dist/ folder, lints HTML, CSS and JS files, generate sCSS files and minifies all files into
dist/ folder.

`npm run lint`  
Lints HTML, CSS and JS files.

`npm run clean`  
Cleans dist/ folder.

`npm run watch`  
Watches for changes in src/ folder and runs the appropriate task when a file is modified.

`npm start`  
Starts a dev server at 127.0.0.1:8080 with path to dist/ folder.

## Browser Support
The game supports IE 11, Edge, Firefox 15+, Chrome 20+, Safari 8+.
In order to support older browsers, you need polyfills for the following JavaScript features:

- [Performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
- [window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### License
Released under the MIT license.
