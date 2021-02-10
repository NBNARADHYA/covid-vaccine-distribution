if (process.env.NODE_ENV === "development") {
  const { config } = require("dotenv");
  const devEnvironment = config();
  if (devEnvironment.error) {
    console.error(devEnvironment.error);
  }
}

import "reflect-metadata";
import { createConnection } from "typeorm";
import { createRootUser } from "./models/utils/createRootUser";
import { server } from "./routers/server";

(async () => {
  try {
    await createConnection();

    await createRootUser();

    const PORT: number = +(process.env.PORT || 5000);

    server.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.error(error);
  }
})();
