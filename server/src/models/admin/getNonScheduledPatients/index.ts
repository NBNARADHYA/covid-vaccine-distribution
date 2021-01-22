import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { PatientDetail } from "../getRegisteredPatients";

export const getNonScheduledPatients = async (
  adminEmail: string
): Promise<PatientDetail[]> => {
  const dbConnection = getConnection();

  try {
    const patients = await dbConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .where(`user.adminEmail = :adminEmail`, { adminEmail })
      .andWhere(`user.vaccinationDate IS NOT NULL`)
      .andWhere(`user.vaccinationTimeSlot IS NULL`)
      .orderBy(`user.vaccinationDate`, "ASC")
      .orderBy(`user.covidVulnerabilityScore`, "DESC")
      .getMany();

    return patients.map(
      ({
        email,
        firstName,
        lastName,
        vaccinationDate,
        covidVulnerabilityScore,
        vaccinationTimeSlot,
        location,
      }) => ({
        email,
        firstName,
        lastName,
        vaccinationDate,
        covidVulnerabilityScore,
        vaccinationTimeSlot,
        location,
      })
    );
  } catch (error) {
    return [];
  }
};
