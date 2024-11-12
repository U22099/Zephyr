import { NextResponse } from "next/server";
import { auth } from "@/firebase";

export default function middleware(request) {
  let user = auth.currentUser;
  console.log(user);

  const nextUrl = request.nextUrl;
  const authenticated = !!user && !!user.uid; // Ensure the user is truly authenticated
  const currentPath = nextUrl.pathname;

  // Define the routes that don't require authentication
  const publicRoutes = ['/', '/__firebase__/'];

  // Determine if the current route is public
  const isPublicRoute = publicRoutes.some(route => currentPath === route);
  console.log("Is public route:", isPublicRoute);

  const homepage = "/home";
  const basePath = process.env.BASE_URL;

  // Prevent a redirect loop: if user is authenticated and already on the homepage, don't redirect
  if (authenticated && currentPath === homepage) {
    return NextResponse.next();
  }

  // If a user is authenticated and they are on a public route, redirect to homepage
  if (isPublicRoute && authenticated) {
    return NextResponse.redirect(new URL(homepage, basePath));
  }

  // If the user is not authenticated and they are on a private route, redirect to login
  if (!isPublicRoute && !authenticated) {
    return NextResponse.redirect(new URL(publicRoutes[0], basePath));
  }

  // If no conditions are met, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next/image|favicon.ico).*)'],
}