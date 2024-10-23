import { loadPost } from './render.js';

const init = () => {
  if (document.querySelector('.article')) {
    const paramsFromUrl = new URLSearchParams(window.location.search);
    const postID = paramsFromUrl.get('id');
    loadPost(postID);
  }
};

init();
