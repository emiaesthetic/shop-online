import { renderCategoryGoods } from '../layout/goods.js';

export const renderCategoryPage = () => {
  if (!document.querySelector('#categoryPage')) return;

  const ulrParams = new URLSearchParams(window.location.search);
  const category = ulrParams.get('category');

  const title = document.querySelector('.title');
  title.textContent = category;

  document.title = `${category} - ShopOnline`;
  renderCategoryGoods(category);
};
