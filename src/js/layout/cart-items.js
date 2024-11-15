import { createImage } from '../components/image.js';
import { serverURL, mediaQueries } from '../helpers/constants.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
} from '../helpers/productUtils.js';

export const renderSkeletonCartItems = quantity => {
  const cartItems = document.querySelector('.cart-items__list');

  Array.from({ length: quantity }).forEach(() => {
    const item = document.createElement('li');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="cart-item__content cart-item-skeleton__content">
        <div class="cart-item__image-wrapper">
          <label class="cart-item__label">
            <input
              class="cart-item__checkbox-input checkbox-input"
              type="checkbox"
              name="product-name"
            >
            <span class="cart-item__checkbox checkbox" aria-hidden="true">
            </span>
          </label>
          <div class="cart-item__image-link skeleton"></div>
        </div>
        <div class="cart-item__details">
          <div class="
            cart-item__main-info
            cart-item-skeleton__main-info
            skeleton
          "></div>
          <div class="
            cart-item__quantity
            cart-item-skeleton__quantity
            cart-item__quantity--tablet-hidden
            skeleton
          "></div>
          <div class="
            cart-item__price
            cart-item-skeleton__price
            skeleton
          "></div>
        </div>
      </div>
      <div class="cart-item__controls cart-item-skeleton__controls">
        <div class="
          cart-item__quantity
          cart-item-skeleton__quantity
          skeleton
        "></div>
        <button
          class="cart-item__delete button button--delete"
          aria-label="Удалить товар из корзины"
        >
          <svg width="18" height="23" aria-hidden="true">
            <use href="./img/sprite.svg#delete"></use>
          </svg>
        </button>
      </div>
  `;

    cartItems.append(item);
  });
};

const moveCartQuantity = item => {
  const quantity = item.querySelector('.cart-item__quantity');
  const price = item.querySelector('.cart-item__price');
  const controls = item.querySelector('.cart-item__controls');

  if (window.innerWidth <= mediaQueries.tablet) {
    controls.prepend(quantity);
  } else {
    price.before(quantity);
  }
};

const createCartItem = ({
  id,
  title,
  image: src,
  price,
  discount,
  quantity,
}) => {
  const cartItem = document.createElement('li');
  cartItem.classList.add('cart-item');
  cartItem.dataset.id = id;
  cartItem.innerHTML = `
    <div class="cart-item__content">
      <div class="cart-item__image-wrapper">
        <label class="cart-item__label">
          <input
            class="cart-item__checkbox-input checkbox-input"
            type="checkbox"
            name="${title}"
          >
          <span class="cart-item__checkbox checkbox" aria-hidden="true"></span>
        </label>
        <a class="cart-item__image-link" href="/product.html?id=${id}">
        </a>
      </div>

      <div class="cart-item__details">
        <div class="cart-item__main-info">
          <h3 class="cart-item__title">
            <a class="cart-item__link" href="/product.html?id=${id}">
              ${title}
            </a>
          </h3>
          <div class="cart-item__description">
            <span class="cart-item__description-line"></span>
            <span class="cart-item__description-line"></span>
          </div>
        </div>

        <div class="cart-item__quantity">
          <button
            class="cart-item__quantity-button button button--quantity"
            aria-label="Минус один"
          >\u2212</button>
          <span class="cart-item__quantity-number">${quantity}</span>
          <button
            class="cart-item__quantity-button button button--quantity"
            aria-label="Плюс один"
          >+</button>
        </div>

        <div class="cart-item__price">
          <div class="cart-item__main-price">
            ${
              discount
                ? `
              <span class="cart-item__current-price">
                ${formatPrice(
                  calculateDiscountPrice(price, discount, quantity),
                )}
              </span>
              <del class="cart-item__original-price">
                ${formatPrice(price * quantity)}
              </del>
            `
                : `
              <span class="cart-item__current-price">
                ${formatPrice(price * quantity)}
              </span>
            `
            }
          </div>
          <span class="cart-item__credit-price">
            ${formatPrice(calculateMonthlyPayment(price * quantity))}
          </span>
        </div>
      </div>
    </div>

    <div class="cart-item__controls">
      <button
        class="cart-item__delete button button--delete"
        aria-label="Удалить товар из корзины"
      >
        <svg width="18" height="23" aria-hidden="true">
          <use href="./img/sprite.svg#delete"></use>
        </svg>
      </button>
    </div>
  `;

  const { imageWrapper, image } = createImage({
    tag: 'picture',
    className: 'cart-item__image',
    src: `${serverURL}${src}`,
    width: 130,
    height: 130,
    alt: title,
  });

  const imageLink = cartItem.querySelector('.cart-item__image-link');
  imageLink.append(imageWrapper);

  moveCartQuantity(cartItem);

  window.addEventListener('resize', () => {
    moveCartQuantity(cartItem);
  });

  return {
    cartItem,
    image,
  };
};

export const renderCartItems = goods => {
  const cartItems = document.querySelector('.cart-items__list');
  cartItems.innerHTML = '';

  goods.forEach(product => {
    const { cartItem } = createCartItem(product);
    cartItems.append(cartItem);
  });

  return {
    cartItems,
  };
};
