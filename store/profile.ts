import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  id: string;
  name: string;
  email: string;
  registeredAt?: string;
  timezone?: string;
  location?: { latitude: number; longitude: number };
}

interface IUserCredentials {
  email: string;
  password: string;
}

interface IUpdateProfileData {
  name?: string;
  email?: string;
}

interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface IProfileState {
  loading: boolean;
  token: string | null;
  user: IUser | null;
  logIn: (credentials: IUserCredentials) => Promise<boolean>;
  signIn: (credentials: IUserCredentials) => Promise<boolean>;
  logOut: () => void;
  getUser: () => IUser | null;
  updateProfile: (data: IUpdateProfileData) => Promise<boolean>;
  fetchMe: () => Promise<boolean>;
  changePassword: (data: IChangePasswordData) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  deleteLocation: () => Promise<boolean>;
  updateLocation: (latitude: number, longitude: number) => Promise<boolean>;
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

      updateProfile: async (data) => {
        const token = get().token;
        if (!token) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/me`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }
          );

          if (!res.ok) throw new Error("Update failed");

          const updatedUser = await res.json();
          set({
            user: {
              ...(get().user as IUser),
              id: updatedUser.userId,
              name: updatedUser.name,
              email: updatedUser.email,
              registeredAt: updatedUser.registeredAt,
              timezone: updatedUser.timezone,
              location: updatedUser.location ?? get().user?.location,
            },
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return false;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) throw new Error('fetchMe failed');
          const data = await res.json();
          set({
            user: {
              id: data.userId ?? data.id,
              name: data.name,
              email: data.email,
              registeredAt: data.registeredAt,
              timezone: data.timezone,
              location: data.location,
            },
          });
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      changePassword: async (data) => {
        const token = get().token;
        if (!token) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/password`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }
          );

          if (!res.ok) throw new Error("Password change failed");

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      deleteAccount: async () => {
        const token = get().token;
        if (!token) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/me`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error("Delete failed");

          set({ token: null, user: null });
          localStorage.removeItem("profile");

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      deleteLocation: async () => {
        const token = get().token;
        if (!token) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/location`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error("Delete location failed");

          const user = get().user;
          if (user) {
            set({
              user: {
                ...user,
                location: undefined,
              },
            });
          }

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },

      updateLocation: async (latitude: number, longitude: number) => {
        const token = get().token;
        if (!token) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/users/location`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ latitude, longitude }),
            }
          );

          if (!res.ok) throw new Error("Update location failed");

          const user = get().user;
          if (user) {
            set({
              user: {
                ...user,
                location: { latitude, longitude },
              },
            });
          }

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    }),
    {
      name: "profile",
    }
  )
);

