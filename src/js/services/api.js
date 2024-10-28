import { serverURL } from '../helpers/constants.js';

const sendRequest = async (
  path,
  { method = 'GET', headers, body, callback },
) => {
  try {
    const url = `${serverURL}${path}`;
    const options = {
      method,
    };

    if (headers) options.headers = headers;
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);

    const data = await response.json();
    if (callback) return callback(null, data);
  } catch (error) {
    return callback(error);
  }
};

export const loadData = async endpoint =>
  await sendRequest(endpoint, {
    callback: (error, data) => {
      if (error) {
        console.error(error);
        return;
      }
      return data;
    },
  });
