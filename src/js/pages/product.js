import { renderBreadcrumbs } from '../components/breadcrumbs.js';
import { createContainer } from '../layout/container.js';
import { createProductCard } from '../layout/product-card.js';
import { renderRecommendGoods } from '../layout/goods.js';
import { serverURL } from '../helpers/constants.js';
import { loadData } from '../services/api.js';

const createHeader = title => {
  const header = document.createElement('header');
  header.classList.add('product__header');

  const h1 = document.createElement('h1');
  h1.classList.add('product__title', 'title', 'title--sm');
  h1.textContent = title;

  header.append(h1);
  return header;
};

const createDiscount = discount => {
  const span = document.createElement('span');
  span.classList.add('discount', 'discount--product');
  span.textContent = `${discount}%`;
  return span;
};

const createImage = (imageURL, title) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('product__image-wrapper');

  const picture = document.createElement('picture');
  picture.classList.add('product__image');

  const image = document.createElement('img');
  image.src = `${serverURL}${imageURL}`;
  image.width = 757;
  image.height = 427;
  image.alt = title;

  picture.append(image);
  wrapper.append(picture);

  return wrapper;
};

const createDetails = ({ id, title, image, price, discount }) => {
  const details = document.createElement('div');
  details.classList.add('product__details');

  const imgWrapper = createImage(image, title);
  if (discount) imgWrapper.append(createDiscount(discount));

  const productCard = createProductCard(id, price, discount);

  details.append(imgWrapper, productCard);
  return details;
};

const createDescription = text => {
  const description = document.createElement('div');
  description.classList.add('product__description');

  const title = document.createElement('p');
  title.classList.add('product__description-title');
  title.textContent = 'Описание:';

  const content = document.createElement('div');
  content.classList.add('product__description-content');

  const p = document.createElement('p');
  p.textContent = text;
  content.append(p);

  description.append(title, content);
  return description;
};

const renderArticleContent = data => {
  const container = createContainer();
  const header = createHeader(data.title);
  const details = createDetails(data);
  const description = createDescription(data.description);

  const article = document.querySelector('.product');
  article.innerHTML = '';
  container.append(header, details, description);
  article.append(container);
};

export const renderProductPage = async () => {
  if (!document.querySelector('#productPage')) return;

  const ulrParams = new URLSearchParams(window.location.search);
  const productID = ulrParams.get('id');

  const productData = await loadData(serverURL, `api/goods/${productID}`);

  const breadcrumbs = [
    {
      title: 'Главная',
      href: '/',
      ariaLabel: 'Вернуться на главную',
    },
    {
      title: 'Каталог',
      href: '#',
      ariaLabel: 'Вернуться в раздел каталог',
    },
    {
      title: `${productData.category}`,
      href: `/category.html?category=${productData.category}`,
      ariaLabel: `Вернуться в раздел ${productData.category}`,
    },
    {
      title: `${productData.title}`,
    },
  ];

  renderBreadcrumbs('productPage', breadcrumbs);
  renderArticleContent(productData);
  renderRecommendGoods(productData);
};
