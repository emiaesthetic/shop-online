export const createImage = ({ tag, className, src, width, height, alt }) => {
  const image = new Image(width, height);
  image.src = src;
  image.alt = alt || 'image';
  image.loading = 'lazy';
  image.ariaHidden = !alt;

  const imageWrapper = document.createElement(tag);
  imageWrapper.className = className;
  imageWrapper.append(image);

  return {
    imageWrapper,
    image,
  };
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
