import { getConnection } from "typeorm";
import { PatientProfile } from "../../entity/PatientProfile";
import { User } from "../../entity/User";
import fetch, { RequestInit } from "node-fetch";

export interface AddPatientProfileProps extends PatientProfile {
  user: User;
}

const getDateDiff = (date1: string, date2: string): number => {
  const dateA = new Date(date1);
  const dateB = new Date(date2);
  return Math.round((dateA.getTime() - dateB.getTime()) / (1000 * 3600 * 24));
};

export const addPatientProfile = async ({
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
  user,
}: AddPatientProfileProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const patientProfile = new PatientProfile();

  const dateEntry: string = new Date().toISOString();

  patientProfile.ageBand = ageBand;
  patientProfile.asthma = asthma;
  patientProfile.cardiovascular = cardiovascular;
  patientProfile.contactOtherCovid = contactOtherCovid;
  patientProfile.copd = copd;
  patientProfile.dateSymptoms = dateSymptoms;
  patientProfile.covidTestResult = covidTestResult;
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
  patientProfile.dateEntry = dateEntry;

  try {
    await dbConnection.getRepository(PatientProfile).insert(patientProfile);

    //  Call ML model to get covidVulnerabilityScore
    //  Then covidVulnerabilityScore is also updated in the following query

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        covidTestResult,
        icu,
        ageBand,
        deltaDate: getDateDiff(dateEntry, dateSymptoms),
      }),
    };

    const res = await fetch(`${process.env.MODEL_SERVER}/`, requestOptions);
    const { death_prob: covidVulnerabilityScore } = await res.json();

    await dbConnection
      .getRepository(User)
      .update(
        { email: user.email },
        { patientProfile, covidVulnerabilityScore }
      );

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server error");
  }
};
