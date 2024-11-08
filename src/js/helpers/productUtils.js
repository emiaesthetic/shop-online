export const formatPrice = price => {
  return new Intl.NumberFormat('ru-RU').format(Math.floor(price)) + '\u00A0₽';
};

export const calculateDiscountPrice = (price, discount) => {
  const discountAmount = price * (discount / 100);
  return Math.floor(price - discountAmount);
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

  return Math.floor(monthlyPayment);
};

const getNumber = string => parseFloat(string.replace(/[^\d.-]/g, ''));

export const recalculatePrices = (itemID, quantity, newQuantity) => {
  const cartPrices = document.querySelector(`[data-id="${itemID}"]`);

  const currentPrice = cartPrices.querySelector('.cart-item__discounted-price');
  const currentPriceValue = getNumber(currentPrice.textContent) / quantity;
  currentPrice.textContent = formatPrice(currentPriceValue * newQuantity);

  const creditPrice = cartPrices.querySelector('.cart-item__credit');
  const creditPriceValue = getNumber(creditPrice.textContent) / quantity;
  creditPrice.textContent = formatPrice(creditPriceValue * newQuantity);

  const originalPrice = cartPrices.querySelector(
    '.cart-item__non-discounted-price',
  );
  if (originalPrice) {
    const originalPriceValue = getNumber(originalPrice.textContent) / quantity;
    originalPrice.textContent = formatPrice(originalPriceValue * newQuantity);
  }
};
