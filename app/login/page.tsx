import Login from "@/components/shared/login/login";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
