// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Protect only these routes
  pages: {
    signIn: "/login", // fallback if unauthenticated
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // any route under /dashboard
//   matcher: ["/dashboard/:path*", "/reports/:path*", "/settings"] for later
};
