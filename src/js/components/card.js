import {
  formatPrice,
  calculateDiscountPrice,
} from '../helpers/productUtils.js';
import { serverURL } from '../helpers/constants.js';

export const createCard = (data, titleTag = 'h3') => {
  const card = document.createElement('article');
  card.classList.add('card');
  card.innerHTML = `
    <a class="card__image-link" href="/product.html?id=${data.id}">
      <picture class="card__image">
        <img
          src="${serverURL}${data.image}"
          width="420" height="295" loading="lazy"
          alt="${data.title}"
        >
      </picture>
      ${
        data.discount
          ? `<span class="discount discount--lb">-${data.discount}%</span>`
          : ''
      }
    </a>

    <div class="card__content">
      <div class="card__price">
      ${
        data.discount
          ? `
        <span class="card__discounted-price">
          ${calculateDiscountPrice(data.price, data.discount)}
        </span>
        <del class="card__non-discounted-price">
          ${formatPrice(data.price)}
        </del>
      `
          : `<span class="card__discounted-price">
              ${formatPrice(data.price)}
            </span>`
      }
      </div>
      <${titleTag} class="card__title">
        <a class="card__link" href="/product.html?id=${data.id}">
          ${data.title}
        </a>
      </${titleTag}>
    </div>
  `;

  return card;
};
