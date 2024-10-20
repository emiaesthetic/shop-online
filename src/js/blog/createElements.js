export const createPost = ({ id, title }, index) => {
  const post = document.createElement('article');
  post.classList.add('post-card');
  post.innerHTML = `
    <div class="post-card__image">
      <img
        src="https://loremflickr.com/400/400?${index}"
        alt="" width="195" height="195" loading="lazy"
        aria-hidden="true"
      >
    </div>

    <div class="post-card__content">
      <h2 class="post-card__title">
        <a class="post-card__link" href="article.html?id=${id}">
          ${title}
        </a>
      </h2>
    </div>
  `;

  return post;
};

export const createPageNum = (list, pageNum) => {
  const item = document.createElement('li');
  item.classList.add('pagination__item');

  const link = document.createElement('a');
  link.classList.add('pagination__link', 'page-num');
  link.textContent = pageNum;
  link.href = pageNum === 1 ? 'blog.html' : `blog.html?page=${pageNum}`;
  link.ariaLabel = `Страница номер ${pageNum}`;

  item.append(link);
  list.append(item);
};

export const createDottedLine = (list, pageNum) => {
  const dottedLine = document.createElement('span');
  dottedLine.classList.add('pagination__dotted-line');
  dottedLine.textContent = '...';

  const item = document.createElement('li');
  item.classList.add('pagination__item');
  item.append(dottedLine);

  if (pageNum === 1) {
    createPageNum(list, pageNum);
    list.append(item);
  } else {
    list.append(item);
    createPageNum(list, pageNum);
  }
};
