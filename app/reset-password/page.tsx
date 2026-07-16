import ResetPassword from "@/components/shared/reset-password/reset-password";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
