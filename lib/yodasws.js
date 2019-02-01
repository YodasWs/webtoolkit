'use strict';

(function(window) {
  // Declare each property/method only once
  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  const yodasws = ensure(window, 'yodasws', Object);

  function Component(componentName) {
    return ensure(components, componentName, () => {
      return Object.assign(this, {
        name: componentName,
      });
    });
  };
  Object.defineProperties(Component.prototype, {
    controller: {
      value() {
        return this;
      },
      enumerable: true,
    },
    setRoute: {
      value() {
        console.log('route has been set');
        return this;
      },
      enumerable: true,
    },
    init: {
      value() {
        return this;
      },
      enumerable: true,
    },
  });

  // A Page is a Component that's automatically bound to <main>
  function Page(pageName) {
    return ensure(pages, pageName, () => {
      Component.call(this);
      return Object.assign(this, {
        name: pageName,
      });
    });
  };
  Page.prototype = Object.create(Component.prototype);
  Object.defineProperties(Page.prototype, {
    constructor: {
      value: Page,
      enumerable: false,
      writable: true,
    },
  });

  // Collection of app components
  const components = {};
  ensure(yodasws, 'component', () => (...args) => new Component(...args));

  // Collection of app pages
  const pages = {};
  ensure(yodasws, 'page', () => (...args) => new Page(...args));

  Object.defineProperties(yodasws, {
    pages: {
      value: pages,
    },
  });

  // Non-DOM Global Event Target
  // TODO: Have Component Inherit from eventTarget
  const eventTarget = new EventTarget();
  Object.defineProperties(eventTarget, {
    on: {
      value(type, cb) {
        console.log('I\'m listening!');
        this.addEventListener(type, cb);
      },
    },
    fire: {
      value(type, detail = null) {
        this.dispatchEvent(new CustomEvent(type, {
          detail,
        }));
      },
    },
  });

  eventTarget.on('hello-world', () => {
    console.log('Hello World', Date.now());
  });

  let i = 0;
  const interval = setInterval(() => {
    eventTarget.fire('hello-world');
    if (++i >= 10) clearInterval(interval);
  }, 1000);

})(window);

yodasws.page('pageHome')
  .setRoute({
    route: '/',
    templateUrl: 'pages/home.html',
  }).controller(() => {
  });
