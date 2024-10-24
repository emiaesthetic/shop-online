export const formatUnits = (property, number) => {
  const dictionary = {
    days: ['день', 'дня', 'дней'],
    hours: ['час', 'часа', 'часов'],
    minutes: ['минута', 'минуты', 'минут'],
  };
  const cases = [2, 0, 1, 1, 1, 2];

  if (number % 100 > 4 && number % 100 < 20) {
    return dictionary[property][2];
  } else {
    const index = cases[number % 10 < 5 ? number % 10 : 5];
    return dictionary[property][index];
  }
};

export const formatToDate = timestamp => {
  const HOURS_PER_DAY = 24;
  const MINUTES_PER_HOUR = 60;
  const SECONDS_PER_MINUTE = 60;
  const MILLISECONDS_PER_SECOND = 1000;

  const days = Math.floor(
    timestamp /
      (HOURS_PER_DAY *
        MINUTES_PER_HOUR *
        SECONDS_PER_MINUTE *
        MILLISECONDS_PER_SECOND),
  );
  const hours = Math.floor(
    (timestamp /
      (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)) %
      HOURS_PER_DAY,
  );
  const minutes = Math.floor(
    (timestamp / (SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)) %
      MINUTES_PER_HOUR,
  );
  const seconds = Math.floor(
    (timestamp / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE,
  );

  return { days, hours, minutes, seconds };
};
