import { renderDiscountGoods } from '../layout/goods.js';
import { renderTimer } from '../components/timer.js';

export const renderHomePage = () => {
  if (!document.querySelector('#homePage')) return;

  window.addEventListener('DOMContentLoaded', renderTimer);
  renderDiscountGoods();
};
