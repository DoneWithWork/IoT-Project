import React, { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="h-screen grid place-content-center">{children}</div>;
}
