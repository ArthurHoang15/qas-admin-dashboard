"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    const errorMessage = encodeURIComponent("Email is required.");
    return redirect(`/login/forgot-password?message=${errorMessage}`);
  }

  // Get the origin from headers for the redirect URL
  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("x-forwarded-host") || "http://localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const fullOrigin = origin.startsWith("http") ? origin : `${protocol}://${origin}`;

  // Redirect directly to reset-password page (PKCE flow handles token in hash)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${fullOrigin}/account/reset-password`,
  });

  if (error) {
    console.error("Forgot password error:", error.message);
    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/login/forgot-password?message=${errorMessage}`);
  }

  // Success - redirect with success message
  const successMessage = encodeURIComponent("Check your email for a password reset link.");
  return redirect(`/login/forgot-password?message=${successMessage}&type=success`);
}
