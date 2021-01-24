import { getConnection } from "typeorm";
import { User } from "../../entity/User";

export const getPatientTrend = async (
  lastNumDays?: number
): Promise<boolean> => {
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
    const result = await query
      .groupBy(`"isVaccinated"`)
      .addGroupBy(`"vaccinationDate"`)
      .getRawMany();

    console.log(result);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
