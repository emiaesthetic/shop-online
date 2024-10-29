import { createButton } from './button.js';
import { createSVG } from './svg.js';
import {
  calculateDiscountPrice,
  calculateMonthlyPayment,
} from '../helpers/productUtils.js';

const createPrice = (price, discount) => {
  const priceWrapper = document.createElement('div');
  priceWrapper.classList.add('product-card__price');

  if (discount) {
    const discountedPrice = document.createElement('span');
    discountedPrice.classList.add('product-card__discounted-price');
    discountedPrice.textContent = `${calculateDiscountPrice(price, discount)} ₽`;
    priceWrapper.append(discountedPrice);
  }

  const nonDiscountedPrice = document.createElement('span');
  nonDiscountedPrice.classList.add('product-card__non-discounted-price');
  nonDiscountedPrice.textContent = `${price} ₽`;

  const creditPrice = document.createElement('span');
  creditPrice.classList.add('product-card__credit');
  creditPrice.textContent = `
    В кредит от ${calculateMonthlyPayment(price, discount)} ₽
  `;

  priceWrapper.append(nonDiscountedPrice, creditPrice);
  return priceWrapper;
};

const createActions = () => {
  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const addToCartBtn = createButton({
    className: 'product-card__add-to-cart button button--accent',
    text: 'Добавить в корзину',
  });

  const addToFavoriteBtn = createButton({
    className: 'product-card__add-to-favorite button button--icon',
    svg: createSVG({
      className: 'product-card__add-favorite-icon',
      id: 'add-favorite',
      width: 29,
      height: 26,
    }),
    ariaLabel: 'Добавить в избранное',
  });

  actions.append(addToCartBtn, addToFavoriteBtn);
  return actions;
};

const createInfo = () => {
  const cardInfo = document.createElement('div');
  cardInfo.classList.add('product-card__info');
  cardInfo.innerHTML = `
    <div class="product-card__delivery">
      <div class="product-card__info-label">Доставка</div>
      <div class="product-card__info-value">1-3 января</div>
    </div>
    <div class="product-card__seller">
      <div class="product-card__info-label">Продавец</div>
      <div class="product-card__info-value">ShopOnline</div>
    </div>
  `;
  return cardInfo;
};

const createNotificationBtn = () => {
  const button = createButton({
    className: 'product-card__notification button button--transparent',
    svg: createSVG({
      className: 'product-card__notification-icon',
      id: 'notification',
      width: 18,
      height: 20,
    }),
  });

  const span = document.createElement('span');
  span.classList.add('product-card__notification-text');
  span.textContent = 'Узнать о снижении цены';

  button.append(span);
  return button;
};

export const createProductCard = (price, discount) => {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  const priceWrapper = createPrice(price, discount);
  const actions = createActions();
  const info = createInfo();
  const notificationBtn = createNotificationBtn();

  productCard.append(priceWrapper, actions, info, notificationBtn);
  return productCard;
};
