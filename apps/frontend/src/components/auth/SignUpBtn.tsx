import React from "react";
import { Button } from "../ui/button";
import { SignUpButton } from "@clerk/nextjs";

export default function SignUpBtn() {
  return (
    <Button asChild>
      <SignUpButton>Sign up</SignUpButton>
    </Button>
  );
}
