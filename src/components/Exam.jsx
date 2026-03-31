import React, { useState, useEffect, useRef } from "react";
import { words } from "../data/words";
import { getStars } from "../utils/getStars";
import Stars from "./Stars";

export default function Exam({ speakWord, count = 20 }) {
  const [setList, setSetList] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const shuffled = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setSetList(shuffled);
    setIndex(0);
    setResults([]);
  }, [count]);

  useEffect(() => inputRef.current?.focus(), [index]);

  const current = setList[index] || { word: "", image: null };

  const submit = () => {
    if (!current.word) return;
    const correct =
      (input || "").trim().toLowerCase() === current.word.toLowerCase();

    setResults((r) => [
      ...r,
      { word: current.word, answer: input, correct },
    ]);

    setInput("");

    if (index + 1 < setList.length) {
      setIndex((i) => i + 1);
    }
  };

  if (!setList.length)
    return <div className="card center">Preparando examen…</div>;

  if (index >= setList.length) {
    const correctCount = results.filter((r) => r.correct).length;

    localStorage.setItem(
      "lastExam",
      JSON.stringify({
        date: Date.now(),
        score: correctCount,
        total: setList.length,
      })
    );

    return (
      <div className="card">
        <h3 className="center">Examen terminado</h3>

        <div className="center small">
          Puntuación: {correctCount} / {setList.length}
        </div>

        {/* ⭐ ESTRELLAS */}
        <Stars count={getStars(correctCount, setList.length)} />

        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => {
              setSetList([]);
              setResults([]);
              setIndex(0);
            }}
          >
            Hacer otro examen
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Respuestas:</strong>
          <ul>
            {results.map((r, i) => (
              <li key={i} style={{ marginTop: 6 }}>
                <strong>{r.word}</strong> — tu respuesta: "{r.answer}" —{" "}
                {r.correct ? "✅" : `❌ (era ${r.word})`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="header">
        <div>
          <strong>Modo Examen</strong>
          <div className="small">
            {index + 1} / {setList.length}
          </div>
        </div>
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
            padding: 10,
          }}
        />
      )}

      <div style={{ marginTop: 8 }}>
        <div className="small">Escucha y escribe la palabra</div>

        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => speakWord(current.word)}
            style={{ marginRight: 8 }}
          >
            🔊 Escuchar
          </button>

          <button onClick={() => setIndex((i) => i + 1)}>
            ⏭️ Saltar
          </button>
        </div>

        <input
          ref={inputRef}
          className="input"
          placeholder="Escribe tu respuesta y presiona Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          style={{ marginTop: 12 }}
        />
      </div>
    </div>
  );
}
