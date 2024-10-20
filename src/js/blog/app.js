import { renderPosts, renderPagination } from './render.js';
import { loadPosts } from './fetchRequest.js';

const initBlog = () => {
  if (document.querySelector('.blog')) {
    const paramsFromUrl = new URLSearchParams(window.location.search);
    const pageNum = paramsFromUrl.has('page') ? +paramsFromUrl.get('page') : 1;

    loadPosts(pageNum, { renderPosts, renderPagination });
  }
};

initBlog();
