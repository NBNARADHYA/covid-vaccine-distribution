import React, { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { refreshToken } from "../Components/utils/refreshToken";

const AccessTokenContext = createContext();

const initialAccessToken = localStorage.getItem("accessToken");
const unauthorizedUser = {
  isAdmin: false,
  isSuperUser: false,
  isProfileAdded: false,
  exp: Date.now() - 1000,
  vaccinationDate: null,
};

const initialPayload = initialAccessToken
  ? jwtDecode(initialAccessToken)
  : unauthorizedUser;

const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(initialAccessToken);
  const [user, setUser] = useState(initialPayload);

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem("accessToken");
      setUser(unauthorizedUser);
    } else {
      const payload = jwtDecode(accessToken);
      setUser(payload);
      localStorage.setItem("accessToken", accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    refreshToken()
      .then((res) =>
        res.error ? console.error(res.error) : res && setAccessToken(res)
      )
      .catch(console.error);
  }, [user]);

  return (
    <AccessTokenContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};

export { AccessTokenContext, AccessTokenProvider };
