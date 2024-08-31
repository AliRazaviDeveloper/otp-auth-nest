export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      database: process.env.DB_DATABASE,
    },
    jwt: {
      accessToken: process.env.JWT_ACCESS_TOKEN_SECRET,
      refreshToken: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
  };
};
