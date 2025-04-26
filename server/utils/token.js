// server/utils/token.js
// Mock token generation function

export const generateToken = (user) => {
    return {
      accessToken: "mock-access-token-" + user.email,
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
    };
  };
