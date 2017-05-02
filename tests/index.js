import test from 'tape';

import middleware, { configureMiddleware, API } from '../src';

test('Middleware', function (t) {
  t.test('import default', function(t) {
    t.equal(typeof middleware, 'function', 'is a function');
    t.end();
  });

  t.test('import configureMiddleware', function(t) {
    const action = {
      type: API,
      url: 'someUrl.com',
      success: () => {},
    };
    const request = () => {
      return Promise.resolve();
    };
    const middlewareCreator = configureMiddleware(request);
    t.equal(typeof middlewareCreator, 'function', 'creates a function');
    const middleware = middlewareCreator();
    t.equal(typeof middleware, 'function', 'creates a function');
    const lastStep = middleware({})();
    lastStep(action)
      .then(() => {
        t.true(true, 'last step returns a promise');
        t.end();
      })
  });
})
