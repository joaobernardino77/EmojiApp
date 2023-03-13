import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import EmojisContextProvider from "./contexts/EmojiContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <EmojisContextProvider>
    <App />
  </EmojisContextProvider>
);
