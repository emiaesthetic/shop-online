export const createCheckbox = ({
  labelClassName,
  inputClassName,
  inputName,
  spanClassName,
  text,
}) => {
  const label = document.createElement('label');
  label.className = labelClassName;

  const checkbox = document.createElement('input');
  checkbox.className = inputClassName;
  checkbox.type = 'checkbox';
  checkbox.name = inputName;

  const span = document.createElement('span');
  span.className = spanClassName;
  span.ariaHidden = true;

  const spanText = document.createElement('span');
  spanText.textContent = text;

  label.append(checkbox, span, spanText);
  return {
    label,
    checkbox,
  };
};
