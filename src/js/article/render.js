import {
  createHeader,
  createContent,
  createFooter,
} from './createElements.js';

const renderArticlePage = (articleData, userData) => {
  const article = document.querySelector('.article');

  const header = createHeader(articleData.title);
  const content = createContent(articleData.body);
  const footer = createFooter(userData.id, userData.name);

  article.append(header, content, footer);

  const breadcrumbsItem = document.querySelector('[aria-current="page"]');
  breadcrumbsItem.textContent = articleData.title;
};

export const loadPost = async (id) => {
  const url = `https://gorest.co.in/public/v2/posts/${id}`;
  let response = await fetch(url);
  const post = await response.json();

  const userUrl = `https://gorest.co.in/public/v2/users/${post.user_id}`;
  response = await fetch(userUrl);
  const user = await response.json();

  renderArticlePage(post, user);
};
