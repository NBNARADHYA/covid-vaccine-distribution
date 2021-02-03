import { Brackets, getConnection } from "typeorm";
import { User } from "../../entity/User";

interface PatientTrend {
  count: number;
  isVaccinated: boolean;
  vaccinationDate: string;
}

export const getPatientTrend = async (
  lastNumDays?: number,
  nextNumDays?: number
): Promise<PatientTrend[]> => {
  const dbConnection = getConnection();

  try {
    let query = dbConnection
      .getRepository(User)
      .createQueryBuilder()
      .select(`COUNT(email) AS count`)
      .addSelect(`"isVaccinated"`)
      .addSelect(`"vaccinationDate"`)
      .where(`"isRoot" = false`)
      .andWhere(`"isSuperUser" = false`)
      .andWhere(`"isAdmin" = false`)
      .andWhere(`"adminEmail" IS NOT NULL`)
      .andWhere(`"vaccinationTimeSlot" IS NOT NULL`);

    if (lastNumDays && nextNumDays) {
      query = query.andWhere(
        new Brackets((qb) =>
          qb
            .where(
              `TO_DATE(:currentDate, 'Dy Mon DD YYYY') - TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') BETWEEN 0 AND :lastNumDays`,
              { currentDate: new Date().toDateString(), lastNumDays }
            )
            .orWhere(
              `TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') - TO_DATE(:currentDate, 'Dy Mon DD YYYY') BETWEEN 0 AND :nextNumDays`,
              { currentDate: new Date().toDateString(), nextNumDays }
            )
        )
      );
    } else if (lastNumDays) {
      query = query.andWhere(
        `TO_DATE(:currentDate, 'Dy Mon DD YYYY') - TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') <= :lastNumDays`,
        { currentDate: new Date().toDateString(), lastNumDays }
      );
    } else if (nextNumDays) {
      query = query.andWhere(
        `TO_DATE("vaccinationDate", 'Dy Mon DD YYYY') - TO_DATE(:currentDate, 'Dy Mon DD YYYY') <= :nextNumDays`,
        { currentDate: new Date().toDateString(), nextNumDays }
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
