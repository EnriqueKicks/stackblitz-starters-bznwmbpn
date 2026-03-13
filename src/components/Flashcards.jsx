import React, { useState } from "react";
import { words } from "../data/words";

export default function Flashcards({ speakWord }) {
  const [index, setIndex] = useState(0);

  const nextWord = () => setIndex(i => (i + 1) % words.length);
  const prevWord = () => setIndex(i => (i - 1 + words.length) % words.length);

  const current = words[index];

  return (
    <div className="card">
      <h2>Flashcards</h2>

      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ minWidth: 260, textAlign: "center" }}>
          <div style={{
            marginTop: 6, padding: 18, borderRadius: 12, background: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)", fontSize: 28, textTransform: "lowercase"
          }}>
            {current.word}
          </div>

          {current.image && (
            <img
            src={current.image}
            alt={current.word}
            style={{
              maxWidth: "340px",
              maxHeight: "240px",
              width: "100%",
              objectFit: "contain",
              borderRadius: 8,
              marginTop: 10,
              background: "#fff",
              padding: 10
            }}
          />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={prevWord}>⬅ Anterior</button>
          <button onClick={() => speakWord(current.word)}>🔊 Escuchar</button>
          <button onClick={nextWord}>Siguiente ➡</button>
        </div>
      </div>

      <div className="small" style={{ marginTop: 12 }}>
        Palabra {index + 1} de {words.length}
      </div>
    </div>
  );
}
