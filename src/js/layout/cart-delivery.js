import { serverURL } from '../helpers/constants.js';

export const renderSkeletonCartDelivery = quantity => {
  const deliveryItems = document.querySelector('.cart-delivery__goods');

  Array.from({ length: quantity }).forEach(() => {
    const item = document.createElement('li');
    item.className = 'cart-delivery__goods-item skeleton';

    const link = document.createElement('div');
    link.className = 'cart-delivery__goods-link';

    item.append(link);
    deliveryItems.append(item);
  });
};

const createItem = ({ id, title, image }) => {
  const item = document.createElement('li');
  item.dataset.id = id;
  item.className = 'cart-delivery__goods-item';
  item.innerHTML = `
    <a class="cart-delivery__goods-link" href="product.html?id=${id}">
      <picture class="cart-delivery__goods-image">
        <img src="${serverURL}${image}" width="80" height="80" alt="${title}">
      </picture>
    </a>
  `;

  return item;
};

export const renderCartDelivery = goods => {
  const cartDelivery = document.querySelector('.cart-delivery');
  cartDelivery.classList.remove('skeleton');

  const deliveryItems = document.querySelector('.cart-delivery__goods');
  deliveryItems.innerHTML = '';

  goods.forEach(product => {
    const item = createItem(product);
    deliveryItems.append(item);
  });
};
