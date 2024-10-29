export const createButton = ({ className, text, svg, ariaLabel }) => {
  const button = document.createElement('button');
  button.className = className;
  if (text) button.textContent = text;
  if (svg) button.innerHTML = svg;
  if (ariaLabel) button.ariaLabel = ariaLabel;

  return button;
};
