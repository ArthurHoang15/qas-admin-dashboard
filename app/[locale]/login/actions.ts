"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Provide helpful error message - if user registered with Google, they can't login with password
    const errorMessage = encodeURIComponent("Invalid email or password. If you registered with Google, please use 'Continue with Google' button.");
    return redirect(`/login?message=${errorMessage}`);
  }

  // Update last_login_at
  if (data.user) {
    try {
      await query(
        `UPDATE app_users SET last_login_at = NOW() WHERE auth_user_id = $1`,
        [data.user.id]
      );
    } catch (dbError) {
      console.error("Error updating last_login_at:", dbError);
      // Don't fail login if update fails
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
