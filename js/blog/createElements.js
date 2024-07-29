export const createPost = (index, obj) => {
  const postWrapper = document.createElement('li');
  postWrapper.classList.add('blog__item');

  const post = document.createElement('article');
  post.classList.add('card');
  post.innerHTML = `
    <img
      class="card__image"
      src="https://loremflickr.com/400/400?${index}"
      alt="" width="195" height="195" loading="lazy"
    >
    <h2 class="card__title">
      <a
        class="card__link
        article-link"
        href="article.html?id=${obj.id}">${obj.title.slice(0, 50).trim()}...
      </a>
    </h2>
  `;

  postWrapper.append(post);
  return postWrapper;
};

export const createPageNum = (list, pageNum) => {
  const item = document.createElement('li');
  item.classList.add('pagination__item');

  const link = document.createElement('a');
  link.classList.add('pagination__link', 'page-num');
  link.textContent = pageNum;
  link.href = pageNum === 1 ? 'blog.html' : `blog.html?page=${pageNum}`;

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
