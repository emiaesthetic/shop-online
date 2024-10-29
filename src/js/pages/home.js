import { renderGoods } from '../layout/goods.js';
import { renderMenu } from '../components/menu.js';
import { renderTimer } from '../components/timer.js';

export const renderHomePage = () => {
  if (!document.querySelector('#homePage')) return;

  renderMenu();
  window.addEventListener('DOMContentLoaded', renderTimer);
  renderGoods('discount');
};
