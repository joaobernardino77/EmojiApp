import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emoji from "./components/Emoji/Emoji";
import CalendarMain from "./components/CalendarMain";
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
          <Route path="/:img" element={<Emoji />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
