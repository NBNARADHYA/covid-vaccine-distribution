import "reflect-metadata";
import "dotenv";
import { createConnection } from "typeorm";
import express from "express";

(async () => {
  try {
    await createConnection();

    const app = express();

    const PORT: number = +(process.env.PORT || 5000);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.error(error);
  }
})();
