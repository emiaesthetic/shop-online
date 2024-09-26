const dropdownTitleGroup = document.querySelectorAll('.footer__dropdown-title');

dropdownTitleGroup.forEach(title => {
  title.addEventListener('click', () => {
    if (title.classList.contains('active')) {
      title.classList.remove('active');
      title.ariaExpanded = 'false';
    } else {
      title.classList.add('active');
      title.ariaExpanded = 'true';
    }
  });
});
