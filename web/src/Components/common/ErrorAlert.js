import { Alert } from "@material-ui/lab";

export const ErrorAlert = ({ children }) => {
  return <Alert severity="error">{children}</Alert>;
};
