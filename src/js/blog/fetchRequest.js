import { URL } from './constants.js';

export const loadPosts = async (
  page = 1,
  { renderPosts, renderPagination },
) => {
  const params = new URLSearchParams({
    page,
    per_page: 12,
  });
  const postsUrl = `${URL}posts?${params}`;

  try {
    const response = await fetch(postsUrl);

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
