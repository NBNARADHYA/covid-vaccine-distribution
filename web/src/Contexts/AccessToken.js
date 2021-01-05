import React, { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { refreshToken } from "../Components/utils/refreshToken";

const AccessTokenContext = createContext();

const initialAccessToken = localStorage.getItem("accessToken");
const initialPayload = initialAccessToken
  ? jwtDecode(initialAccessToken)
  : {
      isAdmin: false,
      isSuperUser: false,
      isProfileAdded: false,
      exp: Date.now() - 1000,
      vaccinationDate: null,
    };

const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(initialAccessToken);
  const [user, setUser] = useState(initialPayload);

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem("accessToken");
    } else {
      const payload = jwtDecode(accessToken);
      setUser(payload);
      localStorage.setItem("accessToken", accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    refreshToken()
      .then((res) => res && setAccessToken(res))
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
