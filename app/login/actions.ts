"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMessage = encodeURIComponent("Sai email hoặc mật khẩu, vui lòng thử lại.");
    return redirect(`/login?message=${errorMessage}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}