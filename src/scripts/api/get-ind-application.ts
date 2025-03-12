// src/api/get-application.ts
export async function onRequest(context: {
  request: Request;
  env: any;
}): Promise<Response> {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "No id provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  // Query the application by id (assuming your table is "applications")
  const queryUrl = `${supabaseUrl}/rest/v1/applications?id=eq.${encodeURIComponent(
    id
  )}`;

  const response = await fetch(queryUrl, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Error fetching application" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const applications = await response.json();
  const application = applications[0] || null;

  if (!application) {
    return new Response(JSON.stringify({ error: "Application not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(application), {
    headers: { "Content-Type": "application/json" },
  });
}
