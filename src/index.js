import requestPromise from 'request-promise-native';

function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

export const API = b();

const middleware = (request) => ({ beforeRequest } = {}) => ({ dispatch, getState }) => next => action => {
  if (action.type !== API) {
    return next(action);
  }

  if (typeof beforeRequest === 'function') {
    action = beforeRequest(action, dispatch, getState);
  }

  if (typeof action.onProgress === 'function') {
    action.onProgress(action, dispatch, getState);
  }

  const options = {
    method: action.method || 'GET',
    headers: action.headers,
    uri: action.url,
    json: true,
  };

  if (action.data) {
    options.body = action.data;
  }

  return request(options)
    .then(data => action.onSuccess && action.onSuccess(data, dispatch, getState))
    .catch(err => action.error && action.error(err, dispatch, getState))
}

export const configureMiddleware = middleware;

export default middleware(requestPromise);
