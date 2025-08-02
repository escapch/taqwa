import Missed from "@/components/shared/services/missed";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <Missed />
    </Suspense>
  );
}
