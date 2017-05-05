export default (action) => {
  const newOptions = {
    method: 'GET',
    uri: action.url,
    json: true,
  };

  const options = Object.assign({}, newOptions, action);
  delete options.url;
  delete options.type;

  if (action.headers) {
    options.headers = action.headers;
  }

  if (action.data) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.body = action.data;
  }

  return options;
};
