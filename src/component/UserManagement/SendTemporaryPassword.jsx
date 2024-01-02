import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { isEmailValid } from "../../helpers";

function SendTemporaryPassword() {
  const [email, setEmail] = useState("");
  const [shouldOpenConfirmOrderDialog, setShouldOpenConfirmOrderDialog] =
    useState(false);
  const [message, setMessage] = useState("");
  const [shoudProceed, setShouldProceed] = useState(false);

  const navigate = useNavigate();

  const handleCloseConfirmOrderDialog = () => {
    setShouldOpenConfirmOrderDialog(false);
    if (shoudProceed) {
      navigate("/reset-password");
    }
  };

  const handleGenerateTemporaryPassword = async () => {
    const payload = {
      email,
    };
    const response = await fetch(
      "/.netlify/functions/send-temporary-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.status === 200) {
      const result = await response.json();
      setMessage(result.message);
      setShouldOpenConfirmOrderDialog(true);
      setShouldProceed(true);
    }
  };

  const isEmailAddressValid = isEmailValid(email);
  const emailAddressHelperText = isEmailAddressValid
    ? ""
    : "Example: example@mail.com";

  return (
    <Stack spacing={3} width="35ch">
      <TextField
        color="secondary"
        label="Email"
        variant="standard"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={!isEmailAddressValid}
        helperText={emailAddressHelperText}
      />

      <Button
        disabled={!isEmailAddressValid}
        color="secondary"
        variant="outlined"
        onClick={handleGenerateTemporaryPassword}
      >
        Send me a temporary password
      </Button>

      <Dialog
        open={shouldOpenConfirmOrderDialog}
        onClose={handleCloseConfirmOrderDialog}
      >
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmOrderDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default SendTemporaryPassword;
