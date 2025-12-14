import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/resume-builder",
  "/blog",
  "/blog/:slug",
  "/admin(.*)", // Admin routes have their own authentication
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Completely bypass Clerk for admin routes (both pages and API) - they have their own authentication
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return;
  }

  // Keep blog posts public but require auth for editor
  if (pathname.startsWith("/blog/editor")) {
    await auth.protect();
    return;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
