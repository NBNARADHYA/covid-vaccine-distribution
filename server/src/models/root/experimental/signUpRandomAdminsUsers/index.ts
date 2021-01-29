import { point, nearestPoint, featureCollection } from "@turf/turf";
import { hash } from "bcryptjs";
import { internet, name } from "faker";
import { getConnection } from "typeorm";
import { User } from "../../../../entity/User";
import { timeSlots } from "../../../admin/scheduleVaccination/timeSlots";
import cities from "./cities.json";

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElementsFromArray = <T>(arr: T[], n: number) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

export const signUpRandomAdminsUsers = async (
  numAdmins: number,
  numUsers: number
): Promise<boolean> => {
  const dbConnection = getConnection();

  const admins: User[] = await Promise.all(
    getRandomElementsFromArray(cities, Math.min(numAdmins, cities.length)).map(
      async (city) => {
        const admin = new User();

        admin.email = internet.email();
        admin.firstName = city.city;
        admin.lastName = "Admin";
        admin.password = await hash("12345", 10);
        admin.isVerified = true;
        admin.isAdmin = true;
        admin.location = { type: "Point", coordinates: [+city.lat, +city.lng] };

        return admin;
      }
    )
  );

  const users: User[] = new Array(numUsers).fill(0).map(() => {
    const user = new User();

    user.email = internet.email();
    user.firstName = name.firstName();
    user.lastName = name.lastName();
    user.password = internet.password();
    user.isVerified = true;
    user.isVaccinated = 0.5 - Math.random() > 0;

    const date = new Date();
    if (user.isVaccinated) {
      date.setDate(date.getDate() - getRandomInt(1, 60));
      user.vaccinationDate = date.toDateString();
      user.vaccinationTimeSlot =
        timeSlots[getRandomInt(0, timeSlots.length - 1)];
    }

    user.covidVulnerabilityScore = Math.random();

    const { lat, lng } = cities[getRandomInt(0, cities.length - 1)]!;
    user.location = { type: "Point", coordinates: [+lat, +lng] };

    if (user.isVaccinated) {
      const userPoint = point(user.location.coordinates);
      const adminPoints = admins.map(({ location }) =>
        point(location.coordinates)
      );
      const nearestAdmin = nearestPoint(
        userPoint,
        featureCollection(adminPoints)
      );
      user.adminEmail = admins[nearestAdmin.properties.featureIndex]!.email;
    }

    return user;
  });

  try {
    await dbConnection.getRepository(User).insert([...admins, ...users]);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
