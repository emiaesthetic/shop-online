import { renderLoader } from './components/loader.js';
import { renderMenu } from './components/menu.js';
import { renderHomePage } from './pages/home.js';
import { renderCategoryPage } from './pages/category.js';
import { renderProductPage } from './pages/product.js';
import { renderCartPage } from './pages/cart.js';
import { renderBlogPage } from './pages/blog.js';
import { renderArticlePage } from './pages/article.js';
import { updateCartCounter } from './components/cart-counter.js';

const init = () => {
  renderLoader();
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
