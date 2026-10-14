import { AuthGate } from "@/features/auth/components/AuthGate";
import { LoginForm } from "@/features/auth/components/LoginForm";

/** The page is closed behind AUTH_LOGIN_ENABLED (default false): a calm notice, nothing mounts, no backend call. */
export default function LoginPage() {
  return (
    <AuthGate flag="login">
      <LoginForm />
    </AuthGate>
  );
}
