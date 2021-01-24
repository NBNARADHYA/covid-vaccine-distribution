import { getConnection } from "typeorm";
import { User } from "../../entity/User";

interface PatientTrend {
  count: number;
  isVaccinated: boolean;
  vaccinationDate: string;
}

export const getPatientTrend = async (
  lastNumDays?: number
): Promise<PatientTrend[]> => {
  const dbConnection = getConnection();

  try {
    let query = dbConnection
      .getRepository(User)
      .createQueryBuilder()
      .select(`COUNT(email) AS count`)
      .addSelect(`"isVaccinated"`)
      .addSelect(`"vaccinationDate"`)
      .where(`"isAdmin" = false`)
      .andWhere(`"isSuperUser" = false`)
      .andWhere(`"adminEmail" IS NOT NULL`)
      .andWhere(`"vaccinationTimeSlot" IS NOT NULL`);

    if (lastNumDays) {
      query = query.andWhere(
        `TO_DATE(:currentDate, 'Dy Mon DD YYYY') - TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') <= :lastNumDays`,
        { currentDate: new Date().toDateString(), lastNumDays }
      );
    }
    const result: PatientTrend[] = await query
      .groupBy(`"isVaccinated"`)
      .addGroupBy(`"vaccinationDate"`)
      .orderBy(`TO_DATE("vaccinationDate", 'Dy Mon DD YYYY')`)
      .getRawMany();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
