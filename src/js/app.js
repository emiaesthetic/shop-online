import { renderMenu } from './components/menu.js';
import { renderHomePage } from './pages/home.js';
import { renderCategoryPage } from './pages/category.js';
import { renderProductPage } from './pages/product.js';
import { updateCartCounter, renderCartPage } from './pages/cart.js';
import { renderBlogPage } from './pages/blog.js';
import { renderArticlePage } from './pages/article.js';

const init = async () => {
  renderMenu();
  renderHomePage();
  renderCategoryPage();
  renderProductPage();
  renderCartPage();
  renderBlogPage();
  renderArticlePage();

  updateCartCounter();
};

init();
