export const renderBreadcrumbs = breadcrumbs => {
  const list = document.querySelector('.breadcrumbs__list');
  list.innerHTML = '';

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
};
