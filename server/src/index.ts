import "reflect-metadata";
import "dotenv";
import { createConnection } from "typeorm";
import { server } from "./routers/server";

(async () => {
  try {
    await createConnection();

    const PORT: number = +(process.env.PORT || 5000);

    server.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.error(error);
  }
})();
