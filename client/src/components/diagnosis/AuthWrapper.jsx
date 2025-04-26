import { useIsAuthenticated } from "react-auth-kit";
import SignUpForm from "./SignUpForm";
import DiagnosisUI from "./DiagnosisUI";

export default function AuthWrapper() {
  const isAuth = useIsAuthenticated();
  return isAuth() ? <DiagnosisUI /> : <SignUpForm />;
}
