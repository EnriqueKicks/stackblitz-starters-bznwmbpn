import React, { useEffect, useState } from "react";
import { words } from "../data/words";

export default function Loteria({ speakWord }) {
  const [board, setBoard] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [marked, setMarked] = useState([]);
  const [completed, setCompleted] = useState(false);

  const generateBoard = () => {
    const selected = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    setBoard(selected);
    setMarked([]);
    setCompleted(false);

    pickWord(selected, []);
  };

  // 🔥 SOLO PALABRAS NO MARCADAS
  const pickWord = (list = board, markedList = marked) => {
    const available = list.filter(w => !markedList.includes(w.word));

    if (available.length === 0) return;

    const random = available[Math.floor(Math.random() * available.length)];
    setCurrentWord(random);
    speakWord(random.word);
  };

  useEffect(() => {
    generateBoard();
  }, []);

  const handleClick = (item) => {
    speakWord(item.word);

    if (!currentWord || completed) return;

    if (item.word === currentWord.word) {
      setMarked(prev => {
        if (prev.includes(item.word)) return prev;

        const newMarked = [...prev, item.word];

        // 🏆 GANAR
        if (newMarked.length === board.length) {
          setCompleted(true);
        } else {
          // 🔥 IMPORTANTE: usar newMarked actualizado
          pickWord(board, newMarked);
        }

        return newMarked;
      });
    }
  };

  return (
    <div className="card">
      <h2>Lotería 🪅</h2>

      {currentWord && (
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <div className="small">Escucha y busca:</div>
          <h3>{currentWord.word}</h3>

          <button onClick={() => speakWord(currentWord.word)}>
            🔊 Repetir
          </button>
        </div>
      )}

      {completed && (
        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <h3>🎉 ¡LOTERÍA!</h3>

          <button onClick={generateBoard}>
            🔁 Nuevo juego
          </button>
        </div>
      )}

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
