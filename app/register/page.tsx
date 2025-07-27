import Register from "@/components/shared/register/register";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}
