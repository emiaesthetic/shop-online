import { createContainer } from '../layout/container.js';

export const renderBreadcrumbs = (pageID, breadcrumbs) => {
  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs';
  nav.ariaLabel = 'Хлебные крошки';

  const container = createContainer();

  const list = document.createElement('ol');
  list.className = 'breadcrumbs__list';

  breadcrumbs.forEach((crumb, index) => {
    const item = document.createElement('li');
    item.className = 'breadcrumbs__item';

    if (index === breadcrumbs.length - 1) {
      item.textContent = crumb.title;
      item.ariaCurrent = 'page';
    } else {
      const link = document.createElement('a');
      link.className = 'breadcrumbs__link underline-link';
      link.textContent = crumb.title;
      link.href = crumb.href;
      link.ariaLabel = crumb.ariaLabel;
      item.append(link);
    }

    list.append(item);
  });

  container.append(list);
  nav.append(container);
  document.querySelector(`#${pageID}`).prepend(nav);
};
