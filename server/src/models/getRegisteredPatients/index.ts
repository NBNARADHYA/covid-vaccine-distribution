import { getConnection } from "typeorm";
import { User } from "../../entity/User";

interface PatientDetail {
  email: string;
  firstName: string;
  lastName?: string;
  vaccinationDate?: string;
  covidVulnerabilityScore?: number;
}

export const getRegisteredPatients = async (
  adminState: number
): Promise<PatientDetail[]> => {
  const dbConnection = getConnection();

  try {
    const patientsData = await dbConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .where(`state = :adminState`, { adminState })
      .andWhere(`user.vaccinationDate IS NOT NULL`)
      .orderBy(`user.vaccinationDate`, "ASC")
      .orderBy(`user.covidVulnerabilityScore`, "DESC")
      .getMany();

    return patientsData.map(
      ({
        email,
        firstName,
        lastName,
        vaccinationDate,
        covidVulnerabilityScore,
      }) => ({
        email,
        firstName,
        lastName,
        vaccinationDate,
        covidVulnerabilityScore,
      })
    );
  } catch (error) {
    return [];
  }
};
