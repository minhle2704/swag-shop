import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CreatePassword from "./CreatePassword";
import Alert from "@mui/material/Alert";

function ChangePassword({ user }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(false);

  const isOldPasswordUsed =
    password === createPassword && password && createPassword;

  const firstPasswordHelperText = isOldPasswordUsed
    ? "You cannot use the old password"
    : "";

  const handleClickShowPassword = () => {
    setShouldShowPassword(!shouldShowPassword);
  };

  const handleChangePassword = async () => {
    const payload = {
      userId: user.id,
      currentPassword: password,
      newPassword: createPassword,
    };
    const response = await fetch("/.netlify/functions/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      navigate("/");
    } else {
      setChangePasswordError(true);
    }
  };

  return (
    <Stack spacing={3} width="35ch">
      <Stack spacing={1}>
        <TextField
          color="secondary"
          label="Current Password"
          variant="standard"
          type={shouldShowPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {shouldShowPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <CreatePassword
          firstPasswordError={isOldPasswordUsed}
          firstPasswordHelperText={firstPasswordHelperText}
          createPassword={createPassword}
          setCreatePassword={setCreatePassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      </Stack>

      <Button
        disabled={
          !password ||
          !createPassword ||
          !confirmPassword ||
          password === createPassword ||
          createPassword !== confirmPassword
        }
        color="secondary"
        variant="outlined"
        onClick={handleChangePassword}
      >
        Submit
      </Button>

      {changePasswordError && (
        <Alert severity="error">
          You have provided a wrong password. Please try again!
        </Alert>
      )}
    </Stack>
  );
}

export default ChangePassword;
