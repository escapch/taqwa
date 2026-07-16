"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string>
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "google-identity-services";

export const GoogleSignInButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { loginWithGoogle } = useProfileStore();
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const handleCredential = async (response: { credential: string }) => {
      const ok = await loginWithGoogle(response.credential);
      if (ok) {
        toast.success("Вы успешно вошли!");
        router.push("/");
      } else {
        toast.error("Не удалось войти через Google");
      }
    };

    const init = () => {
      if (!window.google || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
        locale: "ru",
      });
      setReady(true);
    };

    if (window.google) {
      init();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className="w-full">
      <div ref={containerRef} className={ready ? "" : "h-11"} />
    </div>
  );
};
