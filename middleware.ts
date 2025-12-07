import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- LOGIC BẢO VỆ (GIỮ NGUYÊN) ---
  
  // Nếu user đang cố vào các trang dashboard (không phải trang login)
  if (!request.nextUrl.pathname.startsWith("/login")) {
    
    // Chưa đăng nhập -> Đá về Login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Đá ra ngoài
    if (user.email !== process.env.ADMIN_EMAIL) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?message=Unauthorized Access", request.url));
    }
  }

  // Nếu đã login rồi mà cố vào lại trang Login -> Đá về Dashboard
  if (request.nextUrl.pathname.startsWith("/login") && user) {
     if (user.email === process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/", request.url));
     }
  }

  // 3. Quan trọng: Trả về response đã được xử lý cookie
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};