"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Timer = {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
};

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [timers, setTimers] = useState<Timer[]>(
    Array(6).fill({ isRunning: false, startTime: null, elapsed: 0 })
  );

  useEffect(() => {
    fetch("http://localhost:8080/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const startTimer = (index: number) => {
    if (timers[index].isRunning) return;

    const newTimers = [...timers];
    newTimers[index] = {
      isRunning: true,
      startTime: Date.now(),
      elapsed: 0,
    };
    setTimers(newTimers);

    setInterval(() => {
      setTimers((prev) => {
        const updated = [...prev];
        const t = updated[index];
        if (!t.isRunning || t.startTime === null) return updated;

        updated[index] = {
          ...t,
          elapsed: Math.floor((Date.now() - t.startTime!) / 1000),
        };
        return updated;
      });
    }, 1000);
  };

  if (!authorized) {
    return <main><p>Loading...</p></main>;
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Protected Home</h1>

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border p-2 text-left">Apartment</th>
            <th className="border p-2 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {timers.map((timer, i) => (
            <tr key={i}>
              <td className="border p-2">Apartment {20 + i}</td>
              <td className="border p-2">
                {timer.isRunning ? (
                  <span>{formatTime(timer.elapsed)}</span>
                ) : (
                  <button
                    onClick={() => startTimer(i)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Start
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
