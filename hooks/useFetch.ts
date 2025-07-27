import { useProfileStore } from "@/store/profile";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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

  const execute = useCallback(
    async (
      overrideBody?: TBody,
      overrideUrl?: string
    ): Promise<TResponse | null> => {
      const finalUrl = overrideUrl || initialUrl;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_API + finalUrl,
          {
            method: options.method || "GET",
            headers: {
              "Content-Type": "application/json",
              ...(options.auth && token
                ? { Authorization: `Bearer ${token}` }
                : {}),
              ...options.headers,
            },
            ...(options.method !== "GET" && (options.body || overrideBody)
              ? { body: JSON.stringify(overrideBody || options.body) }
              : {}),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `Ошибка запроса: ${res.status}`);
        }

        if (res.status === 401) {
          router.push("/login");
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
    [initialUrl, options, token]
  );

  return {
    data,
    error,
    loading,
    execute,
  };
}
