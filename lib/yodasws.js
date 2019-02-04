'use strict';

(function(window) {
  // Define Global Object
  const yodasws = ensure(window, 'yodasws', Object);

  // Define Item Collections
  [
    'pages',
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
      parents: [
        ComponentEventTarget,
      ],
    },
    page: {
      parent: Page,
      parents: [
        Component,
        ComponentEventTarget,
      ],
    },
  };

  function Component(componentName) {
    return ensure(yodasws.components, componentName, () => {
      return Object.assign(this, {
        name: componentName,
      });
    });
  };
  Object.defineProperties(Component.prototype, {
    adapter: {
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

  function Page() {
    return ensure(yodasws.pages, arguments[0], () => {
      return Object.assign(this, {
      });
    });
  }
  Object.defineProperties(Page.prototype, {
  });

  // Non-DOM Event Target
  function ComponentEventTarget() {
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
    return eventTarget;
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
        if (Reflect.ownKeys(target).includes(key)) {
          return true;
        }
        return parents.find(parent => Reflect.has(parent, key));
      },
    };
  }

  window.onload = () => {
  };

  // Build Class Hierarchy
  Object.entries(objects).forEach(([key, obj]) => {
    ensure(yodasws, key, () => (...args) => new (function () {
      return new Proxy(new obj.parent(...arguments), superHandler(obj.parents.map((parent) => {
        return new parent(...arguments);
      })));
    })(...args));
  });

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

setTimeout(() => {
  console.log('components:', yodasws.components);
  console.log('pages:', yodasws.pages);
}, 0);

yodasws.page('pageHome')
  .setRoute({
    route: '/',
    templateUrl: 'pages/home.html',
  }).adapter(() => {
  });
