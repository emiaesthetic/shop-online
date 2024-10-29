const createPost = ({ id, title }, index) => {
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
