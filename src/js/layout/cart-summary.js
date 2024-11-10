import { createButton } from '../components/button.js';
import { createCheckbox } from '../components/checkbox.js';
import {
  formatPrice,
  getTotalCurrentPrice,
  getTotalOriginalPrice,
  getTotalDiscountPrice,
} from '../helpers/productUtils.js';

const createHeader = price => {
  const header = document.createElement('header');
  header.className = 'cart-summary__header';
  header.innerHTML = `
    <h2 class="cart-summary__title">Итого:</h2>
    <span class="cart-summary__total">${formatPrice(price)}</span>
  `;

  return header;
};

const createFooter = () => {
  const footer = document.createElement('footer');
  footer.className = 'cart-summary__footer';

  const orderBtn = createButton({
    className: 'cart-summary__order-button button button--accent',
    text: 'Заказать',
  });
  orderBtn.disabled = true;

  const { label, checkbox } = createCheckbox({
    labelClassName: 'cart-summary__terms',
    inputClassName: 'checkbox-input',
    inputName: 'terms-agreement',
    spanClassName: 'cart-summary__terms-checkbox checkbox',
  });

  checkbox.addEventListener('click', () => {
    orderBtn.disabled = !checkbox.checked;
  });

  const span = document.createElement('span');
  span.className = 'cart-summary__terms-text';
  span.innerHTML = `
    Согласен с условиями
    <a class="cart-summary__terms-link" href="#" target="_blank">
      правил пользования торговой площадкой и правилами возврата
    </a>
  `;

  label.append(span);
  footer.append(orderBtn, label);

  return footer;
};

export const renderCartSummary = (goods, totalQuantity) => {
  const cartSummary = document.querySelector('.cart-summary');
  cartSummary.innerHTML = `
    ${createHeader(getTotalCurrentPrice(goods)).outerHTML}

    <div class="cart-summary__price">
      <div class="cart-summary__price-item">
        <span class="cart-summary__total-title">
          Товары, ${totalQuantity} шт.
        </span>
        <span class="cart-summary__total-price">
          ${formatPrice(getTotalOriginalPrice(goods))}
        </span>
      </div>
      <div class="cart-summary__price-item">
        <span class="cart-summary__discount-title">Скидка</span>
        <span class="cart-summary__discount-price">
          ${formatPrice(getTotalDiscountPrice(goods))}
        </span>
      </div>
      <div class="cart-summary__price-item">
        <span>Доставка</span>
        <span>Бесплатно</span>
      </div>
    </div>

    <div class="cart-summary__delivery">
      <div class="cart-summary__delivery-header cart-summary__full-width">
        <span class="cart-summary__label">Доставка:</span>
        <span class="cart-summary__value">Пункт выдачи</span>
      </div>
      <div class="cart-summary__delivery-description">
        <p class="cart-summary__delivery-text">Ежедневно 10:00 - 21:00</p>
        <address class="cart-summary__delivery-text">
          г. Москва (Московская область), улица Павлика Морозова, д. 48
        </address>
      </div>
    </div>

    <div class="cart-summary__date cart-summary__full-width">
      <span class="cart-summary__label">Дата:</span>
      <span class="cart-summary__value">10-13 февраля</span>
    </div>

    <div class="cart-summary__payment cart-summary__full-width">
      <span class="cart-summary__label">Оплата:</span>
      <span class="cart-summary__value">Картой</span>
    </div>

    ${createFooter().outerHTML}
  `;
};
