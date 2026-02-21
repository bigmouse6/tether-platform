"use client";

export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Tronix Platform</h1>
      <p className="text-lg mb-6">Sayt artıq işləyir! Burada əsas content əlavə edə bilərsən.</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => alert("Button işləyir!")}
      >
        Test Button
      </button>
    </main>
  );
}