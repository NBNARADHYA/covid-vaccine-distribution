import React, { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const AccessTokenContext = createContext();

const initialAccessToken = localStorage.getItem("accessToken");
const initialPayload = initialAccessToken
  ? jwtDecode(initialAccessToken)
  : {
      isAdmin: false,
      isSuperUser: false,
      isRegisteredForVaccination: false,
      exp: Date.now() - 1000,
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

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export { AccessTokenContext, AccessTokenProvider };
