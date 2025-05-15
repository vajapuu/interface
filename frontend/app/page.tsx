"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/", {
      method: "GET",
      credentials: "include", // important: sends the token cookie
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
        } else {
          return res.text();
        }
      })
      .then((text) => {
        if (text) setContent(text);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        router.push("/login");
      });
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold">Protected Home</h1>
      {content ? <p>{content}</p> : <p>Loading...</p>}
      <button></button>
    </main>
  );
}
