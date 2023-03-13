import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectAccount } from "./metaMaskFunctions";
import { decodeEmojis, retrieveAllEmojis } from "./decodingFunctions";
import { useEmoji } from "../../contexts/EmojiContext";
import isEqual from "lodash/isEqual";
import moment from "moment";
import "./Emoji.css";
import LoadedEmojis from "./LoadedEmojis";
import SignedEmojis from "./SignedEmojis";
import CalendarEmoji from "./CalendarEmoji";

export default function Emoji() {
  const [loadedEmojis, setLoadedEmojis] = useState([]);
  const [signedEmojis, setSignedEmojis] = useState([]);
  const [calendarDate, setCalendarDate] = useState();
  const emojiSubmitedId = useRef("");
  const navigate = useNavigate();
  //context
  const { setMetaMaskAccount, metaMaskAccount, returnCurrentAccountReference } =
    useEmoji();
  // hooks
  const params = useParams();
  //on start or in case the ethereum extension is connected if we don't have yet an account set we connect it
  useEffect(() => {
    if (metaMaskAccount) return;
    const connectToMetaMask = async () => {
      const resultConnectAccount = await connectAccount();
      if (resultConnectAccount !== metaMaskAccount)
        setMetaMaskAccount(resultConnectAccount);
    };
    connectToMetaMask();
  }, [metaMaskAccount]);

  useEffect(() => {
    let loadedEmojis = [];

    //In case user is connected by MetaMask and we find a calendar entry for it we should load it
    const currentUser = returnCurrentAccountReference();

    //in case we have no user we just load the emojis
    if (!currentUser) {
      loadedEmojis = decodeEmojis(retrieveAllEmojis(params?.img));
      setLoadedEmojis(loadedEmojis);
    } else {
      const calendarEntry = currentUser.emojis.find((e) => {
        return e.hash === params?.img;
      });
      if (calendarEntry) {
        //load all the information saved from calendar entry
        loadedEmojis = calendarEntry.title;
        setLoadedEmojis(loadedEmojis);
        setCalendarDate(moment(calendarEntry.start).toDate());
        emojiSubmitedId.current = calendarEntry.hash;
      } else {
        //since we don't have a calendar entry we need to decode the path
        loadedEmojis = decodeEmojis(retrieveAllEmojis(params?.img));
        setLoadedEmojis(loadedEmojis);
      }

      //load any signed emojis cached for this user
      let cachedSignedEmojis = [];
      loadedEmojis.forEach((emoji) => {
        if (currentUser.signed.hasOwnProperty(emoji)) {
          cachedSignedEmojis.push(emoji);
        }
      });
      setSignedEmojis(cachedSignedEmojis);
    }
  }, [params?.img, returnCurrentAccountReference, metaMaskAccount]);

  const updateSignedEmotions = (newSignedEmojis) => {
    setSignedEmojis(newSignedEmojis);
  };

  const updateCalendarDate = (newCalendarDate) => {
    setCalendarDate(newCalendarDate);
  };
  return (
    <>
      <button
        type="button"
        className="home"
        onClick={() => {
          navigate("/");
        }}
      ></button>
      <LoadedEmojis loadedEmojis={loadedEmojis} />
      <SignedEmojis
        loadedEmojis={loadedEmojis}
        signedEmojis={signedEmojis}
        updateSignedEmojis={updateSignedEmotions}
        setMetaMaskAccount={setMetaMaskAccount}
      />
      {isEqual(signedEmojis.sort(), loadedEmojis.sort()) && (
        <CalendarEmoji
          calendarDate={calendarDate}
          signedEmojis={signedEmojis}
          emojiSubmitedId={emojiSubmitedId}
          updateSignedEmojis={updateSignedEmotions}
          updateCalendarDate={updateCalendarDate}
        />
      )}
    </>
  );
}
