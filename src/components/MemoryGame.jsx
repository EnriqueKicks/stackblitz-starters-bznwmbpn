import React, { useEffect, useState } from "react";
import { words } from "../data/words";

const levels = [6, 8, 10]; // pares por nivel

export default function MemoryGame({ speakWord }) {
  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [lock, setLock] = useState(false);
  const [completed, setCompleted] = useState(false);

  const generateGame = () => {
    const pairCount = levels[level];

    const selectedWords = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, pairCount);

    const gameCards = selectedWords.flatMap((w, i) => [
      {
        id: `${i}-img`,
        type: "image",
        word: w.word,
        image: w.image
      },
      {
        id: `${i}-text`,
        type: "text",
        word: w.word,
        image: w.image
      }
    ]);

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setSelected([]);
    setMatched([]);
    setScore(0);
    setCompleted(false);
  };

  useEffect(() => {
    generateGame();
  }, [level]);

  const handleClick = (card) => {
    if (lock) return;
    if (selected.find((c) => c.id === card.id)) return;
    if (matched.includes(card.word)) return;

    speakWord(card.word);

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setLock(true);

      const [a, b] = newSelected;

      if (a.word === b.word && a.type !== b.type) {
        const newMatched = [...matched, a.word];
        setMatched(newMatched);
        setScore((prev) => prev + 1);
        setSelected([]);
        setLock(false);

        if (newMatched.length === levels[level]) {
          setCompleted(true);
        }
      } else {
        setTimeout(() => {
          setSelected([]);
          setLock(false);
        }, 1000);
      }
    }
  };

  const nextLevel = () => {
    if (level < levels.length - 1) {
      setLevel((prev) => prev + 1);
    } else {
      alert("🎉 ¡Terminaste todos los niveles!");
    }
  };

  const isFlipped = (card) => {
    return (
      selected.find((c) => c.id === card.id) ||
      matched.includes(card.word)
    );
  };

  return (
    <div className="card">
      <h2>Memorama 🧠</h2>

      <div style={{ marginBottom: 10 }}>
        Nivel: {level + 1} | Puntos: {score} / {levels[level]}
      </div>

      {completed && (
        <div style={{ marginBottom: 10 }}>
          🎉 ¡Nivel completado!
          <br />
          <button onClick={nextLevel} style={{ marginTop: 5 }}>
            Siguiente nivel ➡️
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px"
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card)}
            style={{
              height: "100px",
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold"
            }}
          >
            {isFlipped(card) ? (
              card.type === "image" ? (
                <img
                  src={card.image}
                  alt={card.word}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              ) : (
                card.word
              )
            ) : (
              "❓"
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
    </div>
  );
}
