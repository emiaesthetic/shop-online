export const createButton = ({ className, text, ariaLabel }) => {
  const button = document.createElement('button');
  button.className = className;
  if (text) button.textContent = text;
  if (ariaLabel) button.ariaLabel = ariaLabel;

  return button;
};
