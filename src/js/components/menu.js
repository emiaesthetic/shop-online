import { serverURL } from '../helpers/constants.js';
import { loadData } from '../services/api.js';

const isOpen = elem => elem.classList.contains('is-open');

const setHiddenAttribute = (target, element) => {
  target.setAttribute('aria-hidden', !isOpen(element));
};

const setExpandedAttribute = (target, element) => {
  target.setAttribute('aria-expanded', isOpen(element));
};

const updateAriaHidden = dropdowns => {
  dropdowns.forEach(item => {
    const content = item.querySelector('.dropdown__content');

    if (window.innerWidth >= 576) {
      content.setAttribute('aria-hidden', 'true');
    } else {
      content.setAttribute('aria-hidden', 'false');
    }
  });
};

const createMenuItem = category => {
  const item = document.createElement('li');
  item.classList.add('menu__subitem');

  const link = document.createElement('a');
  link.classList.add('menu__sublink', 'underline-link');
  link.href = `/category.html?category=${category}`;
  link.textContent = category;

  item.append(link);
  return item;
};

const addCategoriesToCatalog = (catalog, categories) => {
  const items = categories.map(category => createMenuItem(category));
  catalog.append(...items);
};

export const renderMenu = async () => {
  const menu = document.querySelector('.menu');
  const menuList = document.querySelector('.menu__list');
  const menuBtn = document.querySelector('.menu__button');
  const dropdowns = document.querySelectorAll('.dropdown');
  const [headerCatalog, footerCatalog] = document.querySelectorAll(
    '.menu__sublist--columns-2',
  );

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    setHiddenAttribute(menuList, menu);
    setExpandedAttribute(menuBtn, menu);
  });

  dropdowns.forEach(item => {
    const button = item.querySelector('.dropdown__button');
    const content = item.querySelector('.dropdown__content');

    button.addEventListener('click', () => {
      button.classList.toggle('is-open');
      setExpandedAttribute(button, button);

      content.classList.toggle('is-open');
      setHiddenAttribute(content, content);
    });
  });

  window.addEventListener('resize', () => {
    updateAriaHidden(dropdowns);
  });

  const categories = await loadData(serverURL, 'api/categories');
  addCategoriesToCatalog(headerCatalog, categories);
  addCategoriesToCatalog(footerCatalog, categories);
};
