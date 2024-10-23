import {
  createContainer,
  createHeader,
  createContent,
  createFooter,
} from './createElements.js';

const renderArticlePage = (articleData, userData) => {
  const article = document.querySelector('.article');

  const container = createContainer();
  const header = createHeader(articleData.title);
  const content = createContent(articleData.body);
  const footer = createFooter(userData.id, userData.name);

  container.append(header, content, footer);
  article.append(container);

  const breadcrumbsItem = document.querySelector('[aria-current="page"]');
  breadcrumbsItem.innerHTML = `
    <a class="breadcrumbs__link underline-link" href="">${articleData.title}</a>
  `;
};

export const loadPost = async id => {
  const url = `https://gorest.co.in/public/v2/posts/${id}`;
  let response = await fetch(url);
  const post = await response.json();

  const userUrl = `https://gorest.co.in/public/v2/users/${post.user_id}`;
  response = await fetch(userUrl);
  const user = await response.json();

  renderArticlePage(post, user);
};
