const isOpen = (elem) => elem.classList.contains('open');

const setHiddenAttribute = (element) => {
  element.setAttribute('aria-hidden', !isOpen(element));
};

const setExpandedAttribute = (element) => {
  element.setAttribute('aria-expanded', isOpen(element));
};

const init = () => {
  const menuList = document.querySelector('.menu__list');
  const menuBtn = document.querySelector('.menu__button');

  menuBtn.addEventListener('click', () => {
    menuList.classList.toggle('open');
    setHiddenAttribute(menuList);

    menuBtn.classList.toggle('open');
    setExpandedAttribute(menuBtn);
  });

  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(item => {
    const button = item.querySelector('.dropdown__button');
    const content = item.querySelector('.dropdown__content');

    button.addEventListener('click', () => {
      button.classList.toggle('open');
      setExpandedAttribute(button);

      content.classList.toggle('open');
      setHiddenAttribute(content);
    });
  });
};

init();
