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
  const middlewareCreator = configureMiddleware(request);
  const middleware = middlewareCreator(options);
  const nextSpy = sandbox.spy();

  return {
    lastStep: middleware(storeSpy)(nextSpy),
    storeSpy,
    nextSpy,
  }
}

test('Middleware', function (t) {
  t.test('import default', function(t) {
    t.equal(typeof middlewareCreator, 'function', 'is a function');
    const middleware = middlewareCreator();
    t.equal(typeof middlewareCreator, 'function', 'should create a function when called');
    const lastStep = middleware({})();
    t.equal(lastStep.length, 1, 'should create a last step expecting 1 parameter');
    t.end();
  });

  t.test('configureMiddleware', function(t) {
    t.test('without beforeRequest parameter', function(t) {
      t.test('called with API Action Type and onSuccess', function(t) {
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
            t.false(nextSpy.called, 'should not call next');
            t.true(request.called, 'should call request');
            t.false(storeSpy.dispatch.called, 'should not call dispatch');
            t.false(storeSpy.getState.called, 'should not call getState');
            t.true(successSpy.calledWith(data), 'should call success callback with API response');
            t.true(true, 'last step returns a promise');
            sandbox.restore();
            t.end();
          });
      });

      t.test('called with API Action Type and onProgress', function(t) {
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
        t.true(progressSpy.calledWith(action), 'should call progress callback with action');
        sandbox.restore();
        t.end();
      });

      t.test('called not API Action Type', function(t) {
        const sandbox = sinon.sandbox.create();
        const action = {
          type: 'notAPI',
        }

        const request = sandbox.spy();
        const { lastStep, nextSpy } = createLastStep(request, sandbox);
        lastStep(action);
        t.false(request.called, 'should not call request');
        t.true(nextSpy.calledWith(action), 'should call next with action');
        sandbox.restore();
        t.end();
      });
    });

    t.test('with beforeRequest parameter', function(t) {
      const sandbox = sinon.sandbox.create();
      const expectedOptions = {
        method: 'GET',
        uri: 'www.url.com/some/path',
        json: true,
      };
      const expectedAction = {
        type: API,
        url: 'www.url.com/some/path',
      };
      const action = {
        type: API,
        url: '/some/path',
      };
      const beforeRequestSpy = sandbox.stub().returns(expectedAction);
      const request = sandbox.stub().returns(Promise.resolve());
      const { lastStep } = createLastStep(request, sandbox, { beforeRequest: beforeRequestSpy });
      lastStep(action)
        .then(() => {
          t.true(beforeRequestSpy.calledWith(action), 'should call beforeRequest with action');
          t.true(request.calledWith(expectedOptions), 'should use action created by beforeRequest');
          sandbox.restore();
          t.end();
        })
    });
  });
});
