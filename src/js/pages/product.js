import { renderGoods } from '../layout/goods.js';
import { renderMenu } from '../components/menu.js';

export const renderProductPage = () => {
  if (!document.querySelector('#productPage')) return;

  renderMenu();
  renderGoods('recommend', 'Ноутбуки');
};
