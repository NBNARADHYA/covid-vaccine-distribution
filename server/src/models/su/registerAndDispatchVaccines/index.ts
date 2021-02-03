import { Point } from "geojson";
import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { sendMail } from "../../utils/sendMail";

const getVaccinationDate = (adminSUDist: number): string => {
  let numDays = Math.ceil(adminSUDist / (1000 * 250));
  if (!numDays) numDays = 1;

  const vaccinationDate = new Date();
  vaccinationDate.setDate(vaccinationDate.getDate() + numDays);

  return vaccinationDate.toDateString();
};

export const registerAndDispatchVaccines = async (
  numVaccines: number,
  suLocation: Point
): Promise<boolean> => {
  const dbConnection = getConnection();

  try {
    // Get patients with highest scores and also their respective nearest vaccination centers
    const patients: {
      adminSUDist: number;
      adminEmail: string;
      patientEmail: string;
    }[] = await dbConnection.getRepository(User).query(
      `SELECT 
        "nearestAdmin"."dist" AS "adminSUDist",
        "nearestAdmin"."adminEmail" AS "adminEmail",
        "patient"."email" AS "patientEmail"
        FROM 
          "user" "patient"
        INNER JOIN LATERAL
          (SELECT 
            "admin"."email" AS "adminEmail",
            ST_DISTANCE(
              "admin"."location", 
              ST_GeomFromGeoJSON($1)::geography
            ) AS dist 
            FROM "user" "admin"
            WHERE "admin"."isAdmin" = $2 AND "admin"."isSuperUser" = $3 AND "admin"."isRoot" = $4
            ORDER BY "admin"."location" <-> patient.location ASC LIMIT 1
          ) "nearestAdmin" 
        ON TRUE
        WHERE
          "patient"."isVaccinated" = $5 AND 
          "patient"."vaccinationDate" IS NULL AND 
          "patient"."isRoot" = $6 AND
          "patient"."isSuperUser" = $7 AND
          "patient"."isAdmin" = $8 AND
          "patient"."covidVulnerabilityScore" IS NOT NULL
        ORDER BY "patient"."covidVulnerabilityScore" DESC
        LIMIT $9`,
      [
        JSON.stringify(suLocation),
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        numVaccines,
      ]
    );

    if (!patients.length) {
      return true;
    }

    // Update patients' entries to include their vaccination center email and date of vaccination
    await dbConnection
      .getRepository(User)
      .createQueryBuilder()
      .update()
      .set({
        vaccinationDate: () => `"patientList"."vaccinationDate"`,
        adminEmail: () =>
          `"patientList"."adminEmail" FROM (VALUES ${patients
            .map(
              ({ adminEmail, patientEmail, adminSUDist }) =>
                `('${patientEmail}', '${adminEmail}', '${getVaccinationDate(
                  adminSUDist
                )}')`
            )
            .join(
              `,`
            )} ) AS "patientList"("patientEmail", "adminEmail", "vaccinationDate")`,
      })
      .where(`"user"."email" = "patientList"."patientEmail"`)
      .execute();

    // Notify vaccination centers about the patients who have been registered vaccines
    // asking the admin to schedule vaccination
    // for those patients
    const admins: {
      [key: string]: { deliveryDate: string; patients: string[] };
    } = {};

    patients.forEach(({ adminEmail, patientEmail, adminSUDist }) => {
      if (admins[adminEmail]) {
        admins[adminEmail]!.patients.push(patientEmail);
      }

      if (!admins[adminEmail])
        admins[adminEmail] = {
          deliveryDate: getVaccinationDate(adminSUDist),
          patients: [patientEmail],
        };
    });

    Object.entries(admins).forEach(
      ([adminEmail, { deliveryDate, patients }]) => {
        sendMail({
          to: adminEmail,
          subject: `Covid vaccine delivery`,
          html: `<p>
                <div>Hello!, We have dispatched Covid vaccines to your center for the following patients.</div>
                <ol>
                  ${patients.map((patient) => `<li>${patient}</li>`)}
                </ol>
                <div>The vaccines are going to arrive on ${deliveryDate}</div>
                <div><a href="${
                  process.env.WEB
                }/schedule_vaccination">Click here</a> to schedule vaccination for the above patients</div>
              </p>`,
        });
      }
    );

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
};
