import { PatientProfile } from "../../../entity/PatientProfile";
import { isDate } from "../../utils/isDate";

export const validate = ({
  ageBand,
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
}: PatientProfile): string[] => {
  const errors: string[] = [];

  if (ageBand === undefined || ageBand === null)
    errors.push("ageBand required");
  else if (isNaN(ageBand)) errors.push("Invalid ageBand");

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
    if (value === undefined || value === null) errors.push(`${field} required`);
    else if (isNaN(value) || (value != 1 && value != 0))
      errors.push(`Invalid ${field}`);
  });

  if (covidTestResult === undefined || covidTestResult === null)
    errors.push("covidTestResult required");
  else if (
    isNaN(covidTestResult) ||
    (covidTestResult != 0 && covidTestResult != 1 && covidTestResult != 2)
  )
    errors.push("Invalid covidTestResult");

  if (patientType === undefined || patientType === null)
    errors.push(`patientType required`);
  else if (isNaN(patientType) || (patientType != 1 && patientType != 2))
    errors.push(`Invalid patientType`);

  if (!dateSymptoms) errors.push("dateSymptoms required");
  else if (!isDate(new Date(dateSymptoms))) errors.push("Invalid dateSymptoms");

  return errors;
};
