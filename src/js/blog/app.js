import {loadPosts} from './render.js';

const init = () => {
  const paramsFromUrl = new URLSearchParams(window.location.search);
  const pageNum = paramsFromUrl.has('page') ? +paramsFromUrl.get('page') : 1;
  loadPosts(pageNum);
};

init();
