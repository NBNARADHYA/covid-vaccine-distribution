import { isDate } from "../../utils/isDate";

export const validate = (values) => {
  const {
    age,
    asthma,
    cardiovascular,
    contactOtherCovid,
    copd,
    dateSymptoms,
    covidTestResult,
    diabetes,
    hypertension,
    icu,
    inmsupr,
    intubed,
    obesity,
    otherDisease,
    patientType,
    pneumonia,
    pregnancy,
    renalChronic,
    sex,
    tobacco,
  } = values;
  const errors = {};

  if (!age) errors.age = "age required";
  else if (isNaN(age) || +age < 0 || +age > 150) errors.age = "Invalid age";

  Object.entries({
    sex,
    intubed,
    pneumonia,
    pregnancy,
    diabetes,
    copd,
    asthma,
    inmsupr,
    hypertension,
    otherDisease,
    cardiovascular,
    obesity,
    renalChronic,
    tobacco,
    contactOtherCovid,
    icu,
  }).forEach(([field, value]) => {
    if (value === "" || value === undefined || value === null)
      errors[field] = `${field} required`;
    else if (isNaN(value) || (+value !== 1 && +value !== 0))
      errors[field] = `Invalid ${field}`;
  });

  if (
    covidTestResult === "" ||
    covidTestResult === undefined ||
    covidTestResult === null
  )
    errors.covidTestResult = "covidTestResult required";
  else if (
    isNaN(covidTestResult) ||
    (+covidTestResult !== 0 && +covidTestResult !== 1 && +covidTestResult !== 2)
  )
    errors.covidTestResult = "Invalid covidTestResult";

  if (patientType === "" || patientType === undefined || patientType === null)
    errors.patientType = "patientType required";
  else if (isNaN(patientType) || (+patientType !== 1 && +patientType !== 2))
    errors.patientType = "Invalid patientType";

  if (!dateSymptoms) errors.dateSymptoms = "dateSymptoms required";
  else if (!isDate(new Date(dateSymptoms)))
    errors.dateSymptoms = "Invalid dateSymptoms";

  return errors;
};
