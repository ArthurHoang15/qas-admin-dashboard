"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function setPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 6) {
    return redirect("/account/profile?message=Password must be at least 6 characters&type=error");
  }

  if (password !== confirmPassword) {
    return redirect("/account/profile?message=Passwords do not match&type=error");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Set password error:", error.message);
    return redirect(`/account/profile?message=${encodeURIComponent(error.message)}&type=error`);
  }

  return redirect("/account/profile?message=Password updated successfully&type=success");
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("x-forwarded-host") || "http://localhost:3000";
  const fullOrigin = origin.startsWith("http") ? origin : `https://${origin}`;

  // Redirect directly to reset-password page (PKCE flow handles token in hash)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${fullOrigin}/account/reset-password`,
  });

  if (error) {
    console.error("Reset password email error:", error.message);
    return redirect(`/account/profile?message=${encodeURIComponent(error.message)}&type=error`);
  }

  return redirect("/account/profile?message=Password reset email sent. Check your inbox.&type=success");
}
