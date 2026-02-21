"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Supabase istifadəçi məlumatını yoxla
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github", // istəsən dəyişə bilərsən
    });
    if (error) alert(error.message);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Tronix Platform</h1>
      <p>Sayt artıq işləyir! Burada əsas content əlavə edə bilərsən.</p>

      {!user ? (
        <button
          style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
          onClick={handleLogin}
        >
          Login with GitHub
        </button>
      ) : (
        <p>Salam, {user.email}</p>
      )}
    </main>
  );
}