import { loadPosts } from '../services/api.js';
import { renderPosts } from '../components/post-card.js';
import { renderPagination } from '../components/pagination.js';
import { renderBreadcrumbs } from '../components/breadcrumbs.js';

export const renderBlogPage = () => {
  if (!document.querySelector('#blogPage')) return;

  const paramsFromUrl = new URLSearchParams(window.location.search);
  const pageNum = paramsFromUrl.has('page') ? +paramsFromUrl.get('page') : 1;

  const breadcrumbs = [
    {
      title: 'Главная',
      href: '/',
      ariaLabel: 'Вернуться на главную',
    },
    {
      title: 'Блог',
    },
  ];

  renderBreadcrumbs('blogPage', breadcrumbs);
  loadPosts(pageNum, { renderPosts, renderPagination });
};
