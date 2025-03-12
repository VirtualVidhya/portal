export async function onRequest(context) {
  const { env } = context;
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/applications`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    return new Response("Error fetching applications", { status: 500 });
  }

  const applications = await response.json();
  return new Response(JSON.stringify(applications), {
    headers: { "Content-Type": "application/json" },
  });
}
