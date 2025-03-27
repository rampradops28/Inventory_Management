import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ModeToggle } from "../components/mode-toggle";
import verifyEmailPng from "../assets/images/verify_email.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

function Verify_email() {
  const { verifyEmail, loading } = useUserStore();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const otpSchema = z.string().regex(/^\d+$/, "OTP must contain only numbers");

  const handleVerify = async () => {
    try {
      otpSchema.parse(otp);
      setError("");
      await verifyEmail(otp, navigate);
    } catch (validationError) {
      setError(validationError.errors[0].message);
      e;
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  return (
    <div className="min-h-screen grid sm:grid-cols-2 justify-center items-center">
      <div className="mx-auto hidden sm:block">
        <img src={verifyEmailPng} alt="verify_email_img" />
      </div>
      <div className="mx-auto">
        <ModeToggle />
        <div className="text-center my-6">
          <h1 className="font-purple-purse text-4xl">
            Verify Your Email To Continue
          </h1>
          <h2 className="font-poppins text-2xl">
            Check your email for the OTP
          </h2>
        </div>
        <InputOTP maxLength={6} onChange={handleOtpChange}>
          <InputOTPGroup className="space-x-2 mx-auto my-4">
            <InputOTPSlot index={0} className="w-15 h-15" />
            <InputOTPSlot index={1} className="w-15 h-15" />
            <InputOTPSlot index={2} className="w-15 h-15" />
            <InputOTPSlot index={3} className="w-15 h-15" />
            <InputOTPSlot index={4} className="w-15 h-15" />
            <InputOTPSlot index={5} className="w-15 h-15" />
          </InputOTPGroup>
        </InputOTP>
        {error && <p className="text-red-500 text-sm m-2">{error}</p>}
        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleVerify}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
}

export default Verify_email;
