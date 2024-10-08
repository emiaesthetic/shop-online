export const createTitle = () => {
  const title = document.createElement('h3');
  title.classList.add('timer__title');
  title.textContent = 'До конца акции:';
  return title;
};

const createTimeSegment = () => {
  const timeRow = document.createElement('div');
  timeRow.classList.add('timer__segment');

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

  const days = createTimeSegment();
  const hours = createTimeSegment();
  const minutes = createTimeSegment();

  time.append(days, hours, minutes);

  return {
    time,
    days,
    hours,
    minutes,
  };
};

export const changeTextColor = (elem) => elem.classList.add('');
