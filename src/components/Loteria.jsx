import React, { useEffect, useState } from "react";
import { words } from "../data/words";

export default function Loteria({ speakWord }) {
  const [board, setBoard] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [marked, setMarked] = useState([]);
  const [completed, setCompleted] = useState(false);

  const successSound = new Audio("/success.mp3");
  successSound.volume = 0.5;

  const winSound = new Audio("/win.mp3"); // 🏆 NUEVO
  winSound.volume = 0.6;

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
    if (!currentWord || completed) {
      speakWord(item.word);
      return;
    }

    if (item.word === currentWord.word) {
      setMarked(prev => {
        if (prev.includes(item.word)) return prev;

        successSound.play();

        const newMarked = [...prev, item.word];

        if (newMarked.length === board.length) {
          winSound.play(); // 🏆 SONIDO DE VICTORIA
          setCompleted(true);
        } else {
          pickWord(board, newMarked);
        }

        return newMarked;
      });
    } else {
      speakWord(item.word);
    }
  };

  return (
    <div className="card">
      <h2>Lotería 🪅</h2>

      {currentWord && !completed && (
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
          <h3>🎉 ¡LOTERÍA! 🎉</h3>

          <div style={{ fontSize: "30px", margin: "10px 0" }}>
            🎊 🎉 ✨ 🎊 🎉 ✨
          </div>

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
                position: "relative",
                transition: "all 0.3s",
                transform: isMarked ? "scale(1.08)" : "scale(1)",
                boxShadow: isMarked
                  ? "0 0 15px rgba(34,197,94,0.8)"
                  : "none"
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
                    fontSize: "22px"
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
