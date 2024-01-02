import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function CreatePassword({
  firstPasswordError,
  firstPasswordHelperText,
  createPassword,
  setCreatePassword,
  confirmPassword,
  setConfirmPassword,
}) {
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShouldShowPassword(!shouldShowPassword);
  };

  const isNewPasswordMatch = createPassword === confirmPassword;
  const secondPasswordHelperText = isNewPasswordMatch
    ? ""
    : "Password does not match";

  return (
    <Stack spacing={1} width="35ch">
      <TextField
        color="secondary"
        label="Create New Password"
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
        value={createPassword}
        onChange={(event) => setCreatePassword(event.target.value)}
        error={firstPasswordError}
        helperText={firstPasswordHelperText}
      />

      <TextField
        color="secondary"
        label="Confirm New Password"
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
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={!isNewPasswordMatch}
        helperText={secondPasswordHelperText}
      />
    </Stack>
  );
}

export default CreatePassword;
