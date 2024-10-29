export const calculateDiscountPrice = (price, discount) => {
  const discountAmount = price * (discount / 100);
  return Math.floor(price - discountAmount);
};

export const calculateMonthlyPayment = (price, discount) => {
  if (discount) {
    price = calculateDiscountPrice(price, discount);
  }

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
