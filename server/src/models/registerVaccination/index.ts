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
    const patients = await dbConnection.getRepository(User).find({
      where: { state: adminLocation, isVaccinated: false },
      order: { covidVulnerabilityScore: "DESC" },
      take: numVaccines,
    });

    const recipientEmails: string = patients
      .map((patient) => patient.email)
      .join(",");

    await sendMail({
      to: recipientEmails,
      subject: "Covid Vaccination schedule",
      html: `<div>Hi ! Your covid vaccination has been scheduled on 
                ${new Date(dateOfVaccination).toDateString()}
            </div>`,
    });

    return true;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
