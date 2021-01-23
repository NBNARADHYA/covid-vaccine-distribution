export const isTokenExpired = (exp) => Date.now() > exp * 1000 + 3000;

export const refreshToken = async (setAccessToken) => {
  try {
    const { error, accessToken } = await fetch(
      `${process.env.REACT_APP_SERVER}/auth/refresh_token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (error) {
      console.error(error);
      setAccessToken && setAccessToken(undefined);
      return false;
    } else {
      setAccessToken && setAccessToken(accessToken);
      return accessToken;
    }
  } catch (error) {
    return { error };
  }
};
