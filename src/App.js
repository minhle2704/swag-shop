// import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const fetchGreeting = async () => {
    const result = await fetch("/.netlify/functions/helloWorld");
    console.log("result", result);
    const res = await result.json();
    console.log("res", res);
    if (res) {
      setMessage(res.message);
    } else {
      setMessage("error");
    }
  };

  const fetchName = async () => {
    const result = await fetch("/.netlify/functions/getName");
    console.log("result", result);

    const res = await result.json();
    console.log("res", res);
    if (res) {
      setName(res.message);
    } else {
      setName("error");
    }
  };

  useEffect(() => {
    fetchGreeting();
    fetchName();
  }, []);
  const [message, setMessage] = useState("test");
  const [name, setName] = useState("name");
  const [emailResult, setEmailResult] = useState("No Action");

  const resetPassword = async () => {
    const result = await fetch("/.netlify/functions/resetPassword");

    const res = await result.json();
    if (res) {
      setEmailResult(res.message);
    } else {
      setEmailResult("error");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{message}</p>
        <p>My name is {name}</p>
        <button type="button" onClick={resetPassword}>
          Send me an email!
        </button>
        <p>{emailResult}</p>
      </header>
    </div>
  );
}

export default App;
