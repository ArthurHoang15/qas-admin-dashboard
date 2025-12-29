import SignupForm from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; type?: string }>;
}) {
  const { message, type } = await searchParams;

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SignupForm message={message} messageType={type === "success" ? "success" : "error"} />
    </main>
  );
}
