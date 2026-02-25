import { useState, useEffect, useRef } from "react";

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
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  // ✅ LOAD DATA
  useEffect(() => {
    const savedTimes = localStorage.getItem("timeData");
    const savedActive = localStorage.getItem("activeTask");
    const savedStart = localStorage.getItem("startTime");

    if (savedTimes) setTimes(JSON.parse(savedTimes));
    if (savedActive) setActive(savedActive);
    if (savedStart) setStartTime(Number(savedStart));
  }, []);

  // ✅ RUN TIMER
  useEffect(() => {
    if (!active || !startTime) return;

    intervalRef.current = setInterval(() => {
      setTimes((prev) => ({ ...prev }));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, startTime]);

  const startTask = (task) => {
    if (active) return;

    const now = Date.now();

    setActive(task);
    setStartTime(now);

    localStorage.setItem("activeTask", task);
    localStorage.setItem("startTime", now);
  };

  const stopTask = () => {
    if (!active) return;

    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);

    const updated = {
      ...times,
      [active]: times[active] + elapsed,
    };

    setTimes(updated);
    setActive(null);
    setStartTime(null);

    localStorage.setItem("timeData", JSON.stringify(updated));
    localStorage.removeItem("activeTask");
    localStorage.removeItem("startTime");

    clearInterval(intervalRef.current);
  };

  const getDisplayTime = (key) => {
    if (key !== active || !startTime) return times[key];

    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    return times[key] + elapsed;
  };

  const resetAll = () => {
    setTimes({
      work: 0,
      learning: 0,
      personal: 0,
      sleep: 0,
    });

    setActive(null);
    setStartTime(null);

    localStorage.removeItem("timeData");
    localStorage.removeItem("activeTask");
    localStorage.removeItem("startTime");

    clearInterval(intervalRef.current);
  };

  const totalSeconds =
    getDisplayTime("work") +
    getDisplayTime("learning") +
    getDisplayTime("personal") +
    getDisplayTime("sleep");

  return (
    <div style={styles.container}>
      <h1>24 Hour Life Tracker</h1>

      {Object.keys(times).map((key) => (
        <div key={key} style={styles.card}>
          <h2>{key.toUpperCase()}</h2>
          <p>{formatTime(getDisplayTime(key))}</p>

          {active === key ? (
            <button
              onClick={stopTask}
              style={{ ...styles.button, backgroundColor: "green" }}
            >
              Running... (Stop)
            </button>
          ) : (
            <button
              onClick={() => startTask(key)}
              style={{ ...styles.button, backgroundColor: "#444" }}
            >
              Start
            </button>
          )}
        </div>
      ))}

      <h2>Total: {formatTime(totalSeconds)} / 24:00:00</h2>

      <button
        style={{ ...styles.button, backgroundColor: "red", marginTop: 20 }}
        onClick={resetAll}
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