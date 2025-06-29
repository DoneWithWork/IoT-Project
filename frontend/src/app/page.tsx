"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <h1>Hellow</h1>

      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
    </MaxWidthWrapper>
  );
}
