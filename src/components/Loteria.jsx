import React, { useEffect, useState } from "react";
import { words } from "../data/words";
import confetti from "canvas-confetti";

export default function Loteria({ speakWord }) {
  const [board, setBoard] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [marked, setMarked] = useState([]);
  const [completed, setCompleted] = useState(false);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const successSound = new Audio("/success.mp3");
  successSound.volume = 0.5;

  const winSound = new Audio("/win.mp3");
  winSound.volume = 0.6;

  const streakSound = new Audio("/correct.mp3");
  streakSound.volume = 0.7;

  const launchConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // 🏆 cargar datos guardados
  useEffect(() => {
    const savedBest = localStorage.getItem("bestStreak");
    if (savedBest) setBestStreak(Number(savedBest));

    const savedBoard = localStorage.getItem("leaderboard");
    if (savedBoard) setLeaderboard(JSON.parse(savedBoard));
  }, []);

  const saveBestStreak = (value) => {
    localStorage.setItem("bestStreak", value);
    setBestStreak(value);
  };

  const saveScore = () => {
    if (!playerName) return;

    const newEntry = {
      name: playerName,
      score: streak
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(updated));
    setLeaderboard(updated);
  };

  const generateBoard = (keepStreak = false) => {
    const selected = words
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    setBoard(selected);
    setMarked([]);
    setCompleted(false);

    if (!keepStreak) {
      setStreak(0);
    }

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

        setStreak(prevStreak => {
          const newStreak = prevStreak + 1;

          if (newStreak === 3) {
            streakSound.play();
          }

          if (newStreak > bestStreak) {
            saveBestStreak(newStreak);
          }

          return newStreak;
        });

        if (newMarked.length === board.length) {
          winSound.play();
          launchConfetti();
          setCompleted(true);
        } else {
          pickWord(board, newMarked);
        }

        return newMarked;
      });
    } else {
      speakWord(item.word);
      setStreak(0);
    }
  };

  return (
    <div className="card">
      <h2>Lotería 🪅</h2>

      {/* 👤 NOMBRE */}
      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Tu nombre (ej: ANA)"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="input"
        />
      </div>

      {/* 🔥 RACHA */}
      <div>🔥 Racha: {streak}</div>

      {/* 🏆 RECORD */}
      <div style={{ marginBottom: 10 }}>
        🏆 Mejor racha: {bestStreak}
      </div>

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

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap:"wrap" }}>
            
            <button onClick={() => generateBoard(false)}>
              🔁 Nuevo juego
            </button>

            <button onClick={() => generateBoard(true)}>
              ➡️ Continuar racha
            </button>

            <button onClick={saveScore}>
              💾 Guardar puntuación
            </button>

          </div>
        </div>
      )}

      {/* 🎮 TABLERO */}
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

      {/* 🏆 RANKING */}
      <div style={{ marginTop: 20 }}>
        <h3>🏆 Ranking</h3>

        {leaderboard.length === 0 && (
          <div className="small">Sin registros aún</div>
        )}

        {leaderboard.map((p, i) => (
          <div key={i}>
            {i + 1}. {p.name} - {p.score}
          </div>
        ))}
      </div>
    </div>
  );
}
