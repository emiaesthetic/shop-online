import { createButton } from '../components/button.js';
import { serverURL, CART_ITEMS_KEY } from '../helpers/constants.js';
import { getStorage } from '../services/storage.js';
import { loadData } from '../services/api.js';

const createHeader = () => {
  const header = document.createElement('header');
  header.className = 'cart-delivery__header';

  const title = document.createElement('h2');
  title.className = 'cart-delivery__title title title--sm';

  const changeBtn = createButton({
    className: 'cart-delivery__button button button--transparent',
  });
  changeBtn.innerHTML = `
    <span>Изменить</span><span class="visually-hidden">адрес доставки</span>
  `;

  header.append(title, changeBtn);

  return header;
};

const createItem = ({ id, title, image }) => {
  const item = document.createElement('li');
  item.className = 'cart-delivery__goods-item';
  item.innerHTML = `
    <a class="cart-delivery__goods-link" href="/product.html?id=${id}">
      <picture class="cart-delivery__goods-image">
        <img src="${serverURL}${image}" width="80" height="80" alt="${title}">
      </picture>
    </a>
  `;

  return item;
};

const createContent = goods => {
  const content = document.createElement('div');
  content.className = 'cart-delivery__content';
  content.innerHTML = `
    <div class="cart-delivery__items">
      <div class="cart-delivery__item">
        <span class="cart-delivery__label">Пункт выдачи</span>
        <span class="cart-delivery__value">
          г. Москва (Московская область), улица Павлика Морозова,
          д. 48, (Пункт выдачи), Ежедневно 10:00-21:00
        </span>
      </div>

      <div class="cart-delivery__item">
        <span class="cart-delivery__label">Стоимость доставки</span>
        <span class="cart-delivery__value cart-delivery__value--is-gray">
          Бесплатно
        </span>
      </div>

      <div class="cart-delivery__item">
        <span class="cart-delivery__label cart-delivery__label--is-bold">
          10-13 февраля
        </span>
      </div>
    </div>
  `;

  const list = document.createElement('ul');
  list.className = 'cart-delivery__goods';

  goods.forEach(product => {
    const item = createItem(product);
    list.append(item);
  });

  const lastCartItem = content.querySelector('.cart-delivery__item:last-child');
  lastCartItem.append(list);

  return content;
};

export const renderCartDelivery = async () => {
  const goodsID = getStorage(CART_ITEMS_KEY);
  const goods = [];

  for (const item of goodsID) {
    const product = await loadData(serverURL, `api/goods/${item}`);
    goods.push(product);
  }

  const header = createHeader();
  const content = createContent(goods);

  const cartDelivery = document.querySelector('.cart-delivery');
  cartDelivery.innerHTML = '';
  cartDelivery.append(header, content);
};
