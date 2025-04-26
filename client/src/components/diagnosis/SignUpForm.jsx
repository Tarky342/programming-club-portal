import { useState } from "react";
import { useSignIn } from "react-auth-kit";
import { loginAPI } from "../../api/authApi";

export default function SignUpForm() {
  const signIn = useSignIn();
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const validateEmail = (email) => email.endsWith("@stumail.daido-it.ac.jp");
  // メールアドレスのバリデーション

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      alert("このメールアドレスはご利用いただけません");
      return;
    }

    const res = await loginAPI(form.email, form.password);
    if (
      res &&
      signIn({
        token: res.accessToken,
        refreshToken: res.refreshToken,
        expiresIn: res.expiresIn,
        tokenType: "Bearer",
        authState: {
          userName: res.user.name,
          email: res.user.email,
        },
      })
    ) {
      console.log("ログイン成功");
    } else {
      alert("ログイン失敗");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="名前"
      />
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="メール"
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="パスワード"
      />
      <button type="submit">スタート</button>
    </form>
  );
}
