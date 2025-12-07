import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to default locale (vi) with appropriate path
  if (user) {
    redirect("/vi/dashboard");
  } else {
    redirect("/vi/login");
  }
}
