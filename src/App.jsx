import React, { useState } from "react";
import Flashcards from "./components/Flashcards";
import Practice from "./components/Practice";
import Exam from "./components/Exam";
import MemoryGame from "./components/MemoryGame";
import Loteria from "./components/Loteria";

function speakWord(word, mode = "normal") {

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance();

  if (mode === "sentence") {
    utter.text = `The word is ${word}`;
  } else {
    utter.text = word;
  }

  utter.lang = "en-US";

  if (mode === "slow") {
    utter.rate = 0.6;
  } else {
    utter.rate = 0.9;
  }

  utter.pitch = 1;

  const voices = speechSynthesis.getVoices();

  let goodVoice =
    voices.find(v => v.name.includes("Google US English")) ||
    voices.find(v => v.name.includes("Google UK English")) ||
    voices.find(v => v.lang === "en-US") ||
    voices.find(v => v.lang === "en-GB");

  if (goodVoice) {
    utter.voice = goodVoice;
  }

  speechSynthesis.speak(utter);
}

export default function App() {
  const [mode, setMode] = useState("menu");

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Spelling Practice App ✨</h1>
          <div className="small">Lista: 200 palabras — 4th Primary</div>
        </div>

        <nav className="nav">
          <button className={mode === "menu" ? "active" : ""} onClick={() => setMode("menu")}>Menú</button>
          <button className={mode === "flash" ? "active" : ""} onClick={() => setMode("flash")}>Flashcards</button>
          <button className={mode === "practice" ? "active" : ""} onClick={() => setMode("practice")}>Práctica</button>
          <button className={mode === "exam" ? "active" : ""} onClick={() => setMode("exam")}>Examen</button>
          <button className={mode === "memory" ? "active" : ""} onClick={() => setMode("memory")}>🧠 Memorama</button>
          <button className={mode === "loteria" ? "active" : ""} onClick={() => setMode("loteria")}>🪅 Lotería</button>
        </nav>
      </header>

      <main>
        {mode === "menu" && (
          <div className="card">
            <h2>Bienvenido</h2>
            <p className="small">Elige un modo para que tu hija practique spelling.</p>
            <div style={{display:"flex",gap:10,marginTop:12, flexWrap:"wrap"}}>
              <button onClick={() => setMode("flash")}>Flashcards</button>
              <button onClick={() => setMode("practice")}>Modo Práctica</button>
              <button onClick={() => setMode("exam")}>Modo Examen (20)</button>
              <button onClick={() => setMode("memory")}>🧠 Memorama</button>
              <button onClick={() => setMode("loteria")}>🪅 Lotería</button>
            </div>
          </div>
        )}

        {mode === "flash" && <Flashcards speakWord={speakWord} />}
        {mode === "practice" && <Practice speakWord={speakWord} />}
        {mode === "exam" && <Exam speakWord={speakWord} count={20} />}
        {mode === "memory" && <MemoryGame speakWord={speakWord} />}
        {mode === "loteria" && <Loteria speakWord={speakWord} />}
      </main>
    </div>
  );
}
