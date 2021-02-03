import { getConnection } from "typeorm";
import { PatientProfile } from "../../../entity/PatientProfile";
import { User } from "../../../entity/User";
import { pythonExec } from "../../utils/pythonExec";

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
    const result = await pythonExec("mlModel/app.py", [
      JSON.stringify({
        ...restPatientDetails,
        deltaDate: getDateDiff(dateEntry, dateSymptoms),
      }),
    ]);

    if (result.length !== 1) {
      // Rollback
      await queryRunner.rollbackTransaction();
      throw new Error("Internal server error");
    }

    const covidVulnerabilityScore = parseFloat(result[0]!);

    if (isNaN(covidVulnerabilityScore) || covidVulnerabilityScore === 2) {
      // Rollback
      await queryRunner.rollbackTransaction();
      throw new Error("Internal server error");
    }

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
