import { createButton } from '../components/button.js';
import { createSVG } from '../components/svg.js';
import { updateCartCounter } from '../pages/cart.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
} from '../helpers/productUtils.js';
import { FAVORITE_ITEMS_KEY, CART_ITEMS_KEY } from '../helpers/constants.js';
import {
  getStorage,
  addProductToFavorite,
  removeProductFromFavorite,
  addProductToCart,
} from '../services/storage.js';

const createPrice = (price, discount) => {
  const priceWrapper = document.createElement('div');
  priceWrapper.classList.add('product-card__price');

  if (discount) {
    const discountedPrice = document.createElement('span');
    discountedPrice.classList.add('product-card__discounted-price');
    const discountedPriceValue = calculateDiscountPrice(price, discount);
    discountedPrice.textContent = `${formatPrice(discountedPriceValue)}`;
    priceWrapper.append(discountedPrice);
  }

  const nonDiscountedPrice = document.createElement('span');
  nonDiscountedPrice.classList.add('product-card__non-discounted-price');
  nonDiscountedPrice.textContent = formatPrice(price);

  const creditPrice = document.createElement('span');
  creditPrice.classList.add('product-card__credit');
  creditPrice.textContent = `
    В кредит от ${formatPrice(calculateMonthlyPayment(price))}
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
  return {
    actions,
    addToCartBtn,
    addToFavoriteBtn,
  };
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

const handleFavoriteAction = (button, itemID) => {
  const cartGoods = getStorage(FAVORITE_ITEMS_KEY);

  if (cartGoods.includes(itemID)) {
    button.classList.add('is-active');
  }

  button.addEventListener('click', () => {
    button.classList.toggle('is-active');

    if (button.classList.contains('is-active')) {
      addProductToFavorite(itemID);
    } else {
      removeProductFromFavorite(itemID);
    }
  });
};

const handleCartAction = (button, itemID) => {
  button.addEventListener('click', () => {
    const cartGoods = getStorage(CART_ITEMS_KEY);
    if (!cartGoods.some(product => product.id === itemID)) {
      addProductToCart(itemID);
      updateCartCounter();
    }
  });
};

export const createProductCard = (id, price, discount) => {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  const priceWrapper = createPrice(price, discount);
  const { actions, addToCartBtn, addToFavoriteBtn } = createActions(id);
  const info = createInfo();
  const notificationBtn = createNotificationBtn();

  handleFavoriteAction(addToFavoriteBtn, id);
  handleCartAction(addToCartBtn, id);

  productCard.append(priceWrapper, actions, info, notificationBtn);
  return productCard;
};
