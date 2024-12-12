import dotenv from "dotenv";
import findconfig from "find-config";

dotenv.config({ path: findconfig(".env") });

export default {
  PORT: process.env.PORT,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};
