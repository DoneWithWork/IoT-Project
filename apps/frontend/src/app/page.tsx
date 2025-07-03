"use client";
import SignInBtn from "@/components/auth/SignInBtn";
import SignUpBtn from "@/components/auth/SignUpBtn";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <h1>Hellow</h1>
      <SignInBtn />
      <SignUpBtn />
    </MaxWidthWrapper>
  );
}
