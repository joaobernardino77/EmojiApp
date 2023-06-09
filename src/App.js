import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmojiEventPage from "./components/EmojiPage/EmojiEventPage";
import CalendarMain from "./components/Calendar/CalendarMain";
import { useEffect } from "react";
import { useEmoji } from "./contexts/EmojiContext";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

export default function App() {
  const { setMetaMaskAccount } = useEmoji();
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setMetaMaskAccount(null);
        window.location.reload();
      });
      window.ethereum.on("disconnect", () => {
        toast.error("you have been disconnected");
        setMetaMaskAccount(null);
        window.location.reload();
      });
    }
  });
  return (
    <div className="App">
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CalendarMain />} />
          <Route path="/:img" element={<EmojiEventPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
