export const logout = async (setAccessToken) => {
  await fetch(`${process.env.REACT_APP_SERVER}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  setAccessToken(null);
};
