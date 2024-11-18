import { createImage } from '../components/image.js';
import { renderBreadcrumbs } from '../components/breadcrumbs.js';
import { renderRecommendGoods } from '../layout/goods.js';
import { updateCartCounter } from '../pages/cart.js';
import {
  serverURL,
  CART_ITEMS_KEY,
  FAVORITE_ITEMS_KEY,
} from '../helpers/constants.js';
import {
  formatPrice,
  calculateDiscountPrice,
  calculateMonthlyPayment,
} from '../helpers/productUtils.js';
import { loadData } from '../services/api.js';
import {
  getStorage,
  addProductToFavorite,
  removeProductFromFavorite,
  addProductToCart,
} from '../services/storage.js';

const createDiscount = discount => {
  const span = document.createElement('span');
  span.classList.add('discount', 'discount--product');
  span.textContent = `${discount}%`;
  return span;
};

const createPriceElement = (tag, className, content) => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
};

const renderProductTitle = title => {
  const h1 = document.createElement('h1');
  h1.className = 'product__title title title--sm';
  h1.textContent = title;

  const skeleton = document.querySelector('.product-skeleton__title');
  skeleton.replaceWith(h1);
};

const renderProductImage = (title, image, discount) => {
  const { imageWrapper } = createImage({
    tag: 'picture',
    className: 'product__image',
    src: `${serverURL}${image}`,
    width: '',
    height: '',
    alt: title,
  });

  const imageContainer = document.createElement('div');
  imageContainer.className = 'product__image-wrapper';
  imageContainer.append(imageWrapper);
  if (discount) imageContainer.append(createDiscount(discount));

  const skeleton = document.querySelector('.product-skeleton__image-wrapper');
  skeleton.replaceWith(imageContainer);
};

const renderPriceProduct = (price, discount) => {
  const priceContainer = document.createElement('div');
  priceContainer.className = 'product-card__price';

  if (discount) {
    const currentPriceElement = createPriceElement(
      'span',
      'product-card__current-price',
      formatPrice(calculateDiscountPrice(price, discount)),
    );
    priceContainer.append(currentPriceElement);
  }

  const originalPriceElement = createPriceElement(
    discount ? 'del' : 'span',
    'product-card__original-price',
    formatPrice(price),
  );

  const creditPriceElement = createPriceElement(
    'span',
    'product-card__credit-price',
    `В кредит от ${formatPrice(calculateMonthlyPayment(price))}`,
  );

  priceContainer.append(originalPriceElement, creditPriceElement);

  const skeleton = document.querySelector('.product-card-skeleton__price');
  skeleton.replaceWith(priceContainer);
};

const renderProductDescription = description => {
  const descriptionContent = document.createElement('div');
  descriptionContent.className = 'product__description-content';
  descriptionContent.innerHTML = `<p>${description}</p>`;

  const skeleton = document.querySelector(
    '.product-skeleton__description-content',
  );
  skeleton.replaceWith(descriptionContent);
};

const handleFavoriteAction = itemID => {
  const button = document.querySelector('.product-card__add-to-favorite');
  const cartGoods = getStorage(FAVORITE_ITEMS_KEY);

  if (cartGoods.includes(itemID)) {
    button.classList.add('is-active');
  }

  button.addEventListener('click', () => {
    button.classList.toggle('is-active');

    if (button.classList.contains('is-active')) {
      addProductToFavorite(itemID);
    } else {
      removeProductFromFavorite(itemID);
    }
  });
};

const handleCartAction = itemID => {
  document
    .querySelector('.product-card__add-to-cart')
    .addEventListener('click', () => {
      const cartGoods = getStorage(CART_ITEMS_KEY);
      if (!cartGoods.some(product => product.id === itemID)) {
        addProductToCart(itemID);
        updateCartCounter();
      }
    });
};

export const renderProductPage = async () => {
  if (!document.querySelector('#productPage')) return;

  const ulrParams = new URLSearchParams(window.location.search);
  const productID = ulrParams.get('id');
  const { id, title, description, category, image, price, discount } =
    await loadData(serverURL, `api/goods/${productID}`);

  const breadcrumbs = [
    {
      title: 'Главная',
      href: 'index.html',
      ariaLabel: 'Вернуться на главную',
    },
    {
      title: 'Каталог',
      href: '#',
      ariaLabel: 'Вернуться в раздел каталог',
    },
    {
      title: `${category}`,
      href: `category.html?category=${category}`,
      ariaLabel: `Вернуться в раздел ${category}`,
    },
    {
      title: `${title}`,
    },
  ];

  document.title = `${title} - ShopOnline`;

  const article = document.querySelector('.product');
  article.classList.remove('skeleton');

  renderBreadcrumbs(breadcrumbs);
  renderProductTitle(title);
  renderProductImage(title, image, discount);
  renderPriceProduct(price, discount);
  renderProductDescription(description);
  renderRecommendGoods({ id, category });

  handleCartAction(id);
  handleFavoriteAction(id);
};
