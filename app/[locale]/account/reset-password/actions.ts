"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    const errorMessage = encodeURIComponent("Both password fields are required.");
    return redirect(`/account/reset-password?message=${errorMessage}`);
  }

  if (password.length < 6) {
    const errorMessage = encodeURIComponent("Password must be at least 6 characters.");
    return redirect(`/account/reset-password?message=${errorMessage}`);
  }

  if (password !== confirmPassword) {
    const errorMessage = encodeURIComponent("Passwords do not match.");
    return redirect(`/account/reset-password?message=${errorMessage}`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Reset password error:", error.message);
    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/account/reset-password?message=${errorMessage}`);
  }

  // Success - redirect to login with success message
  const successMessage = encodeURIComponent("Password updated successfully. Please login with your new password.");
  return redirect(`/login?message=${successMessage}&type=success`);
}
