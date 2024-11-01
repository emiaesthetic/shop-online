export const renderLoader = () => {
  const loader = document.createElement('div');
  loader.classList.add('loader');

  const circle = document.createElement('span');
  circle.classList.add('loader__circle');

  loader.append(circle);
  document.body.append(loader);
};

export const removeLoader = () => document.querySelector('.loader').remove();
