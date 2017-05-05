import sinon from 'sinon';
import test from 'tape';

import middlewareCreator, { configureMiddleware, API } from '../src';

function createStore(sandbox) {
  const dispatchSpy = sandbox.spy();
  const getStateSpy = sandbox.spy();
  return {
    dispatch: dispatchSpy,
    getState: getStateSpy,
  };
}

function createLastStep(request, sandbox, options) {
  const storeSpy = createStore(sandbox);
  const middlewareCreatorConfigured = configureMiddleware(request);
  const middleware = middlewareCreatorConfigured(options);
  const nextSpy = sandbox.spy();

  return {
    lastStep: middleware(storeSpy)(nextSpy),
    storeSpy,
    nextSpy,
  };
}

test('Middleware', (t) => {
  t.test('import default', (t1) => {
    t1.equal(typeof middlewareCreator, 'function', 'is a function');
    const middleware = middlewareCreator();
    t1.equal(typeof middlewareCreator, 'function', 'should create a function when called');
    const lastStep = middleware({})();
    t1.equal(lastStep.length, 1, 'should create a last step expecting 1 parameter');
    t1.end();
  });

  t.test('configureMiddleware', (t1) => {
    t1.test('without beforeRequest parameter', (t2) => {
      t2.test('called with API Action Type and onSuccess', (t3) => {
        const sandbox = sinon.sandbox.create();
        const successSpy = sandbox.spy();
        const action = {
          type: API,
          url: 'someUrl.com',
          onSuccess: successSpy,
        };
        const data = {};
        const request = sandbox.stub().returns(Promise.resolve(data));
        const { lastStep, nextSpy, storeSpy } = createLastStep(request, sandbox);
        lastStep(action)
          .then(() => {
            t3.false(nextSpy.called, 'should not call next');
            t3.true(request.called, 'should call request');
            t3.false(storeSpy.dispatch.called, 'should not call dispatch');
            t3.false(storeSpy.getState.called, 'should not call getState');
            t3.true(successSpy.calledWith(data), 'should call success callback with API response');
            t3.true(true, 'last step returns a promise');
            sandbox.restore();
            t3.end();
          });
      });

      t2.test('called with API Action Type and onProgress', (t3) => {
        const sandbox = sinon.sandbox.create();
        const progressSpy = sandbox.spy();
        const action = {
          type: API,
          url: 'someUrl.com',
          onProgress: progressSpy,
        };
        const request = sandbox.stub().returns(Promise.resolve());
        const { lastStep } = createLastStep(request, sandbox);
        lastStep(action);
        t3.true(progressSpy.calledWith(action), 'should call progress callback with action');
        sandbox.restore();
        t3.end();
      });

      t2.test('called not API Action Type', (t3) => {
        const sandbox = sinon.sandbox.create();
        const action = {
          type: 'notAPI',
        };

        const request = sandbox.spy();
        const { lastStep, nextSpy } = createLastStep(request, sandbox);
        lastStep(action);
        t3.false(request.called, 'should not call request');
        t3.true(nextSpy.calledWith(action), 'should call next with action');
        sandbox.restore();
        t3.end();
      });
    });

    t1.test('with beforeRequest parameter', (t2) => {
      const sandbox = sinon.sandbox.create();
      const expectedOptions = {
        method: 'GET',
        uri: 'www.url.com/some/path',
        json: true,
      };
      const action = {
        type: API,
        url: '/some/path',
      };
      const beforeRequest = (passedAction) => {
        t2.true(action === passedAction, 'before request is called with action');
        action.url = 'www.url.com/some/path';
      };
      const request = sandbox.stub().returns(Promise.resolve());
      const { lastStep } = createLastStep(request, sandbox, { beforeRequest });
      lastStep(action)
        .then(() => {
          t2.true(request.calledWith(expectedOptions), 'should use action created by beforeRequest');
          sandbox.restore();
          t2.end();
        });
    });
  });
});
