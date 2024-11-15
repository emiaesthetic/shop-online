import {
  renderSkeletonCartItems,
  renderCartItems,
} from '../layout/cart-items.js';
import {
  renderSkeletonCartDelivery,
  renderCartDelivery,
} from '../layout/cart-delivery.js';
import { renderDiscountGoods } from '../layout/goods.js';
import { serverURL, CART_ITEMS_KEY } from '../helpers/constants.js';
import {
  getStorage,
  removeProductFromCart,
  setProductQuantityInCart,
} from '../services/storage.js';
import { loadData } from '../services/api.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
  getTotalCurrentPrice,
  getTotalOriginalPrice,
  getTotalDiscountPrice,
} from '../helpers/productUtils.js';

let goods = [];

const loadGoods = async cartGoods => {
  for (const item of cartGoods) {
    const product = await loadData(serverURL, `api/goods/${item.id}`);
    product.quantity = item.quantity;
    goods.push(product);
  }
};

const filteredGoods = itemID => {
  goods = goods.filter(product => product.id !== itemID);
};

const getTotalQuantity = cartGoods =>
  cartGoods.reduce((acc, item) => acc + item.quantity, 0);

const updateGoodsQuantity = (itemID, quantity) => {
  const product = goods.find(product => product.id === itemID);
  product.quantity = quantity;
};

export const updateCartCounter = () => {
  const cartCounter = document.querySelector('.actions__cart-counter');
  const supTitle = document.querySelector('.cart-items__sup-title');
  const summaryCounter = document.querySelector('.cart-summary__total-title');

  const cartGoods = getStorage(CART_ITEMS_KEY);
  const totalQuantity = getTotalQuantity(cartGoods);

  cartCounter.style.display = totalQuantity > 0 ? 'inline-flex' : 'none';
  cartCounter.textContent = totalQuantity;

  if (supTitle) {
    supTitle.textContent = totalQuantity <= 0 ? '' : totalQuantity;
  }

  if (summaryCounter) {
    summaryCounter.textContent = `Товары, ${totalQuantity} шт.`;
  }
};

const updateItemPrice = itemID => {
  const item = document.querySelector(`[data-id="${itemID}"]`);
  const { price, discount, quantity } = goods.find(
    product => product.id === itemID,
  );

  const currentPrice = item.querySelector('.cart-item__current-price');
  const currentPriceValue = discount
    ? calculateDiscountPrice(price, discount, quantity)
    : price * quantity;
  currentPrice.textContent = formatPrice(currentPriceValue);

  const creditPrice = item.querySelector('.cart-item__credit-price');
  const creditPriceValue = calculateMonthlyPayment(price, quantity);
  creditPrice.textContent = formatPrice(creditPriceValue);

  const originalPrice = item.querySelector('.cart-item__original-price');
  if (originalPrice) {
    originalPrice.textContent = formatPrice(price * quantity);
  }
};

const updateDeliveryItems = productID => {
  const items = document.querySelector('.cart-delivery__goods');
  const currentItem = items.querySelector(`[data-id="${productID}"]`);
  currentItem.remove();
};

const updateSummaryPrice = () => {
  const updateElementText = (selector, value, skeletonClasses) => {
    const element = document.querySelector(selector);
    element.textContent = formatPrice(value);
    skeletonClasses.forEach(className => element.classList.remove(className));
  };

  updateElementText('.cart-summary__total', getTotalCurrentPrice(goods), [
    'cart-summary-skeleton__total',
    'skeleton',
  ]);

  updateElementText(
    '.cart-summary__total-price',
    getTotalOriginalPrice(goods),
    ['cart-summary-skeleton__total-price', 'skeleton'],
  );

  updateElementText(
    '.cart-summary__discount-price',
    getTotalDiscountPrice(goods),
    ['cart-summary-skeleton__discount-price', 'skeleton'],
  );
};

const toggleCartContent = (action = 'showContent') => {
  const cartContent = document.querySelector('.cart__content');
  const cartEmpty = document.querySelector('.cart-empty');

  switch (action) {
    case 'showContent':
      cartContent.classList.remove('hidden');
      cartEmpty.classList.add('hidden');
      break;
    case 'showEmpty':
      cartContent.classList.add('hidden');
      cartEmpty.classList.remove('hidden');
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
};

const handleSelectAllItems = () => {
  const overallCheckbox = document.querySelector('.cart-items__checkbox-input');

  overallCheckbox.addEventListener('click', () => {
    const goodsCheckbox = document.querySelectorAll(
      '.cart-item__checkbox-input',
    );
    goodsCheckbox.forEach(
      checkbox => (checkbox.checked = overallCheckbox.checked),
    );
  });
};

const handleDeleteSelectedItems = () => {
  document
    .querySelector('.cart-items__delete')
    .addEventListener('click', () => {
      document.querySelectorAll('.cart-item').forEach(cartItem => {
        const checkbox = cartItem.querySelector('.cart-item__checkbox-input');
        if (checkbox.checked) {
          const itemID = cartItem.dataset.id;

          cartItem.remove();
          filteredGoods(itemID);

          if (goods.length === 0) {
            toggleCartContent('showEmpty');
          }

          removeProductFromCart(itemID);
          updateDeliveryItems(itemID);
          updateSummaryPrice();
          updateCartCounter();
        }
      });
    });
};

const handleQuantityChange = cartItems => {
  cartItems.addEventListener('click', ({ target }) => {
    if (target.closest('.cart-item__quantity')) {
      const itemQuantity = target.closest('.cart-item__quantity');
      const decrementBtn = itemQuantity.querySelector('.button--quantity');
      const counter = itemQuantity.querySelector('.cart-item__quantity-number');
      const incrementBtn = itemQuantity.querySelector(
        '.button--quantity:last-child',
      );
      const itemID = target.closest('[data-id]').dataset.id;

      let quantity = Number(counter.textContent);
      let newQuantity = quantity;

      if (target === decrementBtn) {
        newQuantity -= 1;
      } else if (target === incrementBtn) {
        newQuantity += 1;
      }

      counter.textContent = newQuantity;
      decrementBtn.disabled = newQuantity === 1;

      updateGoodsQuantity(itemID, newQuantity);
      setProductQuantityInCart(itemID, newQuantity);
      updateItemPrice(itemID);
      updateSummaryPrice();
      updateCartCounter();
    }
  });
};

const handleDeleteItem = cartItems => {
  cartItems.addEventListener('click', ({ target }) => {
    if (target.closest('.cart-item__delete')) {
      const cartItem = target.closest('.cart-item');
      const itemID = cartItem.dataset.id;

      cartItem.remove();
      filteredGoods(itemID);

      if (goods.length === 0) {
        toggleCartContent('showEmpty');
      }

      removeProductFromCart(itemID);
      updateDeliveryItems(itemID);
      updateSummaryPrice();
      updateCartCounter();
    }
  });
};

export const renderCartPage = async () => {
  if (!document.querySelector('#cartPage')) return;

  document.title = 'Корзина - ShopOnline';

  const cartGoods = getStorage(CART_ITEMS_KEY);
  if (cartGoods.length === 0) {
    toggleCartContent('showEmpty');
    renderDiscountGoods('discount');
    return;
  }

  toggleCartContent('showContent');
  renderSkeletonCartItems(cartGoods.length);
  renderSkeletonCartDelivery(cartGoods.length);

  await loadGoods(cartGoods);

  const { cartItems } = renderCartItems(goods);
  renderCartDelivery(goods);
  updateSummaryPrice();
  renderDiscountGoods('discount');

  handleSelectAllItems();
  handleDeleteSelectedItems();
  handleQuantityChange(cartItems);
  handleDeleteItem(cartItems);
};
