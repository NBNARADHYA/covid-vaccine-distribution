import { getConnection } from "typeorm";
import { PatientProfile } from "../../entity/PatientProfile";
import { User } from "../../entity/User";

export interface AddPatientProfileProps extends PatientProfile {
  user: User;
}

export const addPatientProfile = async ({
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
  user,
}: AddPatientProfileProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const patientProfile = new PatientProfile();

  patientProfile.ageBand = ageBand;
  patientProfile.asthma = asthma;
  patientProfile.cardiovascular = cardiovascular;
  patientProfile.contactOtherCovid = contactOtherCovid;
  patientProfile.copd = copd;
  patientProfile.dateSymptoms = dateSymptoms;
  patientProfile.covidRes = covidRes;
  patientProfile.dateDied = dateDied;
  patientProfile.diabetes = diabetes;
  patientProfile.hypertension = hypertension;
  patientProfile.icu = icu;
  patientProfile.inmsupr = inmsupr;
  patientProfile.intubed = intubed;
  patientProfile.obesity = obesity;
  patientProfile.otherDisease = otherDisease;
  patientProfile.patientType = patientType;
  patientProfile.pneumonia = pneumonia;
  patientProfile.pregnancy = pregnancy;
  patientProfile.renalChronic = renalChronic;
  patientProfile.sex = sex;
  patientProfile.tobacco = tobacco;

  try {
    await dbConnection.getRepository(PatientProfile).insert(patientProfile);

    //  Call ML model here to get covidVulnerabilityScore
    //  Then covidVulnerabilityScore is also updated in the following query

    await dbConnection
      .getRepository(User)
      .update({ email: user.email }, { patientProfile });

    return true;
  } catch (error) {
    throw new Error("Internal Server error");
  }
};
