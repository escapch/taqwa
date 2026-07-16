import ForgotPassword from "@/components/shared/forgot-password/forgot-password";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ForgotPassword />
    </Suspense>
  );
}
