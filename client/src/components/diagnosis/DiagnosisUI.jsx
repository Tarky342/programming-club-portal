import { useAuthUser, useSignOut } from "react-auth-kit";

export default function DiagnosisUI() {
  const user = useAuthUser();
  const signOut = useSignOut();

  return (
    <div>
      <h2>ようこそ、{user()?.userName} さん</h2>
      <button onClick={() => signOut()}>ログアウト</button>
    </div>
  );
}
