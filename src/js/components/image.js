export const createImage = ({ tag, className, src, width, height, alt }) => {
  const image = new Image(width, height);
  image.src = src;
  image.loading = 'lazy';

  if (alt) {
    image.alt = alt;
  } else {
    image.ariaHidden = true;
  }

  const imageWrapper = document.createElement(tag);
  imageWrapper.className = className;
  imageWrapper.append(image);

  return {
    imageWrapper,
    image,
  };
};

export const preloadImages = () => {
  const images = Array.from(document.images);
  return new Promise(resolve => {
    let loadedCount = 0;

    const checkIfAllImagesLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        resolve();
      }
    };

    images.forEach(image => {
      const img = new Image();
      img.src = image.src;
      img.onload = checkIfAllImagesLoaded;
      img.onerror = checkIfAllImagesLoaded;
    });
  });
};
