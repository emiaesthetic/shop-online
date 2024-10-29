import { loadPosts } from '../services/api.js';
import { renderMenu } from '../components/menu.js';
import { renderPosts } from '../components/post-card.js';
import { renderPagination } from '../components/pagination.js';

export const renderBlogPage = () => {
  if (!document.querySelector('#blogPage')) return;

  renderMenu();

  const paramsFromUrl = new URLSearchParams(window.location.search);
  const pageNum = paramsFromUrl.has('page') ? +paramsFromUrl.get('page') : 1;

  loadPosts(pageNum, { renderPosts, renderPagination });
};
