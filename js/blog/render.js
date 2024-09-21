import {createPost, createPageNum, createDottedLine} from './createElements.js';

const renderPosts = (data) => {
  const listWrapper = document.querySelector('.blog__list');
  listWrapper.innerHTML = '';

  data.forEach((item, index) => {
    const post = createPost(index, item);
    listWrapper.append(post);
  });
};

const updateArrowsState = (pageCount, currentPage) => {
  const [prevArrow, nextArrow] = document.querySelectorAll('.arrow');

  if (currentPage === 1) {
    prevArrow.classList.add('disabled');
  } else {
    prevArrow.classList.remove('disabled');
    prevArrow.href = `blog.html?page=${currentPage - 1}`;
  }

  if (currentPage === pageCount) {
    nextArrow.classList.add('disabled');
  } else {
    nextArrow.classList.remove('disabled');
    nextArrow.href = `blog.html?page=${currentPage + 1}`;
  }
};

const updatePaginationState = (currentPage) => {
  const links = document.querySelectorAll('.page-num');

  links.forEach((link) => {
    link.classList.toggle('active', currentPage === +link.textContent);
  });
};

const renderPagination = (pageCount, currentPage) => {
  const firstPage = 1;
  const visiblePages = 3;
  const lastVisiblePages = pageCount - visiblePages + 1;

  const list = document.createElement('ul');
  list.classList.add('pagination__list');

  if (pageCount <= visiblePages) {
    for (let page = 1; page <= visiblePages; page++) {
      createPageNum(list, page);
    }
  } else if (currentPage <= visiblePages) {
    for (let page = 1; page <= visiblePages + 1; page++) {
      createPageNum(list, page);
    }
    createDottedLine(list, pageCount);
  } else if (lastVisiblePages <= currentPage) {
    createDottedLine(list, firstPage);
    for (let page = lastVisiblePages; page <= pageCount; page++) {
      createPageNum(list, page);
    }
  } else {
    createDottedLine(list, firstPage);
    for (let page = currentPage - 1; page <= currentPage + 1; page++) {
      createPageNum(list, page);
    }
    createDottedLine(list, pageCount);
  }

  const paginationWrapper = document.querySelector('.pagination');
  paginationWrapper.firstElementChild.after(list);

  updatePaginationState(currentPage);
  updateArrowsState(pageCount, currentPage);
};

export const loadPosts = async (page = 1) => {
  const postsUrl = `
    https://gorest.co.in/public/v2/posts?page=${page}&per_page=12
  `;
  const response = await fetch(postsUrl);
  const posts = await response.json();
  const pageCount = Number(response.headers.get('X-Pagination-Pages'));

  renderPosts(posts);
  renderPagination(pageCount, page);
};
