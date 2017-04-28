import request from 'request-promise-native';

function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

export const API = b();

const middleware = (urlBase, { beforeRequest }) => ({ dispatch, getState }) => next => action => {
  if (action.type !== API) {
    return next(action);
  }

  if (typeof beforeRequest === 'function') {
    action = beforeRequest(dispatch, getState, action);
  }

  if (typeof action.onProgress === 'function') {
    action.onProgress(dispatch, getState, action);
  }

  const options = {
    method: action.method || 'GET',
    headers: action.headers,
    uri: `${urlBase}${action.url}`,
    json: true,
  };

  if (action.data) {
    options.body = action.data;
  }

  return request(options)
    .then(data => action.onSuccess && action.onSuccess(dispatch, getState, data))
    .catch(err => action.error && action.error(dispatch, getState, err))
}

export default middleware;
