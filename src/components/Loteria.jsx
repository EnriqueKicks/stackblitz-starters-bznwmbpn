import React, { useEffect, useState } from "react";
import { words } from "../data/words";

export default function Loteria({ speakWord }) {
  const [board, setBoard] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [marked, setMarked] = useState([]);
  const [completed, setCompleted] = useState(false);

  // 🎯 GENERAR TABLERO 3x3
  const generateBoard = () => {
    const selected = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    setBoard(selected);
    setMarked([]);
    setCompleted(false);

    pickWord(selected);
  };

  // 🔊 ELEGIR PALABRA
  const pickWord = (list = board) => {
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(random);
    speakWord(random.word);
  };

  useEffect(() => {
    generateBoard();
  }, []);

  // 🎮 CLICK EN CARTA
  const handleClick = (item) => {
    // 🔊 repetir sonido siempre
    speakWord(item.word);

    if (!currentWord || completed) return;

    // ✅ si acierta
    if (item.word === currentWord.word) {
      if (!marked.includes(item.word)) {
        const newMarked = [...marked, item.word];
        setMarked(newMarked);

        // 🏆 ganar
        if (newMarked.length === board.length) {
          setCompleted(true);
        } else {
          pickWord();
        }
      }
    }
  };

  return (
    <div className="card">
      <h2>Lotería 🪅</h2>

      {/* 🔊 PALABRA ACTUAL */}
      {currentWord && (
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <div className="small">Escucha y busca:</div>
          <h3>{currentWord.word}</h3>

          <button onClick={() => speakWord(currentWord.word)}>
            🔊 Repetir
          </button>
        </div>
      )}

      {/* 🏆 GANASTE */}
      {completed && (
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <h3>🎉 ¡LOTERÍA!</h3>

          <button onClick={generateBoard}>
            🔁 Nuevo juego
          </button>
        </div>
      )}

      {/* 🎲 TABLERO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px"
        }}
      >
        {board.map((item, i) => {
          const isMarked = marked.includes(item.word);

          return (
            <div
              key={i}
              onClick={() => handleClick(item)}
              style={{
                height: "100px",
                borderRadius: "8px",
                background: isMarked ? "#a7f3d0" : "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative"
              }}
            >
              <img
                src={item.image}
                alt={item.word}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />

              {isMarked && (
                <div
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    fontSize: "20px"
                  }}
                >
                  ✅
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
