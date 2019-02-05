'use strict';

(function(window) {
  // Define Global Object
  const yodasws = ensure(window, 'yodasws', () => {
    return new Proxy({}, superHandler([
      ComponentEventTarget,
    ].map(parent => new parent(...arguments))));
  });

  // Define Item Collections
  [
    'pages',
    'routes',
    'components',
  ].forEach((key) => {
    Object.defineProperty(yodasws, key, {
      value: {},
    });
  });

  // Define Class Hierarchy
  const objects = {
    component: {
      parent: Component,
      collection: 'components',
      parents: [
        ComponentEventTarget,
      ],
    },
    page: {
      parent: Page,
      collection: 'pages',
      parents: [
        Component,
        ComponentEventTarget,
      ],
    },
  };

  function Component(componentName) {
    Object.assign(this, {
      name: componentName,
    });
    return this;
  }
  Object.defineProperties(Component.prototype, {
    adapter: {
      value() {
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

  function Page(pageName) {
    Object.assign(this, {
    });
    return this;
  }
  Object.defineProperties(Page.prototype, {
    setRoute: {
      value(obj) {
        ensure(yodasws.routes, obj.route, () => new Route(obj));
        console.log('route has been set');
        return this;
      },
      enumerable: true,
    },
  });

  // Non-DOM Event Target
  function ComponentEventTarget() {
    const eventTarget = new EventTarget();
    Object.defineProperties(this, {
      on: {
        enumerable: true,
        value(type, cb) {
          console.log('I\'m listening!');
          eventTarget.addEventListener(type, cb);
          return this;
        },
      },
      fire: {
        enumerable: true,
        value(type, detail = undefined) {
          console.log('firing', type);
          eventTarget.dispatchEvent(new CustomEvent(type, {
            detail,
          }));
          return this;
        },
      },
    });
    return this;
  }

  function Route(obj) {
    return Object.assign(this, obj);
  }

  function superHandler(parents) {
    return {
      get: (target, key) => {
        const parent = parents.find(parent => {
          let obj = parent;
          do {
            if (Reflect.has(obj, key)) return true;
          } while (obj = Object.getPrototypeOf(obj));
          return false;
        });
        if (parent !== undefined) {
          return Reflect.get(parent, key);
        }
        return Reflect.get(target, key);
      },
      has: (target, key) => {
        if (Reflect.ownKeys(target).includes(key)) {
          return true;
        }
        return parents.find(parent => Reflect.has(parent, key));
      },
    };
  }

  // Build Class Hierarchy
  Object.entries(objects).forEach(([key, obj]) => {
    ensure(yodasws, key, () => (...args) => new (function () {
      return ensure(yodasws[obj.collection], args[0], () => new Proxy(
        new obj.parent(...arguments),
        superHandler(obj.parents.map(parent => new parent(...arguments))),
      ));
    })(...args));
  });

  let main;

  window.onload = () => {
    if (!window.location.hash) {
      history.replaceState(yodasws.routes['/'], undefined, '#/');
    }
    main = document.querySelector('main');
    window.onpopstate();
  };

  window.onpopstate = () => {
    const route = yodasws.routes[window.location.hash.replace('#', '')];
    console.log('route:', route);
    if (route.template) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (Math.floor(xhr.status / 100) === 2) {
            // Page Loaded
            main.innerHTML = xhr.response;
          } else switch (xhr.status) {
            case 404:
              // Page not found
              main.innerHTML = '<p>Page not found</p>';
          }
        }
      };
      xhr.open('GET', route.template);
      xhr.send();
    }
  };

  // Declare each property/method only once
  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  /*
  eventTarget.on('hello-world', () => {
    console.log('Hello World', Date.now());
  });

  let i = 0;
  const interval = setInterval(() => {
    eventTarget.fire('hello-world');
    if (++i >= 10) clearInterval(interval);
  }, 1000);
  /**/

})(window);
