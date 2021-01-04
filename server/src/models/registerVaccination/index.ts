import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { sendMail } from "../utils/sendMail";

interface RegisterVaccinationProps {
  numVaccines: number;
  dateOfVaccination: string;
  adminLocation: number;
}

export const registerVaccination = async ({
  numVaccines,
  dateOfVaccination,
  adminLocation,
}: RegisterVaccinationProps): Promise<boolean> => {
  const dbConnection = getConnection();

  try {
    const userQb = dbConnection.getRepository(User).createQueryBuilder();

    const subQuery = userQb
      .subQuery()
      .select(`user.id`)
      .from(User, "user")
      .where(`user.state = :state`, { state: adminLocation })
      .andWhere(`user.isVaccinated = :isVaccinated`, {
        isVaccinated: false,
      })
      .andWhere(`user.vaccinationDate IS NULL`)
      .andWhere(`user.isAdmin = :isAdmin`, { isAdmin: false })
      .orderBy(`covidVulnerabilityScore`, "DESC")
      .take(numVaccines)
      .getQuery();

    const result = await userQb
      .update()
      .set({ vaccinationDate: new Date(dateOfVaccination).toDateString() })
      .where(`id IN ${subQuery}`)
      .returning("email")
      .execute();

    const patients: { email: string }[] = result.raw;

    const recipientEmails: string = patients
      .map((patient) => patient.email)
      .join(",");

    sendMail({
      to: recipientEmails,
      subject: "Covid Vaccination schedule",
      html: `<div>Hi ! Your covid vaccination has been scheduled on
                ${new Date(dateOfVaccination).toDateString()}
            </div>`,
    });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};
