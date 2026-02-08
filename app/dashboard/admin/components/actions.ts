"use server";

import { createClient } from "@/lib/supabase/server";

type Mode = "deposit" | "withdraw";

export async function manualAdjustByEmail(params: {
  targetEmail: string;
  amount: number;
  mode: Mode;
  note?: string;
}) {
  const supabase = await createClient();

  // Admin kimdir? (performed_by_email üçün)
  const {
    data: { user: adminUser },
    error: adminErr,
  } = await supabase.auth.getUser();

  if (adminErr || !adminUser?.email) {
    throw new Error("Admin auth tapılmadı.");
  }

  const targetEmail = params.targetEmail.trim().toLowerCase();
  const amount = Number(params.amount);

  if (!targetEmail) throw new Error("User email boş ola bilməz.");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Məbləğ düzgün deyil.");

  // 1) profiles-dan user_id tap
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("user_id, email")
    .ilike("email", targetEmail)
    .maybeSingle();

  if (pErr) throw new Error(pErr.message);
  if (!profile?.user_id) throw new Error("Bu email ilə user tapılmadı.");

  const userId = profile.user_id as string;

  // 2) wallet balance oxu
  const { data: wallet, error: wErr } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (wErr) throw new Error(wErr.message);

  const currentBalance = Number(wallet?.balance ?? 0);
  const delta = params.mode === "deposit" ? amount : -amount;
  const newBalance = currentBalance + delta;

  if (newBalance < 0) {
    throw new Error("Balans mənfi ola bilməz.");
  }

  // 3) wallets update (yoxdursa da yaratsın)
  const { error: upErr } = await supabase
    .from("wallets")
    .upsert({ user_id: userId, balance: newBalance }, { onConflict: "user_id" });

  if (upErr) throw new Error(upErr.message);

  // 4) history: transactions insert
  const type = params.mode === "deposit" ? "deposit" : "withdraw";
  const direction = params.mode === "deposit" ? "in" : "out";

  const { error: txErr } = await supabase.from("transactions").insert({
    user_id: userId,
    counterparty_user_id: null,
    type,
    amount: amount, // həmişə + yazırıq
    asset: "USDT",
    note: params.note ?? (params.mode === "deposit" ? "Manual deposit" : "Manual withdraw"),
    performed_by_email: adminUser.email,
    direction,
    to_address: null,
  });

  if (txErr) throw new Error(txErr.message);

  return { ok: true, userId, newBalance };
}
