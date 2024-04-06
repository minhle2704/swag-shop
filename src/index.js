import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import "@fontsource/nunito-sans";
import "./index.css";

let theme = createTheme({
  palette: {
    primary: {
      main: "#202635",
    },
    secondary: {
      main: "#da344d",
    },
    blue: {
      main: "#57a9d4",
      lightest: "#cde4ef",
      light: "#87bede",
      dark: "#448098",
      darkest: "#2c5161",
    },
    white: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Nunito Sans Bold",
    h1: {
      fontFamily: "Nunito Sans Bold",
    },
    h2: {
      fontFamily: "Nunito Sans Bold",
    },
    h3: {
      fontFamily: "Nunito Sans Bold",
    },
    body: {
      fontFamily: "Nunito Sans Light",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
theme = responsiveFontSizes(theme);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
