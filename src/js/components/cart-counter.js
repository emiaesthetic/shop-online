import { CART_ITEMS_KEY } from '../helpers/constants.js';
import { getStorage } from '../services/storage.js';

export const updateCartCounter = () => {
  const cartCounter = document.querySelector('.actions__cart-counter');
  const quantityGoods = getStorage(CART_ITEMS_KEY).length;
  cartCounter.textContent = quantityGoods;
  cartCounter.style.display = quantityGoods > 0 ? 'inline-flex' : 'none';
};
