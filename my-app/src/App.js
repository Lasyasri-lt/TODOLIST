import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import FlowManager from "./FlowManager" // Import the TodoMain component
import "./App.css";

const App = () => {
  const [stage, setStage] = useState("welcome");

  if (stage === "welcome") {
    return (
      <div className="welcome">
        <h1>Welcome to CheckTodo ✅</h1>
        <p>Your personal productivity partner</p>
        <button onClick={() => setStage("login")}>Login</button>
      </div>
    );
  }

  if (stage === "signup") {
    return (
      <Signup
        onSignup={() => setStage("login")}
        goToLogin={() => setStage("login")}
      />
    );
  }

  if (stage === "login") {
    return (
      <Login
        onLogin={() => setStage("flow")} // Change stage to "todo" on login
        goToSignup={() => setStage("signup")}
      />
    );
  }

  if (stage === "flow") {
    return <FlowManager onLogout={() => setStage("welcome")} />;
  }


  return null;
};

export default App;
