import { renderCartItems } from '../layout/cart-items.js';
import { renderDiscountGoods } from '../layout/goods.js';

export const renderCartPage = () => {
  if (!document.querySelector('#cartPage')) return;

  renderCartItems();
  renderDiscountGoods('discount');
};
