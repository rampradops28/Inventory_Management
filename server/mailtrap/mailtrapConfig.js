import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_CLIENT,
  token: process.env.MAILTRAP_API_KEY,
});

export const sender = {
  email: "hello@projectsbysachinthana.me",
  name: "Lendify",
};
