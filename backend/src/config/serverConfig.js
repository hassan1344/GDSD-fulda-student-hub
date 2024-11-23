import dotenv from "dotenv";
import findconfig from "find-config";

dotenv.config({ path: findconfig(".env") });

export default {
  PORT: process.env.PORT,
};
