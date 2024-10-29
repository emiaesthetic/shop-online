export const createSVG = ({ className, id, width, height }) => {
  return `
    <svg
      class="${className}"
      width="${width}"
      height="${height}"
      aria-hidden="true"
    >
      <use href="./img/sprite.svg#${id}"></use>
    </svg>
  `;
};
