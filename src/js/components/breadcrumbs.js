export const renderBreadcrumbs = breadcrumbs => {
  const list = document.querySelector('.breadcrumbs__list');
  list.innerHTML = '';

  breadcrumbs.forEach((crumb, index) => {
    const item = document.createElement('li');
    item.className = 'breadcrumbs__item';

    const text = document.createElement('span');
    text.className = 'breadcrumbs__text';
    text.textContent = crumb.title;

    if (index === breadcrumbs.length - 1) {
      item.append(text);
      item.ariaCurrent = 'page';
    } else {
      const link = document.createElement('a');
      link.className = 'breadcrumbs__link underline-link';
      link.href = crumb.href;
      link.ariaLabel = crumb.ariaLabel;

      link.append(text);
      item.append(link);
    }

    list.append(item);
  });
};
