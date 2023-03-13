import { Calendar, momentLocalizer } from "react-big-calendar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmoji } from "../../contexts/EmojiContext";
import { connectAccount } from "../EmojiPage/metaMaskFunctions";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarMain.css";

export default function CalendarMain() {
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const { setMetaMaskAccount, metaMaskAccount, getCurrentUserEmojis } =
    useEmoji();

  //on start and in case the ethereum extension is connected if we don't have yet an account set we connect it
  useEffect(() => {
    if (metaMaskAccount) return;
    const connectToMetaMask = async () => {
      const resultConnectAccount = await connectAccount();
      if (resultConnectAccount !== metaMaskAccount)
        setMetaMaskAccount(resultConnectAccount);
    };
    connectToMetaMask();
  }, [metaMaskAccount, setMetaMaskAccount]);

  const onSelectEventDate = ({ hash }) => {
    navigate("/" + hash);
  };

  return (
    <div className="big-calendar-main">
      <div style={{ height: "500pt" }}>
        <Calendar
          events={getCurrentUserEmojis()}
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          localizer={localizer}
          views={{ month: true, agenda: true }}
          onSelectEvent={(event) => onSelectEventDate(event)}
        />
      </div>
    </div>
  );
}
