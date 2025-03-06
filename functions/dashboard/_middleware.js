// import { jwtVerify } from "jose";

// export async function onRequest(context) {
//   const { request, env } = context;
//   const cookieHeader = request.headers.get("Cookie") || "";
//   const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
//   const token = tokenMatch ? tokenMatch[1] : null;

//   if (!token) {
//     return Response.redirect("/dashboard/login/");
//   }

//   try {
//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(env.JWT_TOKEN)
//     );
//     // Optionally, attach payload to context.state for downstream use.
//     context.state.user = payload;
//     return context.next();
//   } catch (error) {
//     return Response.redirect("/dashboard/login/");
//   }
// }

// import { jwtVerify } from "jose";

// export async function onRequest(context) {
//   const { request } = context;
//   const cookieHeader = request.headers.get("Cookie") || "";
//   const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
//   const token = tokenMatch ? tokenMatch[1] : null;

//   if (!token) {
//     return Response.redirect("https://portal.vvidhya.com/dashboard/login/");
//   }

//   try {
//     const secret = new TextEncoder().encode(globalThis.JWT_TOKEN);
//     const { payload } = await jwtVerify(token, secret);
//     context.state.user = payload;
//     return context.next();
//   } catch (error) {
//     return Response.redirect("https://portal.vvidhya.com/dashboard/login/");
//   }
// }

// import { jwtVerify } from "jose";

// export async function onRequest(context) {
//   const { request, next } = context;
//   const url = new URL(request.url);

//   // Exclude the login page (and any other public routes under /dashboard/)
//   if (url.pathname.startsWith("/dashboard/login")) {
//     return next();
//   }

//   // Extract token from cookies.
//   const cookieHeader = request.headers.get("Cookie") || "";
//   const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
//   const token = tokenMatch ? tokenMatch[1] : null;

//   // Construct absolute login URL.
//   const loginUrl = new URL("/dashboard/login/", request.url).toString();
//   // const loginUrl = "https://portal.vvidhya.com/dashboard/login/";

//   if (!token) {
//     return Response.redirect(loginUrl);
//   }

//   try {
//     // Use globalThis.JWT_TOKEN which should have been set as an environment secret.
//     const secret = new TextEncoder().encode(globalThis.JWT_TOKEN);
//     await jwtVerify(token, secret);
//     return next();
//   } catch (error) {
//     return Response.redirect(loginUrl);
//   }
// }

import { jwtVerify } from "jose";

export async function onRequest(context) {
  const { request, next } = context;
  const cookieHeader = request.headers.get("Cookie") || "";
  console.log("Cookie header:", cookieHeader);

  // Exclude login page from auth check
  const url = new URL(request.url);
  if (url.pathname.startsWith("/dashboard/login")) {
    return next();
  }

  const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  const loginUrl = new URL("/dashboard/login/", request.url).toString();

  if (!token) {
    return Response.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(globalThis.JWT_TOKEN);
    await jwtVerify(token, secret);
    return next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return Response.redirect(loginUrl);
  }
}
