export const isDate = (date) =>
  Object.prototype.toString.call(date) === "[object Date]" &&
  !isNaN(date.getTime());
