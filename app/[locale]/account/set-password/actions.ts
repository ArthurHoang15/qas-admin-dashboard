"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function setPassword(formData: FormData) {
  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    const errorMessage = encodeURIComponent("Both password fields are required.");
    return redirect(`/account/set-password?message=${errorMessage}`);
  }

  if (password.length < 6) {
    const errorMessage = encodeURIComponent("Password must be at least 6 characters.");
    return redirect(`/account/set-password?message=${errorMessage}`);
  }

  if (password !== confirmPassword) {
    const errorMessage = encodeURIComponent("Passwords do not match.");
    return redirect(`/account/set-password?message=${errorMessage}`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Set password error:", error.message);
    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/account/set-password?message=${errorMessage}`);
  }

  // Success - redirect to dashboard with success message
  const successMessage = encodeURIComponent("Password set successfully! You can now login with email and password.");
  return redirect(`/account/set-password?message=${successMessage}&type=success`);
}
