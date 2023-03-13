import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
const initialState = {
  metaMaskAccount: null,
  users: [],
  decodedEmojis: {},
};

const getInitialState = () => {
  //For LocalStorage
  const emojiData = localStorage.getItem("emojiData");
  return emojiData ? JSON.parse(emojiData) : initialState;
};

export const EmojisContext = createContext();

const EmojisContextProvider = (props) => {
  const [emojisData, setEmojisData] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem("emojiData", JSON.stringify(emojisData));
  }, [emojisData]);

  const returnCurrentAccountReference = () => {
    if (!emojisData.metaMaskAccount) return null;
    return emojisData.users.find((u) => {
      return u.address === emojisData.metaMaskAccount.address;
    });
  };
  const setMetaMaskAccount = (metaMaskAccount) => {
    //check if we already have a user account to store data
    if (
      metaMaskAccount &&
      !emojisData.users.find((u) => {
        return u.address === metaMaskAccount.address;
      })
    ) {
      emojisData.users = [
        ...emojisData.users,
        { address: metaMaskAccount.address, emojis: [], signed: {} },
      ];
    }
    setEmojisData((prev) => ({
      ...prev,
      metaMaskAccount: metaMaskAccount,
      users: emojisData.users,
    }));
  };
  const addEmoji = (emoji) => {
    if (!emojisData.metaMaskAccount) {
      toast.error(
        "error connecting to MetaMask account please check your extension"
      );
      return null;
    }
    const newUsers = emojisData.users.map((u) => {
      if (u.address === emojisData.metaMaskAccount.address) {
        u.emojis = [...u.emojis, emoji];
      }
      return u;
    });
    setEmojisData((prev) => ({
      ...prev,
      users: newUsers,
    }));
  };
  const replaceEmoji = (oldId, newDate) => {
    const newUsers = emojisData.users.map((u) => {
      if (u.address === emojisData.metaMaskAccount.address) {
        const oldEmoji = u.emojis.find((emoji) => {
          return emoji.hash === oldId;
        });
        if (oldEmoji) {
          oldEmoji.start = newDate;
          oldEmoji.end = newDate;
        }
      }
      return u;
    });
    setEmojisData((prev) => ({
      ...prev,
      users: newUsers,
    }));
  };

  const addSigned = (signedEmojiKey, signedEmojiInfo) => {
    const newUsers = emojisData.users.map((u) => {
      if (u.address === emojisData.metaMaskAccount.address) {
        u.signed[signedEmojiKey] = signedEmojiInfo;
      }
      return u;
    });

    setEmojisData((prev) => ({
      ...prev,
      users: newUsers,
    }));
  };

  const removeSigned = (signedEmoji) => {
    const newUsers = emojisData.users.map((u) => {
      if (u.signed.hasOwnProperty(signedEmoji)) {
        delete u.signed[signedEmoji];
      }
      return u;
    });

    setEmojisData((prev) => ({
      ...prev,
      users: newUsers,
    }));
  };

  const getCurrentUserEmojis = () => {
    const currentUser = returnCurrentAccountReference();
    //no user means that no entry was added to the calendar
    if (!currentUser) return [];
    return currentUser.emojis;
  };

  return (
    <EmojisContext.Provider
      value={{
        setMetaMaskAccount,
        addEmoji,
        replaceEmoji,
        addSigned,
        removeSigned,
        returnCurrentAccountReference,
        getCurrentUserEmojis,
        ...emojisData,
      }}
    >
      {props.children}
    </EmojisContext.Provider>
  );
};

export const useEmoji = () => useContext(EmojisContext);

export default EmojisContextProvider;
