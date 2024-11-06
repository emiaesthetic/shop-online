import { renderCartItems } from '../layout/cart-items.js';
import { renderCartSummary } from '../layout/cart-summary.js';
import { renderDiscountGoods } from '../layout/goods.js';

export const renderCartPage = () => {
  if (!document.querySelector('#cartPage')) return;

  renderCartItems();
  renderCartSummary();
  renderDiscountGoods('discount');
};
