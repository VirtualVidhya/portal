export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("No target URL provided", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    const newResponse = new Response(response.body, response);
    // Allow all origins
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    return newResponse;
  } catch (err) {
    return new Response("Error fetching target URL", { status: 500 });
  }
}
