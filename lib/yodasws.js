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

  // Component Class Definition
  function Component(componentName) {
    Object.assign(this, {
      name: componentName,
    });
    return this;
  }
  Object.defineProperties(Component.prototype, {
    adapter: {
      enumerable: true,
      value() {
        return this;
      },
    },
    init: {
      enumerable: true,
      value() {
        return this;
      },
    },
  });

  // Page Class Definition
  function Page(pageName) {
    Object.assign(this, {
    });
    return this;
  }
  Object.defineProperties(Page.prototype, {
    setRoute: {
      enumerable: true,
      value(obj) {
        ensure(yodasws.routes, obj.route, () => new Route(this.name, obj));
        return this;
      },
    },
  });

  // Route Class Definition
  function Route(pageName, obj) {
    return Object.assign(this, obj, {
      page: yodasws.page(pageName),
    });
  }

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

  function superHandler(parents) {
    return {
      get: (target, key) => {
        const parent = parents.find(parent => Reflect.has(parent, key));
        if (parent !== undefined) {
          return Reflect.get(parent, key);
        }
        return Reflect.get(target, key);
      },
      has: (target, key) => {
        return Reflect.has(target, key) || parents.find(parent => Reflect.has(parent, key)) !== undefined;
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

  // <main> Element
  let main;

  // Load First Route
  window.onload = () => {
    if (!window.location.hash) {
      history.replaceState(yodasws.routes['/'], undefined, '#/');
    }
    main = document.querySelector('main');
    window.onpopstate();
  };

  // Route Handling
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

})(window);
