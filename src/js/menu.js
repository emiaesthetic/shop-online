const menu = document.querySelector('.menu');
const menuList = document.querySelector('.menu__list');
const menuBtn = document.querySelector('.menu__button');
const dropdowns = document.querySelectorAll('.dropdown');

const isOpen = elem => elem.classList.contains('is-open');

const setHiddenAttribute = (target, element) => {
  target.setAttribute('aria-hidden', !isOpen(element));
};

const setExpandedAttribute = (target, element) => {
  target.setAttribute('aria-expanded', isOpen(element));
};

const menuControl = () => {
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    setHiddenAttribute(menuList, menu);
    setExpandedAttribute(menuBtn, menu);
  });
};

const dropdownControl = () => {
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
};

const updateAriaHidden = () => {
  dropdowns.forEach(item => {
    const content = item.querySelector('.dropdown__content');

    if (window.innerWidth >= 576) {
      content.setAttribute('aria-hidden', 'false');
    } else {
      content.setAttribute('aria-hidden', 'true');
    }
  });
};

menuControl();
dropdownControl();
window.addEventListener('resize', updateAriaHidden);
