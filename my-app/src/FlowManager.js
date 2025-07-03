// New file: FlowManager.js
import React, { useState } from "react";
import TodoMain from "./TodoMain";
import "./FlowManager.css";

const FlowManager = ({ onLogout }) => {
  
  const [started, setStarted] = useState(false);
  

  if (!started) {
    return (
      <div className="flow-step">
        <h1>🎯 Let's Get Started!</h1>
        <p>Plan your day your way</p>
        <button onClick={() => setStarted(true)}>Create your To-Do List</button>
      </div>
    );
  }

  
    return <TodoMain onLogout={onLogout} />;
  
};

export default FlowManager;
