import {
  createContainer,
  createHeader,
  createContent,
  createFooter,
} from './createElements.js';

const renderPost = (articleData, userData) => {
  const article = document.querySelector('.article');

  const container = createContainer();
  const header = createHeader(articleData.title);
  const content = createContent(articleData.body);
  const footer = createFooter(userData.id, userData.name);

  container.append(header, content, footer);
  article.append(container);
};

export const loadPost = async (id) => {
  const url = `https://gorest.co.in/public/v2/posts/${id}`;
  let response = await fetch(url);
  const post = await response.json();

  const userUrl = `https://gorest.co.in/public/v2/users/${post.user_id}`;
  response = await fetch(userUrl);
  const user = await response.json();

  renderPost(post, user);
};
