import { renderCartItems } from '../layout/cart-items.js';
import { renderCartSummary } from '../layout/cart-summary.js';
import { renderCartDelivery } from '../layout/cart-delivery.js';
import { renderDiscountGoods } from '../layout/goods.js';
import { serverURL, CART_ITEMS_KEY } from '../helpers/constants.js';
import { getTotalQuantity } from '../helpers/cartUtils.js';
import {
  getStorage,
  removeProductFromCart,
  setProductQuantityInCart,
} from '../services/storage.js';
import { loadData } from '../services/api.js';
import { recalculatePrices } from '../helpers/productUtils.js';

const loadGoods = async items => {
  const goods = [];
  for (const item of items) {
    const product = await loadData(serverURL, `api/goods/${item.id}`);
    product.quantityCart = item.quantity;
    goods.push(product);
  }

  return goods;
};

export const updateCartCounter = () => {
  const cartCounter = document.querySelector('.actions__cart-counter');
  const supTitle = document.querySelector('.cart-items__sup-title');
  const summaryCounter = document.querySelector('.cart-summary__quantity');

  const goods = getStorage(CART_ITEMS_KEY);
  const totalQuantity = getTotalQuantity(goods);

  cartCounter.style.display = totalQuantity > 0 ? 'inline-flex' : 'none';
  cartCounter.textContent = totalQuantity;

  if (supTitle) {
    supTitle.textContent = totalQuantity <= 0 ? '' : totalQuantity;
  }

  if (summaryCounter) {
    summaryCounter.textContent = `Товары, ${totalQuantity} шт.`;
  }
};

const updateDeliveryItems = productID => {
  const items = document.querySelector('.cart-delivery__goods');
  const currentItem = items.querySelector(`[data-id="${productID}"]`);
  currentItem.remove();
};

const updateSummaryPrice = () => {};

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
      recalculatePrices(itemID, quantity, newQuantity);
      setProductQuantityInCart(itemID, newQuantity);
      updateCartCounter();
    }
  });
};

const handleDeleteSelectedItems = deleteBtn => {
  deleteBtn.addEventListener('click', () => {
    document.querySelectorAll('.cart-item').forEach(item => {
      const checkbox = item.querySelector('.cart-item__checkbox-input');
      if (checkbox.checked) {
        const productID = item.dataset.id;

        item.remove();
        removeProductFromCart(productID);
        updateDeliveryItems(productID);
        updateSummaryPrice();
        updateCartCounter();
      }
    });
  });
};

export const renderCartPage = async () => {
  if (!document.querySelector('#cartPage')) return;

  const cartGoods = getStorage(CART_ITEMS_KEY);
  const goods = await loadGoods(cartGoods);
  const totalQuantity = getTotalQuantity(cartGoods);

  const { items: cartItems, deleteBtn } = renderCartItems(goods, totalQuantity);
  renderCartDelivery(goods);
  renderCartSummary(goods, totalQuantity);
  renderDiscountGoods('discount');

  handleQuantityChange(cartItems);
  handleDeleteSelectedItems(deleteBtn);
};
