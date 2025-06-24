"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function PageLoader() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    console.log("Path changed to:", pathname);

    if (prevPath.current !== null && prevPath.current !== pathname) {
      console.log("Start NProgress");
      NProgress.start();
    }

    const timer = setTimeout(() => {
      console.log("Done NProgress");
      NProgress.done();
      prevPath.current = pathname;
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
