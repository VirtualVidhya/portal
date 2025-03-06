import { jwtVerify } from "jose";

export async function onRequest(context) {
  const { request, env } = context;
  const cookieHeader = request.headers.get("Cookie") || "";
  const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return Response.redirect("/dashboard/login/");
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_TOKEN)
    );
    // Optionally, attach payload to context.state for downstream use.
    context.state.user = payload;
    return context.next();
  } catch (error) {
    return Response.redirect("/dashboard/login/");
  }
}
