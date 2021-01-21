import { getConnection } from "typeorm";
import { User } from "../../../entity/User";

interface PatientDetail {
  email: string;
  firstName: string;
  lastName?: string;
  vaccinationDate?: string;
  covidVulnerabilityScore?: number;
}

interface ReturnType {
  scheduled: PatientDetail[];
  notScheduled: PatientDetail[];
  vaccinated: PatientDetail[];
}

export const getRegisteredPatients = async (
  adminEmail: string
): Promise<ReturnType> => {
  const dbConnection = getConnection();

  const patients: ReturnType = {
    scheduled: [],
    notScheduled: [],
    vaccinated: [],
  };

  try {
    const patientsData = await dbConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .where(`user.adminEmail = :adminEmail`, { adminEmail })
      .andWhere(`user.vaccinationDate IS NOT NULL`)
      .orderBy(`user.vaccinationDate`, "ASC")
      .orderBy(`user.covidVulnerabilityScore`, "DESC")
      .getMany();

    patientsData.forEach(
      ({
        email,
        firstName,
        lastName,
        vaccinationDate,
        covidVulnerabilityScore,
        isVaccinated,
        vaccinationTimeSlot,
        location,
      }) => {
        const data = {
          email,
          firstName,
          lastName,
          vaccinationDate,
          covidVulnerabilityScore,
          vaccinationTimeSlot,
          location,
        };
        if (isVaccinated) {
          patients.vaccinated.push(data);
        } else if (vaccinationTimeSlot) {
          patients.scheduled.push(data);
        } else patients.notScheduled.push(data);
      }
    );

    return patients;
  } catch (error) {
    return patients;
  }
};
