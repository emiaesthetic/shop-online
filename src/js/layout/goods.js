import { createCard, updateAllPricesVisibility } from '../components/card.js';
import { removeLoader } from '../components/loader.js';
import { loadData } from '../services/api.js';
import { serverURL } from '../helpers/constants.js';
import { preloadImages } from '../helpers/productUtils.js';

const sortGoodsByDiscount = goods => {
  return goods.sort((a, b) => b.discount - a.discount);
};

const renderGoodsItem = async (goods, title = 'h3') => {
  const goodsList = document.querySelector('.goods__list');
  goodsList.innerHTML = '';

  const images = [];
  goods.forEach(product => {
    const item = document.createElement('li');
    item.classList.add('goods__item');

    const { card, image } = createCard(product, title);
    images.push(image);

    item.append(card);
    goodsList.append(item);
  });

  await preloadImages(images);
  removeLoader();

  updateAllPricesVisibility();
  window.addEventListener('resize', updateAllPricesVisibility);
};

export const renderCategoryGoods = async category => {
  const NUMBER_OF_PRODUCTS_ON_PAGE = 32;

  const goods = await loadData(serverURL, `api/goods/category/${category}`);
  renderGoodsItem(goods.slice(0, NUMBER_OF_PRODUCTS_ON_PAGE), 'h2');
};

export const renderRecommendGoods = async ({ id, category }) => {
  const NUMBER_OF_PRODUCTS_ON_PAGE = 8;

  const goods = await loadData(serverURL, `api/goods/category/${category}`);
  const filteredGoods = goods.filter(product => product.id !== id);
  renderGoodsItem(filteredGoods.slice(0, NUMBER_OF_PRODUCTS_ON_PAGE));
};

export const renderDiscountGoods = async () => {
  const NUMBER_OF_PRODUCTS_ON_PAGE = 8;

  const goods = await loadData(serverURL, 'api/goods/discount');
  const sortedGoods = sortGoodsByDiscount(goods);
  renderGoodsItem(sortedGoods.slice(0, NUMBER_OF_PRODUCTS_ON_PAGE));
};
