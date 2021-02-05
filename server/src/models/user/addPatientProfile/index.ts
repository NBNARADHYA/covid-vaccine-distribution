import fetch from "node-fetch";
import { getConnection } from "typeorm";
import { PatientProfile } from "../../../entity/PatientProfile";
import { User } from "../../../entity/User";

export interface AddPatientProfileProps extends PatientProfile {
  user: User;
}

const getDateDiff = (date1: string, date2: string): number => {
  const dateA = new Date(date1);
  const dateB = new Date(date2);
  return Math.round((dateA.getTime() - dateB.getTime()) / (1000 * 3600 * 24));
};

export const addPatientProfile = async ({
  dateSymptoms,
  user,
  ...restPatientDetails
}: AddPatientProfileProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const queryRunner = dbConnection.createQueryRunner();

  // Start a transaction
  await queryRunner.startTransaction();

  let patientProfile = new PatientProfile();

  patientProfile = Object.assign<PatientProfile, typeof restPatientDetails>(
    patientProfile,
    restPatientDetails
  );

  const dateEntry: string = new Date().toISOString();

  patientProfile.dateSymptoms = new Date(dateSymptoms).toISOString();
  patientProfile.dateEntry = dateEntry;

  try {
    await queryRunner.manager
      .getRepository(PatientProfile)
      .insert(patientProfile);

    // Call ML model to get covidVulnerabilityScore
    const res = await fetch(`${process.env.MODEL_SERVER}/score/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...restPatientDetails,
        deltaDate: getDateDiff(dateEntry, dateSymptoms),
      }),
    });

    const { death_prob: covidVulnerabilityScore } = await res.json();

    // Update covidVulnerabilityScore in the user table
    await queryRunner.manager
      .getRepository(User)
      .update(
        { email: user.email },
        { patientProfile, covidVulnerabilityScore }
      );

    // Commit transaction
    await queryRunner.commitTransaction();

    return true;
  } catch (error) {
    queryRunner.rollbackTransaction();
    throw new Error("Internal Server error");
  } finally {
    queryRunner.release();
  }
};
