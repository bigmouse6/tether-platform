"use server";

import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function setKeyPassword(input: { keyPassword: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Not authenticated." };

  const keyPassword = (input.keyPassword ?? "").trim();
  if (keyPassword.length < 4) {
    return { ok: false, message: "Key Password must be at least 4 characters." };
  }

  const hash = await bcrypt.hash(keyPassword, 10);

  const { error } = await supabase
    .from("user_security")
    .upsert({ user_id: user.id, key_password_hash: hash }, { onConflict: "user_id" });

  if (error) {
    return { ok: false, message: "Failed to save Key Password." };
  }

  return { ok: true, message: "Key Password saved ✅" };
}
