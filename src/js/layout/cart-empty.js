export const renderCartEmpty = () => {
  const cart = document.querySelector('.cart');
  cart.innerHTML = `
    <div class="container">
      <section class="cart-empty cart-section">
        <h2 class="cart-empty__title title title--sm">Корзина</h2>
        <div class="cart-empty__content">
          <picture class="cart-empty__image">
            <img
              src="./img/cart/cart-empty.png" alt="Пустая корзина"
              width="224" height="224" loading="lazy"
            >
          </picture>
          <p class="cart-empty__text">Корзина пока пуста...</p>
        </div>
      </section>
    </div>
  `;
};
