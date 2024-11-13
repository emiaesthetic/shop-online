import { renderBreadcrumbs } from '../components/breadcrumbs.js';
import { renderCartItems } from '../layout/cart-items.js';
import { renderCartSummary } from '../layout/cart-summary.js';
import { renderCartDelivery } from '../layout/cart-delivery.js';
import { renderCartEmpty } from '../layout/cart-empty.js';
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
  const currentPrice = document.querySelector('.cart-summary__total');
  const currentPriceValue = getTotalCurrentPrice(goods);
  currentPrice.textContent = formatPrice(currentPriceValue);

  const originalPrice = document.querySelector('.cart-summary__total-price');
  const originalPriceValue = getTotalOriginalPrice(goods);
  originalPrice.textContent = formatPrice(originalPriceValue);

  const discountPrice = document.querySelector('.cart-summary__discount-price');
  const discountPriceValue = getTotalDiscountPrice(goods);
  discountPrice.textContent = formatPrice(discountPriceValue);
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

export const handleDeleteItem = cartItems => {
  cartItems.addEventListener('click', ({ target }) => {
    if (target.closest('.cart-item__delete')) {
      const cartItem = target.closest('.cart-item');
      const itemID = cartItem.dataset.id;

      cartItem.remove();
      filteredGoods(itemID);

      if (goods.length === 0) {
        renderCartEmpty();
        return;
      }

      removeProductFromCart(itemID);
      updateDeliveryItems(itemID);
      updateSummaryPrice();
      updateCartCounter();
    }
  });
};

const handleDeleteSelectedItems = button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.cart-item').forEach(cartItem => {
      const checkbox = cartItem.querySelector('.cart-item__checkbox-input');
      if (checkbox.checked) {
        const itemID = cartItem.dataset.id;

        cartItem.remove();
        filteredGoods(itemID);

        if (goods.length === 0) {
          renderCartEmpty();
          return;
        }

        removeProductFromCart(itemID);
        updateDeliveryItems(itemID);
        updateSummaryPrice();
        updateCartCounter();
      }
    });
  });
};

export const renderCartPage = async () => {
  if (!document.querySelector('#cartPage')) return;

  const cartGoods = getStorage(CART_ITEMS_KEY);

  if (cartGoods.length === 0) {
    renderCartEmpty();
    renderDiscountGoods('discount');
    return;
  }

  await loadGoods(cartGoods);
  const totalQuantity = getTotalQuantity(cartGoods);

  const breadcrumbs = [
    {
      title: 'Главная',
      href: '/',
      ariaLabel: 'Вернуться на главную',
    },
    {
      title: 'Корзина',
    },
  ];

  document.title = 'Корзина - ShopOnline';

  renderBreadcrumbs('cartPage', breadcrumbs);
  const { items, deleteBtn } = renderCartItems(goods, totalQuantity);
  renderCartDelivery(goods);
  renderCartSummary(goods, totalQuantity);
  renderDiscountGoods('discount');

  handleQuantityChange(items);
  handleDeleteItem(items);
  handleDeleteSelectedItems(deleteBtn);
};
