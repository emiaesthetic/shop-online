import { createImage } from './image.js';
import { serverURL, mediaQueries } from '../helpers/constants.js';
import {
  formatPrice,
  calculateDiscountPrice,
} from '../helpers/productUtils.js';

export const createCard = (
  { id, title, image: src, price, discount },
  titleTag = 'h3',
) => {
  const { imageWrapper, image } = createImage({
    tag: 'picture',
    className: 'card__image',
    src: `${serverURL}${src}`,
    width: 420,
    height: 295,
    alt: title,
  });

  const card = document.createElement('article');
  card.classList.add('card');
  card.innerHTML = `
    <a class="card__image-link" href="/product.html?id=${id}">
      ${imageWrapper.innerHTML}
      ${
        discount
          ? `<span class="discount discount--lb">-${discount}%</span>`
          : ''
      }
    </a>

    <div class="card__content">
      <div class="card__price">
      ${
        discount
          ? `
        <span class="card__discounted-price">
          ${calculateDiscountPrice(price, discount)}
        </span>
        <del class="card__non-discounted-price">
          ${formatPrice(price)}
        </del>
      `
          : `
        <span class="card__discounted-price">
            ${formatPrice(price)}
        </span>
      `
      }
      </div>
      <${titleTag} class="card__title" title="${title}">
        <a class="card__link" href="/product.html?id=${id}">
          ${title}
        </a>
      </${titleTag}>
    </div>
  `;

  return {
    card,
    image,
  };
};

export const updateAllPricesVisibility = () => {
  document.querySelectorAll('.card').forEach(card => {
    const priceContainer = card.querySelector('.card__price');
    const nonDiscountedPrice = card.querySelector(
      '.card__non-discounted-price',
    );

    if (!nonDiscountedPrice) return;

    Object.values(mediaQueries).forEach(value => {
      if (window.innerWidth === value) {
        nonDiscountedPrice.classList.remove('is-hidden');
      }
    });

    if (priceContainer.offsetWidth >= card.offsetWidth) {
      nonDiscountedPrice.classList.add('is-hidden');
    }
  });
};
