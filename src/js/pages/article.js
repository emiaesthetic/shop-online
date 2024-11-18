import { renderBreadcrumbs } from '../components/breadcrumbs.js';
import { loadData } from '../services/api.js';
import { newsURL } from '../helpers/constants.js';

const renderArticleTitle = title => {
  const h1 = document.createElement('h1');
  h1.className = 'article__title title title--md';
  h1.textContent = title;

  const skeleton = document.querySelector('.article-skeleton__title');
  skeleton.replaceWith(h1);
};

const renderArticleContent = text => {
  const content = document.querySelector('.article__content');
  content.innerHTML = '';

  const paragraph = document.createElement('p');
  paragraph.className = 'article__text';
  paragraph.textContent = text;

  content.append(paragraph);
};

const renderArticleAuthor = (authorID, authorName) => {
  const link = document.createElement('a');
  link.className = 'article__author underline-link';
  link.href = `user.html?id=${authorID || '#'}`;
  link.textContent = authorName || 'Unknown';

  const skeleton = document.querySelector('.article-skeleton__author');
  skeleton.replaceWith(link);
};

export const renderArticlePage = async () => {
  if (!document.querySelector('#articlePage')) return;

  const paramsFromUrl = new URLSearchParams(window.location.search);
  const articleID = paramsFromUrl.get('id');

  const { title, body, user_id } = await loadData(
    newsURL,
    `posts/${articleID}`,
  );
  const { id, name } = (await loadData(newsURL, `users/${user_id}`)) || {};

  const breadcrumbs = [
    {
      title: 'Главная',
      href: 'index.html',
      ariaLabel: 'Вернуться на главную',
    },
    {
      title: 'Блог',
      href: 'javascript:history.back()',
      ariaLabel: 'Вернуться в раздел Блог',
    },
    {
      title: title,
    },
  ];

  document.title = `${title} - ShopOnline`;

  renderBreadcrumbs(breadcrumbs);
  renderArticleTitle(title);
  renderArticleContent(body);
  renderArticleAuthor(id, name);
};
