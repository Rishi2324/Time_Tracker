import { useState, useEffect, useRef } from "react";

const TARGETS = {
  work: 9 * 60 * 60,
  learning: 5 * 60 * 60,
  personal: 3 * 60 * 60,
  sleep: 7 * 60 * 60,
};

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const [times, setTimes] = useState({
    work: 0,
    learning: 0,
    personal: 0,
    sleep: 0,
  });

  const [active, setActive] = useState(null);
  const intervalRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("timeData");
    if (saved) {
      setTimes(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("timeData", JSON.stringify(times));
  }, [times]);

  // Timer logic
  useEffect(() => {
    if (active) {
      intervalRef.current = setInterval(() => {
        setTimes((prev) => ({
          ...prev,
          [active]: prev[active] + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [active]);

  const totalSeconds =
    times.work + times.learning + times.personal + times.sleep;

  return (
    <div style={styles.container}>
      <h1>24 Hour Life Tracker</h1>

      {Object.keys(times).map((key) => (
        <div key={key} style={styles.card}>
          <h2>{key.toUpperCase()}</h2>
          <p>{formatTime(times[key])}</p>
          <button
            onClick={() => setActive(key)}
            style={{
              ...styles.button,
              backgroundColor: active === key ? "green" : "#444",
            }}
          >
            {active === key ? "Running..." : "Start"}
          </button>
        </div>
      ))}

      <h2>Total: {formatTime(totalSeconds)} / 24:00:00</h2>

      <button
        style={{ ...styles.button, backgroundColor: "red", marginTop: 20 }}
        onClick={() => {
          setTimes({ work: 0, learning: 0, personal: 0, sleep: 0 });
          setActive(null);
        }}
      >
        Reset Day
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial",
    background: "#111",
    color: "white",
  },
  card: {
    margin: "15px auto",
    padding: "15px",
    borderRadius: "10px",
    background: "#222",
    width: "90%",
    maxWidth: "400px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};