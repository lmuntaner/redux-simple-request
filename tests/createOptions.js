import test from 'tape';

import createOptions from '../src/createOptions';

test('createOptions function', function(t) {
  t.test('creates options properties', function(t) {
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

    t.deepEqual(createOptions(action), expected, 'should create uri, json and method property');
    t.end();
  });

  t.test('when no method property', function(t) {
    const action = {
      url: 'someUrl',
    };
    t.equal(createOptions(action).method, 'GET', 'should add "GET" to method property');
    t.end();
  });

  t.test('when headers property', function(t) {
    const headers = {};
    const action = {
      url: 'someUrl',
      method: 'GET',
      headers,
    };
    t.equal(createOptions(action).headers, headers, 'should add "headers" property');
    t.end();
  });

  t.test('when data is in the action', function(t) {
    const data = {};
    const action = {
      url: 'someUrl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data
    };
    t.deepEqual(createOptions(action).body, data, 'should add "body" property');
    t.end();
  });

  t.test('when data is in the action but no Content-Type header', function(t) {
    const data = {};
    const auth = 'SomethingCool';
    const action = {
      url: 'someUrl',
      method: 'POST',
      headers: {
        'Authorization': auth,
      },
      data
    };
    const options = createOptions(action);
    t.equal(options.headers['Content-Type'], 'application/json', 'should add "Content-Type" header');
    t.equal(options.headers['Authorization'], auth, 'should keep passed headers');
    t.end();
  });
});
