import React, { useState, useRef, useEffect } from "react";
import { words } from "../data/words";

export default function Practice({ speakWord }) {
  const [shuffled, setShuffled] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setShuffled(words.slice().sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  const current = shuffled[index] || { word: "", image: null };

  const check = () => {
    const ans = (input || "").trim().toLowerCase();
    if (!current.word) return;

    if (ans === current.word.toLowerCase()) {
      setFeedback("✅ Correcto");
      setTimeout(() => {
        setIndex((i) => i + 1);
        setInput("");
        setFeedback("");
      }, 700);
    } else {
      setFeedback(`❌ Incorrecto. Era: ${current.word}`);
    }
  };

  return (
    <div className="card">
      <h2>Modo Práctica</h2>

      {current.image && (
        <img
          src={current.image}
          alt={current.word}
          style={{
            width: "100%",
            maxHeight: "200px",
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        />
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={() => speakWord(current.word)}>
          🔊 Escuchar
        </button>

        <button
          onClick={() =>
            setFeedback(
              `💡 Pista: comienza con "${current.word.charAt(0)}"`
            )
          }
          style={{ marginLeft: 8 }}
        >
          💡 Pista
        </button>
      </div>

      <input
        ref={inputRef}
        className="input"
        placeholder="Escribe la palabra..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") check();
        }}
        style={{ marginTop: 10 }}
      />

      <div className="feedback">{feedback}</div>

      <div style={{ marginTop: 12 }} className="small">
        Palabra {index + 1} de {shuffled.length}
      </div>
    </div>
  );
}
