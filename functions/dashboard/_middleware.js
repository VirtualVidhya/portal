import { jwtVerify } from "jose";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // Exclude the login page from the check
  if (url.pathname.startsWith("/dashboard/login")) {
    return next();
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  console.log("Cookie header:", cookieHeader);
  const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  // Construct absolute login URL dynamically.
  const loginUrl = new URL("/dashboard/login/", request.url).toString();

  if (!token) {
    console.error("No token found in cookies.");
    return Response.redirect(loginUrl);
  }

  // Get the JWT secret from global variables.
  const secretKey = globalThis.JWT_TOKEN;
  if (!secretKey) {
    console.error("JWT secret is not set (globalThis.JWT_TOKEN is empty).");
    return new Response("Internal Server Error", { status: 500 });
  }

  const secret = new TextEncoder().encode(secretKey);
  try {
    await jwtVerify(token, secret);
    return next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return Response.redirect(loginUrl);
  }
}
