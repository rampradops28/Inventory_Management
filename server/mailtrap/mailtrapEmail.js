import { mailtrapClient, sender } from "./mailtrapConfig.js";
import { errorHandler } from "../utils/errorHandler.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

// send verification email
export const sendVerificationEmail = async (email, token, next) => {
  try {
    const recipient = [{ email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
      category: "Verification Email",
    });

    console.log("verification email sent", response);
  } catch (error) {
    console.log("error in verification email sending", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// send welcome email
export const sendWelcomeEmail = async (email, name, creationDate, next) => {
  try {
    const recipient = [{ email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to our platform",
      html: WELCOME_EMAIL_TEMPLATE.replace("{email}", email)
        .replace("{name}", name)
        .replace("{creationDate}", creationDate),
    });

    console.log("welcome email sent", response);
  } catch (error) {
    console.log("error in welcome email sending", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// send password reset request email
export const sendPasswordResetRequestEmail = async (email, resetURL, next) => {
  try {
    const recipient = [{ email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset Request",
    });

    console.log("password reset request email sent", response);
  } catch (error) {
    console.log("error in password reset request email sending", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// send password reset success email
export const sendPasswordResetSuccessEmail = async (email, next) => {
  try {
    const recipient = [{ email }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("password reset success email sent", response);
  } catch (error) {
    console.log("error in password reset success email sending", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
