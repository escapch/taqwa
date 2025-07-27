import { useProfileStore } from "@/store/profile";

export const useAuth = () => {
  const user = useProfileStore((state) => state.user);
  const token = useProfileStore((state) => state.token);
  const loading = useProfileStore((state) => state.loading);

  return {
    user,
    isAuthenticated: !!token && !!user,
    loading,
  };
};
