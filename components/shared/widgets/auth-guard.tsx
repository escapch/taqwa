import { Button } from "@/components/ui/button";

type AuthGuardProps = {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  children: React.ReactNode;
};

export const AuthGuard = ({
  isAuthenticated,
  onLoginClick,
  children,
}: AuthGuardProps) => {
  if (!isAuthenticated) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
        <Button onClick={onLoginClick}>Войти/Зарегистрироваться</Button>
      </div>
    );
  }

  return <>{children}</>;
};