import { createImage } from '../components/image.js';
import { createButton } from '../components/button.js';
import { createSVG } from '../components/svg.js';
import { createCheckbox } from '../components/checkbox.js';
import {
  serverURL,
  mediaQueries,
  CART_ITEMS_KEY,
} from '../helpers/constants.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
  recalculatePrices,
} from '../helpers/productUtils.js';
import { getStorage, removeProductFromStorage } from '../services/storage.js';
import { loadData } from '../services/api.js';
import { updateCartCounter } from '../components/cart-counter.js';

const createCartHeader = goods => {
  const header = document.createElement('header');
  header.className = 'cart-items__header';

  const title = document.createElement('h2');
  title.className = 'cart-items__title title title--sm';
  const quantity = goods.length <= 0 ? '' : goods.length;
  title.innerHTML = `
    Корзина<sup class="cart-items__sup-title">${quantity}</sup>
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
    svg: createSVG({
      className: 'cart-items__delete-icon',
      id: 'delete',
      width: 18,
      height: 23,
    }),
    ariaLabel: 'Удалить товары из корзины',
  });

  overallCheckbox.addEventListener('click', () => {
    const goodsCheckbox = document.querySelectorAll(
      '.cart-item__checkbox-input',
    );
    goodsCheckbox.forEach(
      checkbox => (checkbox.checked = overallCheckbox.checked),
    );
  });

  deleteBtn.addEventListener('click', () => {
    document.querySelectorAll('.cart-item').forEach(item => {
      const checkbox = item.querySelector('.cart-item__checkbox-input');
      if (checkbox.checked) {
        const productID = item.dataset.id;

        item.remove();
        removeProductFromStorage(CART_ITEMS_KEY, productID);
        updateCartCounter();

        const supTitle = title.querySelector('.cart-items__sup-title');
        const quantity = goods.filter(item => item !== productID).length;
        supTitle.textContent = quantity <= 0 ? '' : quantity;
      }
    });
  });

  controls.append(label, deleteBtn);
  header.append(title, controls);

  return header;
};

const createCartQuantity = cartPrices => {
  const cartQuantity = document.createElement('div');
  cartQuantity.classList.add('cart-item__quantity');

  const counter = document.createElement('span');
  counter.classList.add('cart-item__quantity-number');
  counter.textContent = 1;

  const decrementBtn = createButton({
    className: 'cart-item__quantity-button button button--quantity',
    text: '\u2212',
    ariaLabel: 'Минус один',
  });
  decrementBtn.disabled = Number(counter.textContent) === 1;
  decrementBtn.addEventListener('click', () => {
    const quantity = Number(counter.textContent) - 1;
    counter.textContent = quantity;
    decrementBtn.disabled = Number(counter.textContent) === 1;
    recalculatePrices(cartPrices, quantity + 1, quantity);
  });

  const incrementBtn = createButton({
    className: 'cart-item__quantity-button button button--quantity',
    text: '+',
    ariaLabel: 'Плюс один',
  });
  incrementBtn.addEventListener('click', () => {
    const quantity = Number(counter.textContent) + 1;
    counter.textContent = quantity;
    decrementBtn.disabled = Number(counter.textContent) === 1;
    recalculatePrices(cartPrices, quantity - 1, quantity);
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

const createCartItem = ({ id, title, image: src, price, discount }) => {
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
            <span class="cart-item__discounted-price">
              ${calculateDiscountPrice(price, discount)}
            </span>
            <del class="cart-item__non-discounted-price">
              ${formatPrice(price)}
            </del>
          `
              : `
            <span class="cart-item__discounted-price">
              ${formatPrice(price)}
            </span>
          `
          }
        </div>
        <span class="cart-item__credit">
          ${calculateMonthlyPayment(price)}
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
    svg: createSVG({
      className: 'cart-item__delete-icon',
      id: 'delete',
      width: 18,
      height: 23,
    }),
    ariaLabel: 'Удалить товар из корзины',
  });

  const imageLink = cartItem.querySelector('.cart-item__image-link');
  imageLink.append(imageWrapper);

  const cartPrices = cartItem.querySelector('.cart-item__price');
  const cartQuantity = createCartQuantity(cartPrices);

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

export const renderCartItems = async () => {
  const goodsID = getStorage(CART_ITEMS_KEY);

  const header = createCartHeader(goodsID);

  const items = document.createElement('ul');
  items.className = 'cart-items__list';

  for (const productID of goodsID) {
    const productData = await loadData(serverURL, `api/goods/${productID}`);
    const { cartItem } = createCartItem(productData);
    items.append(cartItem);
  }

  const cartItems = document.querySelector('.cart-items');
  cartItems.innerHTML = '';
  cartItems.append(header, items);
};
