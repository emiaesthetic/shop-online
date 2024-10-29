import { renderGoods } from '../layout/goods.js';
import { renderMenu } from '../components/menu.js';

export const renderCartPage = () => {
  if (!document.querySelector('#cartPage')) return;

  renderMenu();
  renderGoods('discount');
};
