import Datetime from "react-datetime";
import { useParams } from "react-router-dom";
import { useEmoji } from "../../contexts/EmojiContext";
import { verifyEmoji } from "./metaMaskFunctions";
import toast from "react-hot-toast";
import "./CalendarEmoji.css";
export default function CalendarEmoji({
  signedEmojis,
  calendarDate,
  updateSignedEmojis,
  updateCalendarDate,
  emojiSubmitedId,
}) {
  const {
    addEmoji,
    replaceEmoji,
    removeSigned,
    returnCurrentAccountReference,
  } = useEmoji();

  const params = useParams();
  const validateAllEmojis = async () => {
    let allValidEmojis = true;
    const currentUser = returnCurrentAccountReference();
    //this should happen because if user got to this point we should already have an entry for him when he connected for the first time
    if (!currentUser) return false;
    const newSignedEmojis = await signedEmojis.reduce(
      async (acc, signedEmoji) => {
        //if we don't have information to validate the emoji then it is not valid
        if (!currentUser.signed.hasOwnProperty(signedEmoji)) {
          return acc;
        }
        const result = await verifyEmoji(currentUser.signed[signedEmoji]);
        if (!result) {
          allValidEmojis = false;
          removeSigned(currentUser.signed[signedEmoji]);
          return acc;
        }
        return (await acc).concat(signedEmoji);
      },
      []
    );
    updateSignedEmojis(newSignedEmojis);
    return allValidEmojis;
  };
  const onCalendarChange = async (date) => {
    //Validate all emojis, in case there is one or more that are not valid we need to remove it from the signed list
    const allValidEmojis = await validateAllEmojis();
    if (!allValidEmojis) {
      toast.error("the emojis are no longer signed please sign them again");
      return;
    }
    if (emojiSubmitedId.current === "") {
      emojiSubmitedId.current = params?.img;
      addEmoji({
        start: date,
        end: date,
        title: signedEmojis,
        hash: params?.img,
      });
      toast.success("emoji(s) were successfully added to calendar");
    } else {
      //change emoji date
      toast.success("calendar date successfully changed");
      replaceEmoji(emojiSubmitedId.current, date);
    }
    updateCalendarDate(date);
  };
  return (
    <div className="calendar-div">
      <b>Pick a date/time to add the emoji(s) to a calendar</b>
      <Datetime
        value={calendarDate}
        onChange={(date) => {
          onCalendarChange(date);
        }}
        closeOnSelect
        dateFormat="DD-MM-YYYY"
        open={true}
      />
    </div>
  );
}
