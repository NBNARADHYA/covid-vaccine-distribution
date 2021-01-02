import { PatientProfile } from "../../entity/PatientProfile";

const isDate = (date: Date): boolean =>
  Object.prototype.toString.call(date) === "[object Date]" &&
  !isNaN(date.getTime());

export const validate = ({
  ageBand,
  asthma,
  cardiovascular,
  contactOtherCovid,
  copd,
  dateSymptoms,
  covidRes,
  dateDied,
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
}: PatientProfile): string[] => {
  const errors: string[] = [];

  if (!ageBand) errors.push("ageBand required");
  else if (isNaN(ageBand)) errors.push("Invalid ageBand");

  Object.entries({
    sex,
    patientType,
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
    if (!value) errors.push(`${field} required`);
    else if (isNaN(value) || (value !== 1 && value !== 2))
      errors.push(`Invalid ${field}`);
  });

  if (!covidRes) errors.push("covidRes required");
  else if (
    isNaN(covidRes) ||
    (covidRes !== 1 && covidRes !== 2 && covidRes !== 3)
  )
    errors.push("Invalid covidRes");

  if (!dateSymptoms) errors.push("dateSymptoms required");
  else if (!isDate(new Date(dateSymptoms))) errors.push("Invalid dateSymptoms");

  if (dateDied && !isDate(new Date(dateDied))) errors.push("Invalid dateDied");

  return errors;
};
