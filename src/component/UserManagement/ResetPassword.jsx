import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";

import CreatePassword from "./CreatePassword";

function ResetPassword() {
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [createNewPassword, setCreateNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [shouldShowTemporaryPassword, setShouldShowTemporaryPassword] =
    useState(false);
  const [resetPasswordError, setResetPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShouldShowTemporaryPassword(!shouldShowTemporaryPassword);
  };

  const isTemporaryPasswordUsed =
    temporaryPassword === createNewPassword &&
    temporaryPassword &&
    createNewPassword;

  const firstPasswordHelperText = isTemporaryPasswordUsed
    ? "You cannot use the temporary password"
    : "";

  const handleResetPassword = async () => {
    const payload = {
      username,
      temporaryPassword,
      newPassword: createNewPassword,
    };
    const response = await fetch("/.netlify/functions/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      navigate("/sign-in");
    } else {
      setResetPasswordError(true);
    }
  };

  return (
    <Stack width="35ch" spacing={3}>
      <Stack width="35ch" spacing={1}>
        <TextField
          color="secondary"
          label="Username"
          variant="standard"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          color="secondary"
          label="Temporary Password"
          variant="standard"
          type={shouldShowTemporaryPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {shouldShowTemporaryPassword ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={temporaryPassword}
          onChange={(event) => setTemporaryPassword(event.target.value)}
        />

        <CreatePassword
          firstPasswordError={isTemporaryPasswordUsed}
          firstPasswordHelperText={firstPasswordHelperText}
          createPassword={createNewPassword}
          setCreatePassword={setCreateNewPassword}
          confirmPassword={confirmNewPassword}
          setConfirmPassword={setConfirmNewPassword}
        />
      </Stack>

      <Button
        disabled={
          !username ||
          !temporaryPassword ||
          !createNewPassword ||
          !confirmNewPassword ||
          temporaryPassword === createNewPassword ||
          createNewPassword !== confirmNewPassword
        }
        color="secondary"
        variant="outlined"
        onClick={handleResetPassword}
      >
        Submit
      </Button>

      {resetPasswordError && (
        <Alert severity="error">
          You may have entered a wrong password or an expired password. Please
          try again!
        </Alert>
      )}
    </Stack>
  );
}

export default ResetPassword;
