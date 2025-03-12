// // Helper to convert an object to a Base64URL string.
// function objectToBase64url(object) {
//   return arrayBufferToBase64Url(
//     new TextEncoder().encode(JSON.stringify(object))
//   );
// }

// function arrayBufferToBase64Url(buffer) {
//   return btoa(String.fromCharCode(...new Uint8Array(buffer)))
//     .replace(/=/g, "")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_");
// }

// function str2ab(str) {
//   const buf = new ArrayBuffer(str.length);
//   const bufView = new Uint8Array(buf);
//   for (let i = 0, strLen = str.length; i < strLen; i++) {
//     bufView[i] = str.charCodeAt(i);
//   }
//   return buf;
// }

// async function sign(content, signingKey) {
//   const buf = str2ab(content);
//   const formattedKey = signingKey.replace(/\\n/g, "\n");

//   const plainKey = formattedKey
//     .replace("-----BEGIN PRIVATE KEY-----", "")
//     .replace("-----END PRIVATE KEY-----", "")
//     .replace(/(\r\n|\n|\r)/gm, "");

//   const binaryKey = Uint8Array.from(atob(plainKey), (c) =>
//     c.charCodeAt(0)
//   ).buffer;

//   const signer = await crypto.subtle.importKey(
//     "pkcs8",
//     binaryKey,
//     {
//       name: "RSASSA-PKCS1-V1_5",
//       hash: { name: "SHA-256" },
//     },
//     false,
//     ["sign"]
//   );

//   const binarySignature = await crypto.subtle.sign(
//     { name: "RSASSA-PKCS1-V1_5" },
//     signer,
//     buf
//   );

//   return arrayBufferToBase64Url(binarySignature);
// }

// async function getAccessToken(env) {
//   const tokenEndpoint = "https://oauth2.googleapis.com/token";

//   const assertionTime = Math.floor(Date.now() / 1000);
//   const expiryTime = assertionTime + 3600; // 1-hour validity

//   const jwtHeader = {
//     alg: "RS256",
//     typ: "JWT",
//   };

//   const jwtPayload = {
//     iss: env.GOOGLE_DRIVE_CLIENT_EMAIL,
//     scope: "https://www.googleapis.com/auth/drive.readonly",
//     aud: tokenEndpoint,
//     exp: expiryTime,
//     iat: assertionTime,
//   };

//   const jwtUnsigned =
//     objectToBase64url(jwtHeader) + "." + objectToBase64url(jwtPayload);

//   const signedJwt =
//     jwtUnsigned + "." + (await sign(jwtUnsigned, env.GOOGLE_DRIVE_PRIVATE_KEY));

//   const response = await fetch(tokenEndpoint, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
//   });

//   const json = await response.json();

//   if (!json.access_token) {
//     console.error("OAuth Token Error:", json);
//     throw new Error("Failed to generate OAuth token");
//   }
//   return json.access_token;
// }

// export async function onRequest(context) {
//   const { request, env } = context;
//   const { searchParams } = new URL(request.url);
//   const fileId = searchParams.get("fileId");

//   if (!fileId) {
//     return new Response("No fileId provided", { status: 400 });
//   }

//   try {
//     // Get an OAuth access token using your service account credentials.
//     const accessToken = await getAccessToken(env);

//     // Use the Drive API to get raw file bytes.
//     const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
//     const response = await fetch(driveUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch file from Drive API.");
//     }

//     const newResponse = new Response(response.body, response);
//     newResponse.headers.set("Access-Control-Allow-Origin", "*");
//     return newResponse;
//   } catch (err) {
//     return new Response("Error fetching target file: " + err.message, {
//       status: 500,
//     });
//   }
// }

function objectToBase64url(object) {
  return arrayBufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(object))
  );
}

function arrayBufferToBase64Url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, len = str.length; i < len; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

async function signContent(content, signingKey) {
  const buf = str2ab(content);
  const formattedKey = signingKey.replace(/\\n/g, "\n");
  const plainKey = formattedKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/(\r\n|\n|\r)/gm, "");
  const binaryKey = Uint8Array.from(atob(plainKey), (c) =>
    c.charCodeAt(0)
  ).buffer;
  const signer = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-V1_5",
      hash: { name: "SHA-256" },
    },
    false,
    ["sign"]
  );
  const binarySignature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-V1_5" },
    signer,
    buf
  );
  return arrayBufferToBase64Url(binarySignature);
}

async function getAccessToken(env) {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const assertionTime = Math.floor(Date.now() / 1000);
  const expiryTime = assertionTime + 3600;
  const jwtHeader = { alg: "RS256", typ: "JWT" };
  const jwtPayload = {
    iss: env.GOOGLE_DRIVE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: tokenEndpoint,
    exp: expiryTime,
    iat: assertionTime,
  };

  const jwtUnsigned =
    objectToBase64url(jwtHeader) + "." + objectToBase64url(jwtPayload);
  const signedJwt =
    jwtUnsigned +
    "." +
    (await signContent(jwtUnsigned, env.GOOGLE_DRIVE_PRIVATE_KEY));
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
  });
  const json = await response.json();
  if (!json.access_token) {
    console.error("OAuth Token Error:", json);
    throw new Error("Failed to generate OAuth token");
  }
  console.log("Access Token Retrieved");
  return json.access_token;
}

export async function GET({ request, env }) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new Response("No fileId provided", { status: 400 });
  }

  try {
    const accessToken = await getAccessToken(env);
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetch(driveUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch file from Drive API.");
    }
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    return newResponse;
  } catch (err) {
    return new Response("Error fetching target file: " + err.message, {
      status: 500,
    });
  }
}
