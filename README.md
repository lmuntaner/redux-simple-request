# Redux Simple Request

Middleware for [Redux](http://redux.js.org) to manage requests.

Works in the server as in the browser.

### Install

```
npm install redux-simple-request
```

### Add to Redux Store

```javascript
// ...
import createApiMiddleware from 'redux-simple-request';

// ...

const apiMiddleware = createApiMiddleware();

export default createStore(
  reducer,
  applyMiddleware(apiMiddleware)
);
```

- Import the creator: `import createApiMiddleware from 'redux-simple-request';`.
- Create middleware: `const apiMiddleware = createApiMiddleware();`. Options can be passed. Check [Advanced](#advanced).
- Add to Store: `applyMiddleware(apiMiddleware)`.

### Usage

The most simple usage with Action Creators.

```javascript
import { API } from 'redux-simple-request';

const addUsers = (users) => ({
  type: 'addUsers',
  data: users,
});

const fetchUsers = () => ({
  type: API,
  url: 'www.my-url.com/users',
  onSuccess: (users, dispatch) => {
    return dispatch(addUsers(users));
  }
});
```

This example will make a request to `www.my-url.com/users`.

Then it will dispatch the `addUsers` action with the response data.

### Action Properties

| Property | Mandatory? | Type | Description |
| -------- | ---------- | ---- | ----------- |
| type      | Yes | `string` | You have to use the API constant that you import from the package |
| url      | Yes | `string` | Just give it the url where you want to make your request |
| method | No | `string` | HTTP Method for the request. Default `GET` |
| data | No | `object` | Data that needs to be sent with the request |
| headers | No | `object` | Headers for the request |
| onSuccess | No | `function` | This function will be called if the request is successful. `onSuccess(data, dispatch, getState)`. Parameters passed are the response data, dispatcher and getState |
| onError | No | `function` | This function will be called if the request is not successful. `onError(error, dispatch, getState)`. Parameters passed are the error, dispatcher and getState |
| onProgress | No | `function` | This function will be called before making the request. `onProgress(action, dispatch, getState)`. Parameters passed are the action, dispatcher and getState |

Plus all the additional properties that can be used with [Request](https://github.com/request/request#requestoptions-callback)

### Advanced

`createApiMiddleware()` expects an options object.

| Property      | Mandatory? | Type | Description |
| ------------- | ---------- | -----| ----------- |
| beforeRequest | No | `function` | This function will be called for every request. Before the onProgress. `beforeRequest(action, dispatch, getState)`. Parameters are the action, dispatcher and getState |

**Use cases**

- Add the base url to `action.url`.
- Add specific headers or query params to url when user is logged in.
