import users from "../models/users.js";
import { generateToken } from "../utils/token.js";

export const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "認証失敗" });
  }

  const { accessToken, refreshToken, expiresIn } = generateToken(user);

  res.json({
    accessToken,
    refreshToken,
    expiresIn,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};
