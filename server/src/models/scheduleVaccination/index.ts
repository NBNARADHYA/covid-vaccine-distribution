import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { sendMail } from "../utils/sendMail";

export const scheduleVaccination = async (
  adminId: number
): Promise<boolean> => {
  const dbConnection = getConnection();

  try {
    const userQb = dbConnection.getRepository(User).createQueryBuilder();

    // const subQuery = userQb
    //   .subQuery()
    //   .select(`user.id`)
    //   .from(User, "user")
    //   .where(`user.state = :state`, { state: adminLocation })
    //   .andWhere(`user.isVaccinated = :isVaccinated`, {
    //     isVaccinated: false,
    //   })
    //   .andWhere(`user.vaccinationDate IS NULL`)
    //   .andWhere(`user.isAdmin = :isAdmin`, { isAdmin: false })
    //   .orderBy(`covidVulnerabilityScore`, "DESC")
    //   .take(numVaccines)
    //   .getQuery();

    const result = await userQb
      .update()
      .set({ adminEmail: undefined })
      .where(`adminId = :adminId`, { adminId })
      .returning(["email", "dateOfVaccination"])
      .execute();

    const patients: { email: string; dateOfVaccination: string }[] = result.raw;

    patients.forEach((patient) => {
      sendMail({
        to: patient.email,
        subject: "Covid Vaccination schedule",
        html: `<div>Hi ! Your covid vaccination has been scheduled on
                    ${new Date(patient.dateOfVaccination).toDateString()}
                </div>`,
      });
    });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};
