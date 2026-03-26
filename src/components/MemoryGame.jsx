import React, { useEffect, useState } from "react";
import { words } from "../data/words";

export default function MemoryGame({ speakWord }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    // tomar 6 palabras aleatorias
    const selectedWords = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    // crear pares (imagen + texto)
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

    // mezclar
    const shuffled = gameCards.sort(() => Math.random() - 0.5);

    setCards(shuffled);
  }, []);

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
        setMatched((prev) => [...prev, a.word]);
        setScore((prev) => prev + 1);
        setSelected([]);
        setLock(false);
      } else {
        setTimeout(() => {
          setSelected([]);
          setLock(false);
        }, 1000);
      }
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
        Puntos: {score} / 6
      </div>

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
