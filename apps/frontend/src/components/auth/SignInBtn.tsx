import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
export default function SignInBtn() {
  return (
    <Button asChild>
      <SignInButton>Sign In</SignInButton>
    </Button>
  );
}
