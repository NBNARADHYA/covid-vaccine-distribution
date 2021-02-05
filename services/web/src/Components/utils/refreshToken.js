export const isTokenExpired = (exp) => Date.now() > exp * 1000 + 3000;

export const refreshToken = async (setAccessToken) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER}/auth/refresh_token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const { error, accessToken } = await res.json();
    if (error || !accessToken) {
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
