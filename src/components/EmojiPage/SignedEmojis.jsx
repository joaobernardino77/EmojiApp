import { useEmoji } from "../../contexts/EmojiContext";
import isEqual from "lodash/isEqual";
import { signEmoji } from "./metaMaskFunctions";
import "./SignedEmojis.css";
export default function SignedEmojis({
  signedEmojis,
  loadedEmojis,
  updateSignedEmojis,
  setMetaMaskAccount,
}) {
  const { metaMaskAccount, returnCurrentAccountReference, addSigned } =
    useEmoji();

  //sign all emojis
  const signAllLoadedEmojis = async (emojis) => {
    let newEmojis = [...signedEmojis];
    const currentUser = returnCurrentAccountReference();
    //this should happen because if user got to this point we should already have an entry for him when he connected for the first time
    if (!currentUser) return;
    for (const emoji of emojis) {
      //only try to sign emojis that aren't already signed
      if (metaMaskAccount && !signedEmojis.includes(emoji)) {
        //check if emoji was previously signed

        if (currentUser.signed.hasOwnProperty(emoji)) {
          newEmojis = [...newEmojis, emoji];
          updateSignedEmojis(newEmojis);
          return;
        }
        const result = await signEmoji(metaMaskAccount, emoji);
        if (result.success) {
          newEmojis = [...newEmojis, emoji];
          addSigned(emoji, result);

          updateSignedEmojis(newEmojis);
        } else if (result.error && result.error === "noaccount") {
          setMetaMaskAccount(null);
          break;
        }
      }
    }
  };
  return (
    <div className="signed-emojis-area">
      {metaMaskAccount &&
        loadedEmojis.length > 0 &&
        !isEqual(signedEmojis.sort(), loadedEmojis.sort()) && (
          <button
            className="sign-emojis-button"
            onClick={() => signAllLoadedEmojis(loadedEmojis)}
          >
            Sign Emojis
          </button>
        )}

      {!metaMaskAccount ? (
        <>
          <b>
            <div>
              <div>
                Can't sign Emojis... No account is connected at the moment
              </div>
              {!window.ethereum ? (
                <div>Please install MetaMask extension</div>
              ) : (
                <div>Please Check your MetaMask extension</div>
              )}
            </div>
          </b>
        </>
      ) : (
        <div>
          <b>Signed Emojis</b>
          {signedEmojis.length > 0 &&
            !isEqual(signedEmojis.sort(), loadedEmojis.sort()) && (
              <div>
                Not all emojis are signed yet. if you want to add them to
                calendar please press the Sign Emojis button
              </div>
            )}
        </div>
      )}
      {signedEmojis.length === 0 && metaMaskAccount && (
        <div>
          No signed emojis at the moment. Press the sign emojis button in order
          to add them to a calendar entry
        </div>
      )}
      {signedEmojis.map((emoji, index) => {
        return (
          <span className="icon" key={"signed-emoji-" + index} role="img">
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
