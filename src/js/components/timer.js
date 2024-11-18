import { formatUnits, formatToDate } from '../helpers/timerUtils.js';

const createTitle = () => {
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

const createTime = () => {
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

const isNotEmptyDeadline = () =>
  !document.querySelector('[data-timer-deadline]');

const getCurrentDate = () => {
  const currentDate = new Date();
  const timeZoneOffset = currentDate.getTimezoneOffset();
  return currentDate.getTime() + (timeZoneOffset + 180) * 60 * 1000;
};

export const renderTimer = () => {
  if (isNotEmptyDeadline()) return;

  const title = createTitle();
  const { time, days, hours, minutes } = createTime();

  const container = document.querySelector('[data-timer-deadline]');
  container.classList.remove('timer--skeleton');
  container.innerHTML = '';
  container.append(title, time);

  const getTimeRemaining = () => {
    const deadline = container.dataset.timerDeadline;
    const dateStop = new Date(deadline).getTime();
    const dateNow = getCurrentDate();
    const timeRemaining = dateStop - dateNow;

    const { days, hours, minutes, seconds } = formatToDate(timeRemaining);
    return { timeRemaining, days, hours, minutes, seconds };
  };

  const updateTime = () => {
    const timer = getTimeRemaining();

    days.number.textContent = timer.days.toString().padStart(2, '0');
    days.units.textContent = formatUnits('days', timer.days);

    hours.number.textContent = timer.hours.toString().padStart(2, '0');
    hours.units.textContent = formatUnits('hours', timer.hours);

    minutes.number.textContent = timer.minutes.toString().padStart(2, '0');
    minutes.units.textContent = formatUnits('minutes', timer.minutes);

    const intervalID = setTimeout(updateTime, timer.seconds * 1000);

    if (timer.timeRemaining < 0) {
      container.innerHTML = '';
      clearTimeout(intervalID);
    }
  };

  updateTime();
};
