export const getAgeBand = (age) => {
  age = +age;
  if (age < 2) return 8;
  else if (age < 10) return 6;
  else if (age < 20) return 7;
  else if (age < 30) return 0;
  else if (age < 40) return 4;
  else if (age < 50) return 2;
  else if (age < 60) return 1;
  else if (age < 80) return 3;
  else return 5;
};
