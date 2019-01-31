'use strict';

const yodasws = {};

(function(yodasws) {

  // Declare each property/method only once
  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  // Collection of app pages
  const pages = {};

  // Page Constructor
  ensure(yodasws, 'page', () => {
    return new (function() {
      return function Page(pageName) {
        // this = yodasws
        return ensure(pages, pageName, () => {
          return {
            name: pageName,
            controller() {
              return this;
            },
            setRoute() {
              return this;
            },
          };
        });
      };
    })()
  });
})(yodasws);

console.log('pageHome:', yodasws.page('pageHome'));
console.log('setRoute:', yodasws.page('pageHome').setRoute({
  route: '/',
  templateUrl: 'pages/home/home.html',
}));

yodasws.page('pageHome')
  .setRoute({
    route: '/',
    templateUrl: 'pages/home/home.html',
  }).controller(() => {
  });
