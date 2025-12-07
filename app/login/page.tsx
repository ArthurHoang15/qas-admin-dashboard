import LoginForm from "./login-form"; // Import component vừa tạo

interface LoginPageProps {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
}

export default async function LoginPage(props: LoginPageProps) {
  // Await searchParams (đặc thù Next.js 15)
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Gọi Client Component và truyền message vào */}
      <LoginForm message={searchParams?.message} />
    </div>
  );
}
