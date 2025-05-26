import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  URL_ORIGIN,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  EMAIL,
  EMAIL_PASSWORD,
  DEFAULT_PASSWD,
  HOST_URL,
  API_URL,
} = process.env;
