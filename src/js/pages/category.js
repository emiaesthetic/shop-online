import { renderGoods } from '../layout/goods.js';
import { renderMenu } from '../components/menu.js';

export const renderCategoryPage = () => {
  if (!document.querySelector('#categoryPage')) return;

  renderMenu();

  const ulrParams = new URLSearchParams(window.location.search);
  const category = ulrParams.get('category');

  const title = document.querySelector('.title');
  title.textContent = category;

  renderGoods('category', category);
};
