export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoices/:path*",
    "/customers/:path*",
    "/payments/:path*",
    "/expenses/:path*",
    "/withdrawals/:path*",
    "/manual-income/:path*",
    "/accounts/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/audit/:path*"
  ]
};
