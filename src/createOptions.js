export default (action) => {
  const options = {
    method: action.method || 'GET',
    uri: action.url,
    json: true,
  };

  if (action.headers) {
    options.headers = action.headers;
  }

  if (action.data) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.body = action.data;
  }

  return options;
}
