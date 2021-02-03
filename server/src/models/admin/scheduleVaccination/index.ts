import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { timeSlots } from "./timeSlots";
import { sendMail } from "../../utils/sendMail";

const getTimeSlot = (patientsPerSlot: number, idx: number): string =>
  timeSlots[Math.floor(idx / patientsPerSlot) % timeSlots.length]!;

const getVaccinationDate = (
  patientsPerSlot: number,
  idx: number,
  prevDate: Date
): string => {
  const numDays = Math.floor(
    Math.floor(idx / patientsPerSlot) / timeSlots.length
  );
  prevDate.setDate(prevDate.getDate() + numDays);
  return prevDate.toDateString();
};

type ReturnType = {
  email: string;
  vaccinationDate: string;
  vaccinationTimeSlot: string;
}[];

export const scheduleVaccination = async (
  adminEmail: string,
  patientsPerSlot: number
): Promise<ReturnType> => {
  const dbConnection = getConnection();

  try {
    // Get patients who are registered under this vaccination center
    // in descending order of covidVulnerabilityScore
    const registeredPatients: {
      email: string;
      vaccinationDate: string;
    }[] = await dbConnection
      .getRepository(User)
      .createQueryBuilder()
      .select([`email`, `"vaccinationDate"`])
      .where(`"adminEmail" = :adminEmail`, { adminEmail })
      .andWhere(`"isVaccinated" = false`)
      .andWhere(`"vaccinationTimeSlot" IS NULL`)
      .orderBy(`"covidVulnerabilityScore"`, "DESC")
      .getRawMany();

    if (!registeredPatients.length) return [];

    // Compute the time slot of the patients according to patientsPerSlot
    // Also, new vaccinationDate if it has changed
    const registeredPatientsDetails: ReturnType = registeredPatients.map(
      ({ email, vaccinationDate }, idx) => ({
        email,
        vaccinationDate: getVaccinationDate(
          patientsPerSlot,
          idx,
          new Date(vaccinationDate)
        ),
        vaccinationTimeSlot: getTimeSlot(patientsPerSlot, idx),
      })
    );

    // Update the patients' entries with the new values computed
    await dbConnection
      .getRepository(User)
      .createQueryBuilder()
      .update()
      .set({
        vaccinationDate: () => `"patientList"."vaccinationDate"`,
        vaccinationTimeSlot: () =>
          `"patientList"."vaccinationTimeSlot" FROM (VALUES ${registeredPatientsDetails
            .map(
              ({ email, vaccinationDate, vaccinationTimeSlot }) =>
                `('${vaccinationTimeSlot}', '${email}', '${vaccinationDate}')`
            )
            .join(
              `,`
            )}) AS "patientList"("vaccinationTimeSlot", "email", "vaccinationDate")`,
      })
      .where(`"user"."email" = "patientList"."email"`)
      .execute();

    // Send mail to each patient about their
    // date and time slot of vaccination
    registeredPatientsDetails.forEach(
      ({ email, vaccinationDate, vaccinationTimeSlot }) => {
        sendMail({
          to: email,
          subject: "Covid Vaccination schedule",
          html: `<div>Hi ! Your covid vaccination has been scheduled on
                <b>${new Date(
                  vaccinationDate
                ).toDateString()}</b> in the time slot <b>${vaccinationTimeSlot}</b>
              </div>`,
        });
      }
    );

    return registeredPatientsDetails;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
