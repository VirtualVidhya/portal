export async function onRequest(context) {
  const cookie = `session_token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`;
  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
