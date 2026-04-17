import { useState } from "react";

const questions = [
  {
    sentence: "I'm sitting in a boring ____",
    correct: "room",
    options: ["room", "car", "house"],
  },
  {
    sentence: "I see a little ____ in the sky",
    correct: "bird",
    options: ["plane", "bird", "star"],
  },
];

export default function MusicMode() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const question = questions[current];

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(
      question.sentence.replace("____", "")
    );
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleAnswer = (option) => {
    setSelected(option);

    if (option === question.correct) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setResult(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert("🎉 Terminaste el modo música");
      setCurrent(0);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎵 Music Mode</h2>

      <p style={{ fontSize: "22px", marginBottom: "20px" }}>
        {question.sentence}
      </p>

      <button onClick={speak} style={{ marginBottom: "20px" }}>
        🔊 Escuchar
      </button>

      <div>
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              fontSize: "18px",
              background:
                selected === opt
                  ? opt === question.correct
                    ? "green"
                    : "red"
                  : "",
              color: selected === opt ? "white" : "black",
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            {result === "correct" ? "✅ Correct!" : "❌ Try again"}
          </h3>

          <button onClick={nextQuestion}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
