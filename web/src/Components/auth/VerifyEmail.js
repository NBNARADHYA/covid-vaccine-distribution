import { useEffect, useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export const VerifyEmail = ({ history }) => {
  const query = useQuery();
  const [success, setSuccess] = useState(false);

  const verifyEmailHash = query.get("verify_email_hash");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/auth/verify_email`, {
      method: "POST",
      body: JSON.stringify({
        verify_email_hash: verifyEmailHash,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.success && setSuccess(true);
      })
      .catch(() => history.push("/"));
  }, [verifyEmailHash, history]);

  if (success) {
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
          history.push("/auth/login");
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push("/auth/login");
          }}
          severity="success"
        >
          Your email has been successfully verified !
        </Alert>
      </Snackbar>
    );
  } else
    return (
      <CircularProgress
        color="secondary"
        style={{ marginTop: "45%", marginLeft: "45%" }}
      />
    );
};
