"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    const errorMessage = encodeURIComponent("Email and password are required.");
    return redirect(`/signup?message=${errorMessage}`);
  }

  if (password.length < 6) {
    const errorMessage = encodeURIComponent("Password must be at least 6 characters.");
    return redirect(`/signup?message=${errorMessage}`);
  }

  // Sign up with Supabase Auth (disable email confirmation for now)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
      emailRedirectTo: undefined, // Disable email confirmation redirect
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/signup?message=${errorMessage}`);
  }

  // Manually create app_user record (in case trigger fails or doesn't exist)
  if (data.user) {
    try {
      // Determine role - super_admin for main admin email, null for others
      const role = email === process.env.ADMIN_EMAIL ? 'super_admin' : null;

      await query(
        `INSERT INTO app_users (auth_user_id, email, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (auth_user_id) DO NOTHING`,
        [data.user.id, email, fullName || null, role]
      );
    } catch (dbError) {
      console.error("Error creating app_user:", dbError);
      // Don't fail signup if app_user creation fails - trigger might handle it
    }
  }

  revalidatePath("/", "layout");
  // After signup, user will be redirected based on their role
  // New users will have role = null and will be redirected to waiting page
  redirect("/dashboard");
}
