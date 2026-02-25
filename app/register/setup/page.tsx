import Setup from "@/components/shared/register/setup";
import { Suspense } from "react";

export default function SetupPage() {
    return (
        <Suspense>
            <Setup />
        </Suspense>
    );
}
