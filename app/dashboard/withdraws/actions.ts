"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitWithdraw(input: {
  amount: number;
  address: string;
  keyPassword: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Not authenticated." };

  const amount = Number(input.amount);
  const address = (input.address ?? "").trim();
  const keyPassword = (input.keyPassword ?? "").trim();

  if (!Number.isFinite(amount) || amount <= 0)
    return { ok: false, message: "Invalid amount." };
  if (!address) return { ok: false, message: "Address is required." };
  if (!keyPassword) return { ok: false, message: "Key Password is required." };

  const { data, error } = await supabase.rpc("process_withdraw", {
    p_amount: amount,
    p_address: address,
    p_key_password: keyPassword,
  });

  if (error) return { ok: false, message: error.message };

  
  return { ok: true, message: "Withdraw request submitted ✅", newBalance: data };
}

