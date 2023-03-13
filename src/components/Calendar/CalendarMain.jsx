import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import { useEmoji } from "../../contexts/EmojiContext";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarMain.css";

export default function CalendarMain() {
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const { getCurrentUserEmojis } = useEmoji();

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
