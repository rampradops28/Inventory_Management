import React from "react";
import { Button } from "./ui/button";
import { app } from "../services/firebase";
import { useNavigate } from "react-router";
import { useUserStore } from "@/stores/useUserStore";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

function GoogleOAuth() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { google, googleLoading } = useUserStore();

  const handleSubmit = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle);
      await google(
        resultFromGoogle.user.email,
        resultFromGoogle.user.displayName,
        resultFromGoogle.user.photoURL,
        navigate
      );
    } catch (error) {
      console.error("error in google auth", error);
    }
  };
  return (
    <Button variant="default" className="w-full py-5" onClick={handleSubmit}>
      <img
        src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
        alt="Google"
        width="20"
        className="h-5 w-5"
      />
      <span>{googleLoading ? "Loading..." : "Sign in with Google"}</span>
    </Button>
  );
}

export default GoogleOAuth;
