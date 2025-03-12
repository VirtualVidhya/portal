// import { SignJWT } from "jose";
// import bcrypt from "bcryptjs";

// export async function onRequestPost(context) {
//   const { request, env } = context;

//   // Parse credentials (support JSON and form-data)
//   const contentType = request.headers.get("content-type") || "";
//   let username, password;
//   if (contentType.includes("application/json")) {
//     const body = await request.json();
//     username = body.username;
//     password = body.password;
//   } else {
//     const formData = await request.formData();
//     username = formData.get("username");
//     password = formData.get("password");
//   }

//   if (!username || !password) {
//     return new Response(JSON.stringify({ error: "Missing credentials" }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   // Query Supabase for the admin user record.
//   const supabaseUrl = env.SUPABASE_URL;
//   const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

//   // Using the Supabase REST API (PostgREST) to query the admin_users table.
//   // This URL assumes your table is called "admin_users".
//   const queryUrl = `${supabaseUrl}/rest/v1/admin_users?username=eq.${encodeURIComponent(
//     username
//   )}`;

//   const userResponse = await fetch(queryUrl, {
//     headers: {
//       apikey: supabaseServiceRoleKey,
//       Authorization: `Bearer ${supabaseServiceRoleKey}`,
//     },
//   });

//   if (!userResponse.ok) {
//     // Log error details in your production logging system.
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   const users = await userResponse.json();
//   if (!users || users.length === 0) {
//     return new Response(JSON.stringify({ error: "Invalid credentials" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   const adminUser = users[0];

//   // Compare provided password with stored bcrypt hash.
//   const valid = await bcrypt.compare(password, adminUser.password_hash);
//   if (!valid) {
//     return new Response(JSON.stringify({ error: "Invalid credentials" }), {
//       status: 401,
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   // Issue a JWT that includes admin details (expires in 1 hour).
//   // SECRET_KEY should be stored as an environment variable.
//   const jwt = await new SignJWT({
//     id: adminUser.id,
//     username: adminUser.username,
//     role: adminUser.role,
//   })
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("1h")
//     .sign(new TextEncoder().encode(env.JWT_TOKEN));

//   // Set the JWT as an HttpOnly, Secure cookie.
//   // const cookie = `session_token=${jwt}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`;
//   const cookie = `session_token=${jwt}; Domain=portal.vvidhya.com; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`;

//   return new Response(
//     JSON.stringify({ message: "Login successful", role: adminUser.role }),
//     {
//       status: 200,
//       headers: {
//         "Set-Cookie": cookie,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }

import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

export async function POST({ request, env }) {
  const contentType = request.headers.get("content-type") || "";
  let username, password;
  if (contentType.includes("application/json")) {
    const body = await request.json();
    username = body.username;
    password = body.password;
  } else {
    const formData = await request.formData();
    username = formData.get("username");
    password = formData.get("password");
  }

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const queryUrl = `${supabaseUrl}/rest/v1/admin_users?username=eq.${encodeURIComponent(
    username
  )}`;

  const userResponse = await fetch(queryUrl, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  });

  if (!userResponse.ok) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const users = await userResponse.json();
  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminUser = users[0];
  const valid = await bcrypt.compare(password, adminUser.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Issue a JWT that expires in 1 hour.
  const jwt = await new SignJWT({
    id: adminUser.id,
    username: adminUser.username,
    role: adminUser.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(env.JWT_TOKEN));

  // Set the session cookie. Adjust Domain if needed.
  const cookie = `session_token=${jwt}; Domain=portal.vvidhya.com; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Lax`;

  return new Response(
    JSON.stringify({ message: "Login successful", role: adminUser.role }),
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    }
  );
}
