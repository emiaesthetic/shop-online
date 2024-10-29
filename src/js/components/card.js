import { serverURL } from '../helpers/constants.js';

const calculateDiscountPrice = (price, discount) => {
  const discountAmount = price * (discount / 100);
  return Math.floor(price - discountAmount);
};

export const createCard = (data, titleTag = 'h3') => {
  const card = document.createElement('article');
  card.dataset.productID = data.id;
  card.classList.add('card');
  card.innerHTML = `
    <a class="card__image-link" href="/product.html">
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
          ${calculateDiscountPrice(data.price, data.discount)}&nbsp;₽
        </span>
        <del class="card__non-discounted-price">${data.price}&nbsp;₽</del>
      `
          : `<span class="card__discounted-price">${data.price}&nbsp;₽</span>`
      }
      </div>
      <${titleTag} class="card__title">
        <a class="card__link" href="#">${data.title}</a>
      </${titleTag}>
    </div>
  `;

  return card;
};
