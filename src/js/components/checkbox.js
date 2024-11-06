export const createCheckbox = ({
  labelClassName,
  inputClassName,
  inputName,
  spanClassName,
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

  label.append(checkbox, span);
  return {
    label,
    checkbox,
  };
};
