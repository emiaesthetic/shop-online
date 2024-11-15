import { createImage, preloadImages } from './image.js';
import { removeLoader } from './loader.js';

const createPost = ({ id, title }, index) => {
  const { imageWrapper, image } = createImage({
    tag: 'div',
    className: 'post-card__image',
    src: `https://loremflickr.com/400/400?${index}`,
    width: 195,
    height: 195,
    alt: title,
  });

  const post = document.createElement('article');
  post.classList.add('post-card');
  post.innerHTML = `
    ${imageWrapper.outerHTML}
    <div class="post-card__content">
      <h2 class="post-card__title">
        <a class="post-card__link" href="article.html?id=${id}">
          ${title}
        </a>
      </h2>
    </div>
  `;

  return {
    post,
    image,
  };
};

export const renderPosts = async posts => {
  const postList = document.querySelector('.blog__list');
  postList.innerHTML = '';

  const images = [];
  posts.forEach((item, index) => {
    const postWrapper = document.createElement('li');
    postWrapper.classList.add('blog__item');

    const { post, image } = createPost(item, index);
    images.push(image);

    postWrapper.append(post);
    postList.append(postWrapper);
  });

  try {
    await preloadImages(images);
  } catch (error) {
    console.error(error);
  } finally {
    removeLoader();
  }
};
