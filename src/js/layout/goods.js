import { createCard } from '../components/card.js';
import { loadData } from '../services/api.js';
import { serverURL } from '../helpers/constants.js';

const sortGoodsByDiscount = goods => {
  goods.sort((a, b) => b.discount - a.discount);
};

const getQuantityGoods = sectionID => {
  const quantities = {
    category: 32,
    recommend: 8,
    discount: 8,
  };
  return quantities[sectionID] || 0;
};

export const renderGoods = async (sectionID, category) => {
  const goodsList = document.querySelector('.goods__list');
  goodsList.innerHTML = '';

  const endpoint = category
    ? `api/goods/category/${category}`
    : 'api/goods/discount';
  const goods = await loadData(serverURL, endpoint);

  const quantityGoods = getQuantityGoods(sectionID);
  if (quantityGoods === 0) return;

  if (sectionID === 'discount') {
    sortGoodsByDiscount(goods);
  }

  const tagTitle = sectionID === 'category' ? 'h2' : 'h3';

  goods.slice(0, quantityGoods).forEach(product => {
    const item = document.createElement('li');
    item.classList.add('goods__item');

    const card = createCard(product, tagTitle);
    item.append(card);
    goodsList.append(item);
  });
};
