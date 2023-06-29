# webtoolkit
Gulp toolkit to quickly and easily set up a Single Page Application

## Initialization

Use the project as a repo template in GitHub [here](https://github.com/YodasWs/webtoolkit/generate).

Then run the following command line instructions:
```bash
yarn

vim package.json # to edit your project URLs, name, etc.

gulp init -n <site title>

gulp -? # to list all tasks the tool provides
```

## Build the Site
```bash
gulp
```

The default task will compile all the HTML, CSS, and JavaScript, then run a local HTTP server for you to view the results in your browser at http://localhost:3000/

While the server is running, any changes you make to the site files will automatically call the process to re-compile and then reload the page in your browser.

## Add Pages
```bash
gulp generate:page -n <page name> [-s <section name>]
```

This will build a new blank page for your site, with the following files:
```
src/pages/<page name>
src/pages/<page name>/<page name>.html
src/pages/<page name>/<page name>.scss
src/pages/<page name>/ctrl.js
```

Then when you run `generate:page` and include a `<section name>`, your page will be placed in a child folder inside the section folder:
```
src/pages/<section name>/<page name>
src/pages/<section name>/<page name>/<page name>.html
src/pages/<section name>/<page name>/<page name>.scss
src/pages/<section name>/<page name>/ctrl.js
```

### Sections

Sections are the basic way to organize similar pages together into a parent directory.

```bash
gulp generate:section -n <section name>
```

This creates a new blank page for your site, with the following files,

```
src/pages/<section name>
src/pages/<section name>/index.html
src/pages/<section name>/<section name>.scss
src/pages/<section name>/ctrl.js
```

If you want to add a page that doesn't require its own JavaScript or stylesheet files, you can simply add an extra HTML file in the section folder:
```
src/pages/<section name>/<page name>.html
```

The section route controller is already set up to open up the pages in the browser:

```
/#!/<section_name>/<page_name>/
```

## Page JavaScript
Each page has a JavaScript file that sets the route to load the page when requested and handle any other code you want called after the page is loaded:
```javascript
yodasws.page('pageFirst').setRoute({
	title: 'First Page',                // The title of the page to display in the browser title bar
	template: 'pages/first/first.html', // The page to the HTML page to load
	canonicalRoute: '/first/',          // The URL you want in the browser address bar
	route: '/first/?',                  // A RegExp string that will load this page when called in the address bar
}).on('load', () => {
	// Any JavaScript code you want called when the page loads in the browser
});
```

So for the above page code, going to `http://localhost:3000/#!/first` will load the page and the address will be updated to `http://localhost:3000/#!/first/`.

### Template Function
The route's `template` can be a function for greater control and flexibility than simply loading the same file for every route matched.

The parameters passed to the `template` function are the results of `window.location.hash.replace('#!', '').match(route)`.

The function is expected to either return a string giving the address of the HTML file to load, or an object that extends the route object and includes, at minimum,
the `template` key as a string.

```javascript
yodasws.page('pageFirst').setRoute({
	title: 'First Page',
	route: '/section-one(/.*)*',
	template(match, ...p) {
		return {
			canonicalRoute: '/section-one/' + p.filter(p => !!p).map(p => p.replace(/^\/+|\/+$/g, '')).join('/') + '/',
			template: 'pages/seciont-one/' + p.filter(p => !!p).map(p => p.replace(/^\/+|\/+$/g, '')).join('.') + '.html',
		};
	},
});
```

## Page JavaScript
Each page has a JavaScript file that sets the route to load the page when requested and handle any other code you want called after the page is loaded:
```javascript
yodasws.page('pageFirst').setRoute({
	title: 'First Page',                // The title of the page to display in the browser title bar
	template: 'pages/first/first.html', // The page to the HTML page to load
	canonicalRoute: '/first/',          // The URL you want in the browser address bar
	route: '/first/?',                  // A RegExp string that will load this page when called in the address bar
}).on('load', () => {
	// Any JavaScript code you want called when the page loads in the browser
});
```

So for the above page code, going to `http://localhost:3000/#!/first` will load the page and the address will be updated to `http://localhost:3000/#!/first/`.

### Template Function
The route's `template` can be a function for greater control and flexibility than simply loading the same file for every route matched.

The parameters passed to template function are the results of `window.location.hash.replace('#!', '').match(route)`.

The function is expected to either return a string giving the address of the HTML file to load, or an object that extends the route object and includes, at minimum,
the `template` key as a string.

```javascript
yodasws.page('pageFirst').setRoute({
	title: 'First Page',
	route: '/section-one(/.*)*',
	template(match, ...p) {
		return {
			canonicalRoute: '/section-one/' + p.filter(p => !!p).map(p => p.replace(/^\/+|\/+$/g, '')).join('/') + '/',
			template: 'pages/seciont-one/' + p.filter(p => !!p).map(p => p.replace(/^\/+|\/+$/g, '')).join('.') + '.html',
		};
	},
});
