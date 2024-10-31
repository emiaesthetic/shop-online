import { createContainer } from '../layout/container.js';
import { loadData } from '../services/api.js';
import { newsURL } from '../helpers/constants.js';

const createHeader = title => {
  const header = document.createElement('header');
  header.classList.add('article__header');

  const h1 = document.createElement('h1');
  h1.classList.add('article__title', 'title', 'title--md');
  h1.textContent = title;

  header.append(h1);
  return header;
};

const createContent = text => {
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('article__content');

  const paragraph = document.createElement('p');
  paragraph.classList.add('article__text');
  paragraph.textContent = text;

  contentWrapper.append(paragraph);
  return contentWrapper;
};

const createFooter = (userID, userName) => {
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

const displayContent = (articleData, userData) => {
  const article = document.querySelector('.article');
  const container = createContainer();
  const header = createHeader(articleData.title);
  const content = createContent(articleData.body);
  const footer = createFooter(
    userData?.id || 1,
    userData?.name || 'Emile Aesthetic',
  );

  container.append(header, content, footer);
  article.append(container);

  const breadcrumbsItem = document.querySelector('[aria-current="page"]');
  breadcrumbsItem.innerHTML = `
    <a class="breadcrumbs__link underline-link" href="#">
      ${articleData.title}
    </a>
  `;
};

export const renderArticlePage = async () => {
  if (!document.querySelector('#articlePage')) return;

  const paramsFromUrl = new URLSearchParams(window.location.search);
  const articleID = paramsFromUrl.get('id');

  const articleData = await loadData(newsURL, `posts/${articleID}`);
  const userData = await loadData(newsURL, `users/${articleData.user_id}`);
  displayContent(articleData, userData);
};
