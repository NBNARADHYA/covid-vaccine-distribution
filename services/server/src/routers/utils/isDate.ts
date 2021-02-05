export const isDate = (date: Date): boolean =>
  Object.prototype.toString.call(date) === "[object Date]" &&
  !isNaN(date.getTime());
