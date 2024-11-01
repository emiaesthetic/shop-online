export const formatPrice = price => {
  return new Intl.NumberFormat('ru-RU').format(price) + '\u00A0₽';
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

export const preloadImages = images =>
  Promise.all(
    images.map(
      image =>
        new Promise((resolve, reject) => {
          image.addEventListener('load', () => {
            resolve();
          });
          image.addEventListener('error', () => {
            reject(new Error(`Не удалось загрузить изображение: ${image.src}`));
          });
        }),
    ),
  );
