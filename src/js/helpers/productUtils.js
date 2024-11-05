export const formatPrice = price => {
  return new Intl.NumberFormat('ru-RU').format(Math.floor(price)) + '\u00A0₽';
};

export const calculateDiscountPrice = (price, discount) => {
  const discountAmount = price * (discount / 100);
  return formatPrice(Math.floor(price - discountAmount));
};

export const calculateMonthlyPayment = price => {
  const downPayment = price * 0.2;
  const annualRate = 12;
  const termMonths = 12;

  const loanAmount = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return formatPrice(Math.floor(monthlyPayment));
};

const getNumber = string => parseFloat(string.replace(/[^\d.-]/g, ''));

export const recalculatePrices = (prices, prevQuantity, currentQuantity) => {
  const currentPrice = prices.querySelector('.cart-item__discounted-price');
  currentPrice.textContent = formatPrice(
    (getNumber(currentPrice.textContent) / prevQuantity) * currentQuantity,
  );

  const creditPrice = prices.querySelector('.cart-item__credit');
  creditPrice.textContent = formatPrice(
    (getNumber(creditPrice.textContent) / prevQuantity) * currentQuantity,
  );

  const originalPrice = prices.querySelector(
    '.cart-item__non-discounted-price',
  );
  if (originalPrice) {
    originalPrice.textContent = formatPrice(
      (getNumber(originalPrice.textContent) / prevQuantity) * currentQuantity,
    );
  }
};
