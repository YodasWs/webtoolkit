yodasws
=======

You need to set the basic Route properties for each Page:

```javascript
yodasws.page('home').setRoute({
	template: 'pages/home.html',
	route: '/',
});
```

The Page allows for chaining:

```javascript
yodasws.page('AboutUs').setRoute({
	template: 'pages/AboutUs/AboutUs.html',
	route: '/AboutUs/',
}).on('load', () => {
	console.log('Page loaded!');
});
```
