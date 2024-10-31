import { renderDiscountGoods } from '../layout/goods.js';

export const renderCartPage = () => {
  if (!document.querySelector('#cartPage')) return;

  renderDiscountGoods('discount');
};
