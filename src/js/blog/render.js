import {
  createPost,
  createPageNum,
  createDottedLine,
} from './createElements.js';

export const renderPosts = posts => {
  const postList = document.querySelector('.blog__list');
  postList.innerHTML = '';

  posts.forEach((item, index) => {
    const postWrapper = document.createElement('li');
    postWrapper.classList.add('blog__item');

    const post = createPost(item, index);

    postWrapper.append(post);
    postList.append(postWrapper);
  });
};

const updateArrowsState = (pageCount, currentPage) => {
  const [prevArrow, nextArrow] = document.querySelectorAll(
    '.pagination__link--arrow',
  );

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

const updatePaginationState = currentPage => {
  const links = document.querySelectorAll('.page-num');

  links.forEach(link => {
    link.classList.toggle('active', currentPage === +link.textContent);
  });
};

export const renderPagination = (pageCount, currentPage) => {
  const firstPage = 1;
  const visiblePages = 3;
  const lastVisiblePages = pageCount - visiblePages + 1;

  const list = document.createElement('ul');
  list.classList.add('pagination__list', 'list-reset');

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
