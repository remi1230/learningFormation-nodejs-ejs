// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function Root() {
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);