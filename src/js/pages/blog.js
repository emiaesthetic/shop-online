import { loadPosts } from '../services/api.js';
import { renderPosts } from '../components/post-card.js';
import { renderPagination } from '../components/pagination.js';

export const renderBlogPage = () => {
  if (!document.querySelector('#blogPage')) return;

  document.title = 'Блог - ShopOnline';

  const paramsFromUrl = new URLSearchParams(window.location.search);
  const pageNum = paramsFromUrl.has('page') ? +paramsFromUrl.get('page') : 1;
  loadPosts(pageNum, { renderPosts, renderPagination });
};
