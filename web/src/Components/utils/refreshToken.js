export const isTokenExpired = (exp) => Date.now() < exp * 1000 + 3000;

export const refreshToken = async (setAccessToken) => {
  try {
    const { error, accessToken } = await fetch(
      `${process.env.REACT_APP_SERVER}/refresh_token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (error) {
      console.error(error);
      setAccessToken(undefined);
      return false;
    } else {
      setAccessToken(accessToken);
      return true;
    }
  } catch (error) {
    return { error };
  }
};
