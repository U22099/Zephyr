import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export default function middleware(request) {
  let user;
  const sessionCookie = cookies().get("session")?.value;

  // Parse the session cookie safely
  try {
    if (sessionCookie) {
      // Decode the URL-encoded session string
      const decodedCookie = decodeURIComponent(sessionCookie);
      user = JSON.parse(decodedCookie);
      console.log(user);
    }
  } catch (error) {
    console.error("Error parsing session cookie:", error);
  }

  const nextUrl = request.nextUrl;
  const authenticated = !!user && !!user.uid; // Ensure the user is truly authenticated
  const currentPath = nextUrl.pathname;

  // Define the routes that don't require authentication
  const publicRoutes = ['/', '/forgotpsw', '/__firebase__/'];

  // Determine if the current route is public
  const isPublicRoute = publicRoutes.some(route => currentPath === route);
  console.log("Is public route:", isPublicRoute);

  const homepage = "/home";
  const basePath = process.env.NEXT_PUBLIC_BASE_URL;

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