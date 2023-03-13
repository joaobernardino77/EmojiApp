import "./LoadedEmojis.css";
export default function LoadedEmojis({ loadedEmojis }) {
  return (
    <div className="loaded-emojis-area">
      <div>
        <b>Loaded Emojis</b>
      </div>
      {loadedEmojis.map((emoji, index) => {
        return (
          <div key={"loaded-emoji-" + index}>
            <span className="icon" role="img">
              {emoji}
            </span>
          </div>
        );
      })}
    </div>
  );
}
