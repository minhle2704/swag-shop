import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "@mui/material/Link";

function SignIn({ setUser, saveUserToLocalStorage, setSwagOrders }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const [hasSigninError, setHasSigninError] = useState(false);

  const handleClickShowPassword = () => {
    setShouldShowPassword(!shouldShowPassword);
  };

  const navigate = useNavigate();

  const handleUserSignin = async () => {
    const payload = {
      username,
      password,
    };
    const response = await fetch("/.netlify/functions/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      const result = await response.json();
      const {
        firstName,
        lastName,
        username,
        role,
        email,
        cartItem: cartItemString,
      } = result.message.data;
      const cartItem = JSON.parse(cartItemString);

      const activeUser = {
        firstName,
        lastName,
        username,
        role,
        id: result.message.ref["@ref"].id,
        email,
        cartItem,
      };

      setUser(activeUser);
      saveUserToLocalStorage(activeUser);
      setSwagOrders(cartItem);
      navigate("/");
    } else {
      setHasSigninError(true);
    }
  };

  return (
    <Stack width="35ch" spacing={3} padding={2}>
      <Stack spacing={1}>
        <TextField
          color="secondary"
          label="Username"
          variant="standard"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          color="secondary"
          label="Password"
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
      </Stack>

      <Button
        disabled={!username || !password}
        color="secondary"
        variant="outlined"
        onClick={handleUserSignin}
      >
        Submit
      </Button>
      <Typography variant="body">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          onClick={(event) => {
            event.preventDefault();
            navigate("/sign-up");
          }}
          underline="hover"
        >
          Sign Up
        </Link>
      </Typography>

      <Typography variant="body">
        Forget your password?{" "}
        <Link
          href="/sign-up"
          onClick={(event) => {
            event.preventDefault();
            navigate("/forget-password");
          }}
          underline="hover"
        >
          Reset password
        </Link>
      </Typography>

      {hasSigninError && (
        <Alert severity="error">
          You have provided a wrong username and password combination. Please
          try again!
        </Alert>
      )}
    </Stack>
  );
}

export default SignIn;
