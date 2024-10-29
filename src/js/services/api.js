import { newsURL } from '../helpers/constants.js';

const sendRequest = async (
  baseURL,
  path,
  { method = 'GET', headers, body, callback },
) => {
  try {
    const URL = `${baseURL}${path}`;
    console.log(URL);
    const options = {
      method,
    };

    if (headers) options.headers = headers;
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(URL, options);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);

    const data = await response.json();
    if (callback) return callback(null, data);
  } catch (error) {
    return callback(error);
  }
};

export const loadData = async (baseURL, endpoint) =>
  await sendRequest(baseURL, endpoint, {
    callback: (error, data) => {
      if (error) {
        console.error(error);
        return;
      }
      return data;
    },
  });

export const loadPosts = async (
  page = 1,
  { renderPosts, renderPagination },
) => {
  const params = new URLSearchParams({
    page,
    per_page: 12,
  });
  const URL = `${newsURL}posts?${params}`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    renderPosts(posts);

    const pageCount = Number(response.headers.get('X-Pagination-Pages'));
    renderPagination(pageCount, page);
  } catch (error) {
    console.error('Error loading posts:', error);
  }
};
