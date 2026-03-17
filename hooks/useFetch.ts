import { useProfileStore } from "@/store/profile";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UseFetchOptions<TBody = any> {
  method?: Method;
  body?: TBody;
  headers?: HeadersInit;
  auth?: boolean;
  skip?: boolean;
}
export function useFetch<TResponse = any, TBody = any>(
  initialUrl: string,
  options: UseFetchOptions<TBody> = {}
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const token = useProfileStore((state) => state.token);
  const router = useRouter();

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const execute = useCallback(
    async (
      overrideBody?: TBody,
      overrideUrl?: string
    ): Promise<TResponse | null> => {
      const finalUrl = overrideUrl || initialUrl;
      const opts = optionsRef.current;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_API + finalUrl,
          {
            method: opts.method || "GET",
            headers: {
              "Content-Type": "application/json",
              ...(opts.auth && token
                ? { Authorization: `Bearer ${token}` }
                : {}),
              ...opts.headers,
            },
            ...(opts.method !== "GET" && (opts.body || overrideBody)
              ? { body: JSON.stringify(overrideBody || opts.body) }
              : {}),
          }
        );

        if (res.status === 401) {
          router.push("/login");
          return null;
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `Ошибка запроса: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        return json;
      } catch (err: any) {
        setError(err);
        console.error("useFetch error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [initialUrl, token]
  );

  return { data, error, loading, execute };
}
