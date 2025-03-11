import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { atom, useRecoilState } from "recoil";

const snackbarAtom = atom({
  key: "app/snackbarAtom",
  default: {
    opened: false,
    duration: 0,
    severity: "",
    msg: "",
  },
});

export function useSnackBarStatus() {
  const [snackbar, setSnackbar] = useRecoilState(snackbarAtom);

  const opened = snackbar.opened;
  const duration = snackbar.duration;
  const severity = snackbar.severity;
  const msg = snackbar.msg;

  const open = (msg, severity = "success", duration = 3000) => {
    setSnackbar({
      opened: true,
      duration: duration,
      severity: severity,
      msg: msg,
    });
  };

  const close = () => setSnackbar({ ...snackbar, opened: false });

  return {
    opened,
    duration,
    severity,
    msg,
    open,
    close,
  };
}

const CustomAlert = React.forwardRef((props, ref) => {
  return <Alert {...props} ref={ref} />;
});

export function SnackBar() {
  const status = useSnackBarStatus();

  return (
    <>
      <Snackbar
        open={status.opened}
        autoHideDuration={status.duration}
        onClose={status.close}
      >
        <CustomAlert severity={status.severity} sx={{ width: "100%" }}>
          {status.msg}
        </CustomAlert>
      </Snackbar>
    </>
  );
}
