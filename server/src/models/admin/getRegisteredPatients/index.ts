import { getConnection } from "typeorm";
import { User } from "../../../entity/User";

export interface PatientDetail {
  email: string;
  firstName: string;
  lastName?: string;
  vaccinationDate?: string;
  covidVulnerabilityScore?: number;
  isVaccinated: boolean;
}

interface ReturnType {
  scheduled: PatientDetail[];
  notScheduled: PatientDetail[];
  vaccinated: PatientDetail[];
}

export const getRegisteredPatients = async (
  adminEmail: string,
  lastNumDays?: number
): Promise<ReturnType> => {
  const dbConnection = getConnection();

  const patients: ReturnType = {
    scheduled: [],
    notScheduled: [],
    vaccinated: [],
  };

  try {
    let query = dbConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .where(`user.adminEmail = :adminEmail`, { adminEmail })
      .andWhere(`user.vaccinationDate IS NOT NULL`);

    if (lastNumDays) {
      query = query.andWhere(
        `TO_DATE(:currentDate, 'Dy Mon DD YYYY') - TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') <= :lastNumDays`,
        { currentDate: new Date().toDateString(), lastNumDays }
      );
    }

    query = query
      .orderBy(`TO_DATE(user.vaccinationDate, 'Dy Mon DD YYYY')`)
      .addOrderBy(`user.covidVulnerabilityScore`, "DESC");

    const patientsData = await query.getMany();

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
          isVaccinated: !!isVaccinated,
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
