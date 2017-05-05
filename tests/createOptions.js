import test from 'tape';

import createOptions from '../src/createOptions';

test('createOptions function', (t) => {
  t.test('creates options properties', (t1) => {
    const url = 'someUrl';
    const expected = {
      uri: url,
      method: 'GET',
      json: true,
    };
    const action = {
      url,
      method: 'GET',
    };

    t1.deepEqual(createOptions(action), expected, 'should create uri, json and method property');
    t1.end();
  });

  t.test('when no method property', (t1) => {
    const action = {
      url: 'someUrl',
    };
    t1.equal(createOptions(action).method, 'GET', 'should add "GET" to method property');
    t1.end();
  });

  t.test('when headers property', (t1) => {
    const headers = {};
    const action = {
      url: 'someUrl',
      method: 'GET',
      headers,
    };
    t1.equal(createOptions(action).headers, headers, 'should add "headers" property');
    t1.end();
  });

  t.test('when data is in the action', (t1) => {
    const data = {};
    const action = {
      url: 'someUrl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };
    t1.deepEqual(createOptions(action).body, data, 'should add "body" property');
    t1.end();
  });

  t.test('when data is in the action but no Content-Type header', (t1) => {
    const data = {};
    const auth = 'SomethingCool';
    const action = {
      url: 'someUrl',
      method: 'POST',
      headers: {
        Authorization: auth,
      },
      data,
    };
    const options = createOptions(action);
    t1.equal(options.headers['Content-Type'], 'application/json', 'should add "Content-Type" header');
    t1.equal(options.headers.Authorization, auth, 'should keep passed headers');
    t1.end();
  });

  t.test('when additional properties', (t1) => {
    const qs = {};
    const action = {
      url: 'someUrl',
      method: 'GET',
      qs,
    };
    t1.equal(createOptions(action).qs, qs, 'should have additional property');
    t1.end();
  });
});
