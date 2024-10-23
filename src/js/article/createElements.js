export const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('container');
  return container;
};

export const createHeader = title => {
  const header = document.createElement('header');
  header.classList.add('article__header');

  const h1 = document.createElement('h1');
  h1.classList.add('article__title', 'title');
  h1.textContent = title;

  header.append(h1);
  return header;
};

export const createContent = text => {
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('article__content');

  const paragraph = document.createElement('p');
  paragraph.classList.add('article__text');
  paragraph.textContent = text;

  contentWrapper.append(paragraph);
  return contentWrapper;
};

export const createFooter = (userID, userName) => {
  const footer = document.createElement('footer');
  footer.classList.add('article__footer');
  footer.innerHTML = `
    <a class="article__back underline-link" href="javascript:history.back()">
      <svg class="article__back-icon" width="18" height="12" aria-hidden="true">
        <use href="./img/sprite.svg#article-arrow-back"></use>
      </svg>
      <span class="article__back-text">К списку статей</span>
    </a>
    <a
      class="article__author underline-link"
      href="user.html?id=${userID || 6941861}"
    >
      ${userName || 'Emile Aesthetic'}
    </a>
  `;

  return footer;
};
