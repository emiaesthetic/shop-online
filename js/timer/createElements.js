export const createTitle = () => {
  const title = document.createElement('h3');
  title.classList.add('timer__title');
  title.textContent = 'До конца осталось';
  return title;
};

const createTimeRow = (className) => {
  const timeRow = document.createElement('p');
  timeRow.classList.add(className);

  const spanNumber = document.createElement('span');
  spanNumber.classList.add('timer__number');

  const spanUnits = document.createElement('span');
  spanUnits.classList.add('timer__units');

  timeRow.append(spanNumber, spanUnits);
  timeRow.number = spanNumber;
  timeRow.units = spanUnits;

  return timeRow;
};

export const createTime = () => {
  const time = document.createElement('div');
  time.classList.add('timer__time');

  const days = createTimeRow('timer__days');
  const hours = createTimeRow('timer__hours');
  const minutes = createTimeRow('timer__minutes');

  time.append(days, hours, minutes);

  return {
    time,
    days,
    hours,
    minutes,
  };
};

export const changeTextColor = (elem) => elem.classList.add('timer--over-soon');
