"use client";

import React from "react";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Tronix Platform</h1>
      <p>Sayt artıq işləyir! Burada əsas content əlavə edə bilərsən.</p>

      {/* Test üçün button */}
      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        onClick={() => alert("Button işləyir!")}
      >
        Test Button
      </button>
    </main>
  );
}