import { createImage } from '../components/image.js';
import { createButton } from '../components/button.js';
import { createCheckbox } from '../components/checkbox.js';
import { serverURL, mediaQueries } from '../helpers/constants.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
} from '../helpers/productUtils.js';

const createCartHeader = quantity => {
  const header = document.createElement('header');
  header.className = 'cart-items__header';

  const title = document.createElement('h2');
  title.className = 'cart-items__title title title--sm';
  title.innerHTML = `
    Корзина<sup class="cart-items__sup-title">${
      quantity <= 0 ? '' : quantity
    }</sup>
  `;

  const controls = document.createElement('div');
  controls.className = 'cart-items__controls';

  const { label, checkbox: overallCheckbox } = createCheckbox({
    labelClassName: 'cart-items__label',
    inputClassName: 'checkbox-input',
    inputName: 'allProducts',
    spanClassName: 'cart-items__checkbox checkbox',
  });

  const span = document.createElement('span');
  span.textContent = 'Выбрать все';
  label.append(span);

  const deleteBtn = createButton({
    className: 'cart-items__delete button button--delete',
    ariaLabel: 'Удалить товары из корзины',
  });
  deleteBtn.innerHTML = `
    <svg width="18" height="23" aria-hidden="true">
      <use href="./img/sprite.svg#delete"></use>
    </svg>
  `;

  overallCheckbox.addEventListener('click', () => {
    const goodsCheckbox = document.querySelectorAll(
      '.cart-item__checkbox-input',
    );
    goodsCheckbox.forEach(
      checkbox => (checkbox.checked = overallCheckbox.checked),
    );
  });

  controls.append(label, deleteBtn);
  header.append(title, controls);

  return {
    header,
    deleteBtn,
  };
};

const createCartQuantity = quantity => {
  const cartQuantity = document.createElement('div');
  cartQuantity.classList.add('cart-item__quantity');

  const counter = document.createElement('span');
  counter.classList.add('cart-item__quantity-number');
  counter.textContent = quantity;

  const decrementBtn = createButton({
    className: 'cart-item__quantity-button button button--quantity',
    text: '\u2212',
    ariaLabel: 'Минус один',
  });
  decrementBtn.disabled = Number(counter.textContent) === 1;

  const incrementBtn = createButton({
    className: 'cart-item__quantity-button button button--quantity',
    text: '+',
    ariaLabel: 'Плюс один',
  });

  cartQuantity.append(decrementBtn, counter, incrementBtn);

  return cartQuantity;
};

const moveCartQuantity = (target, from, where) => {
  if (window.innerWidth <= mediaQueries.tablet) {
    where.prepend(target);
  } else {
    from.before(target);
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

      <div class="cart-item__price">
        <div class="cart-item__main-price">
          ${
            discount
              ? `
            <span class="cart-item__current-price">
              ${formatPrice(calculateDiscountPrice(price, discount, quantity))}
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

  const deleteBtn = createButton({
    className: 'cart-item__delete button button--delete',
    ariaLabel: 'Удалить товар из корзины',
  });
  deleteBtn.innerHTML = `
  <svg width="18" height="23" aria-hidden="true">
    <use href="./img/sprite.svg#delete"></use>
  </svg>
`;

  const imageLink = cartItem.querySelector('.cart-item__image-link');
  imageLink.append(imageWrapper);

  const cartPrices = cartItem.querySelector('.cart-item__price');
  const cartQuantity = createCartQuantity(quantity);

  cartItem
    .querySelector('.cart-item__details')
    .append(cartQuantity, cartPrices);

  const cartControls = cartItem.querySelector('.cart-item__controls');
  cartControls.append(deleteBtn);

  window.addEventListener('resize', () => {
    moveCartQuantity(cartQuantity, cartPrices, cartControls);
  });

  return {
    cartItem,
    image,
  };
};

export const renderCartItems = (goods, quantity) => {
  const { header, deleteBtn } = createCartHeader(quantity);

  const items = document.createElement('ul');
  items.className = 'cart-items__list';

  const images = [];
  goods.forEach(product => {
    const { cartItem, image } = createCartItem(product);
    items.append(cartItem);
    images.push(image);
  });

  const cartItems = document.querySelector('.cart-items');
  cartItems.innerHTML = '';
  cartItems.append(header, items);

  return {
    items,
    deleteBtn,
  };
};
