import moment from 'moment';

const DateTZ = (date: Date) => {
  return new Date(moment.utc(date).utcOffset('+06:30').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
};

export { DateTZ };
