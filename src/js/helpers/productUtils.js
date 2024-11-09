export const formatPrice = price => {
  return new Intl.NumberFormat('ru-RU').format(Math.floor(price)) + '\u00A0₽';
};

export const calculateDiscountPrice = (price, discount, quantity = 1) => {
  const discountAmount = price * (discount / 100);
  return Math.floor(price - discountAmount) * quantity;
};

export const calculateMonthlyPayment = (price, quantity = 1) => {
  const downPayment = price * 0.2;
  const annualRate = 12;
  const termMonths = 12;

  const loanAmount = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.floor(monthlyPayment) * quantity;
};

export const getTotalCurrentPrice = goods =>
  goods.reduce((acc, { price, discount, quantity }) => {
    acc += discount
      ? calculateDiscountPrice(price, discount, quantity)
      : price * quantity;
    return acc;
  }, 0);

export const getTotalOriginalPrice = goods => {
  return goods.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
};

export const getTotalDiscountPrice = goods => {
  return getTotalOriginalPrice(goods) - getTotalCurrentPrice(goods);
};
