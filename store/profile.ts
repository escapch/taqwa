import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface IUserCredentials {
  email: string;
  password: string;
}

interface IProfileState {
  loading: boolean;
  token: string | null;
  user: IUser | null;
  logIn: (credentials: IUserCredentials) => Promise<boolean>;
  signIn: (credentials: IUserCredentials) => Promise<boolean>;
  logOut: () => void;
  getUser: () => IUser | null;
}

export const useProfileStore = create<IProfileState>()(
  persist(
    (set, get) => ({
      loading: false,
      token: null,
      user: null,

      getUser: () => get().user,

      logIn: async (credentials) => {
        set({ loading: true });

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          if (!res.ok) throw new Error("Login failed");

          const data = await res.json();

          set({
            token: data.accessToken,
            user: data.user,
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (credentials) => {
        set({ loading: true });

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          if (!res.ok) throw new Error("Login failed");

          const data = await res.json();

          set({
            token: data.accessToken,
            user: data.user,
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logOut: () => {
        set({ token: null, user: null });
        localStorage.removeItem("profile");
      },
    }),
    {
      name: "profile",
    }
  )
);
