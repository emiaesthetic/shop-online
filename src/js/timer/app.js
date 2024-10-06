import {createTitle, createTime, changeTextColor} from './createElements.js';
import {formatUnits, formatToDate} from './utils.js';

const isNotEmptyDeadline = () =>
  !document.querySelector('[data-timer-deadline]');

const getCurrentDate = () => {
  const currentDate = new Date();
  const timeZoneOffset = currentDate.getTimezoneOffset();
  return currentDate.getTime() + ((timeZoneOffset + 180) * 60 * 1000);
};

export const createTimer = () => {
  if (isNotEmptyDeadline()) return;

  const title = createTitle();
  const {time, days, hours, minutes} = createTime();

  const container = document.querySelector('[data-timer-deadline]');
  container.append(title, time);

  const getTimeRemaining = () => {
    const deadline = container.dataset.timerDeadline;
    const dateStop = new Date(deadline).getTime();
    const dateNow = getCurrentDate();
    const timeRemaining = dateStop - dateNow;

    const {days, hours, minutes, seconds} = formatToDate(timeRemaining);
    return {timeRemaining, days, hours, minutes, seconds};
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

    if (timer.days === 0) {
      changeTextColor(container);
    }
  };

  updateTime();
};

createTimer();
