import { useEffect, useRef, useState } from "react";
import "./MusicControl.css";

export default function MusicControl(){
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => localStorage.getItem("reArchiveMuted") === "1");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.42;
    audio.muted = muted;

    const start = () => {
      audio.play().catch(() => {});
    };
    start();
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [muted]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem("reArchiveMuted", next ? "1" : "0");
    const audio = audioRef.current;
    if (audio) {
      audio.muted = next;
      if (!next) audio.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/resident_evil.mp3" preload="auto" loop />
      <button className={`music-control ${muted ? "is-muted" : ""}`} onClick={toggleMute} aria-label={muted ? "Unmute archive music" : "Mute archive music"}>
        <span className="music-dot" />
        <span>{muted ? "AUDIO OFF" : "AUDIO ON"}</span>
      </button>
    </>
  );
}
