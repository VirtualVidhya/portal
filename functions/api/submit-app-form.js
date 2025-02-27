// POST /api/submit-app-form

// import { Resend } from "resend";

function capitalizeFirstLetter(name) {
  if (!name) return "Unknown";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

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
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

async function sign(content, signingKey) {
  const buf = str2ab(content);

  // Properly format private key (replace `\\n` with actual `\n`)
  const formattedKey = signingKey.replace(/\\n/g, "\n");

  const plainKey = formattedKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/(\r\n|\n|\r)/gm, "");

  // Decode using `Uint8Array.from()`
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
  const expiryTime = assertionTime + 3600; // 1-hour validity

  const jwtHeader = {
    alg: "RS256",
    typ: "JWT",
  };

  const jwtPayload = {
    iss: env.GOOGLE_DRIVE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.file",
    aud: tokenEndpoint,
    exp: expiryTime,
    iat: assertionTime,
  };

  const jwtUnsigned =
    objectToBase64url(jwtHeader) + "." + objectToBase64url(jwtPayload);

  const signedJwt =
    jwtUnsigned + "." + (await sign(jwtUnsigned, env.GOOGLE_DRIVE_PRIVATE_KEY));

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
  });

  const json = await response.json();

  // Check for authentication errors
  if (!json.access_token) {
    console.error("Google OAuth Token Error:", json);
    throw new Error("Failed to generate Google OAuth token");
  }

  console.log("Google Access Token Retrieved");
  return json.access_token;
}

async function encryptFile(file) {
  console.log(`Encrypting file: ${file.name}...`);

  // Generate a random encryption key (256-bit AES Key)
  const encryptionKey = crypto.getRandomValues(new Uint8Array(32));

  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert file to ArrayBuffer (Binary Data)
  const fileBuffer = new Uint8Array(await file.arrayBuffer());

  // Encrypt the file using AES-GCM
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await crypto.subtle.importKey(
      "raw",
      encryptionKey,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    ),
    fileBuffer
  );

  console.log("File Encrypted Successfully");

  // Return encrypted data, key & IV (Store key securely!)
  return {
    encryptedFile: new Uint8Array(encryptedData),
    encryptionKey: encryptionKey, // DO NOT store this in Google Drive
    iv: iv,
  };
}

async function uploadFileToDatabase(file, fileName, env) {
  console.log(`Uploading ${fileName} to Google Drive...`);

  // Encrypt the file first
  const { encryptedFile, encryptionKey, iv } = await encryptFile(file);

  const accessToken = await getAccessToken(env);
  if (!accessToken) {
    throw new Error("Google OAuth token is missing. Cannot upload file.");
  }

  const metadata = {
    name: fileName,
    parents: [env.GOOGLE_DRIVE_FOLDER_ID],
  };

  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // const fileBuffer = new Uint8Array(await file.arrayBuffer());

  const multipartRequestBody = new Uint8Array([
    ...new TextEncoder().encode(
      delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/octet-stream\r\n\r\n"
    ),
    // ...fileBuffer,
    ...encryptedFile,
    ...new TextEncoder().encode(closeDelimiter),
  ]);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  const jsonResponse = await response.json();

  if (!jsonResponse.id) {
    console.error("Google Drive Upload Failed:", jsonResponse);
    throw new Error("Google Drive Upload Failed");
  }

  console.log("File Uploaded Successfully:", jsonResponse);

  // return `https://drive.google.com/uc?id=${jsonResponse.id}`;

  // Return Google Drive file link & store encryption key somewhere safe
  return {
    fileUrl: `https://drive.google.com/uc?id=${jsonResponse.id}`,
    encryptionKey: btoa(String.fromCharCode(...new Uint8Array(encryptionKey))), // Convert key to Base64 for storage
    iv: btoa(String.fromCharCode(...new Uint8Array(iv))), // Convert IV to Base64 for storage
  };
}

async function storeInDatabase(env, formData) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Supabase URL:", supabaseUrl);
  console.log(
    "Supabase Key (Hidden for Security):",
    supabaseKey ? "Present" : "Missing"
  );

  if (supabaseUrl === undefined || supabaseKey === undefined) {
    throw new Error("Supabase URL or Key is missing");
  }

  const requestBody = {
    full_name: `${capitalizeFirstLetter(formData["first-name"])} ${
      capitalizeFirstLetter(formData["middle-name"]) || ""
    } ${capitalizeFirstLetter(formData["last-name"])}`,
    age: parseInt(formData.age, 10),
    dob: `${formData["day-dob"]}-${formData["month-dob"]}-${formData["year-dob"]}`,
    gender: formData.gender.toLowerCase(),
    employment_status: formData["employment-status"],
    occupation: formData.occupation || null,
    // photo_url: formData.photo || null,
    // aadhar_url: formData.aadhar || null,

    contact_no: formData["contact-no"],
    email: formData.email,
    parent_contact_no: formData["parent-contact-no"],
    curr_address: `${formData["curr-add-line1"]}, ${formData["curr-add-line2"]}, ${formData["curr-city"]}, ${formData["curr-state"]}, ${formData["curr-pincode"]}`,
    per_address: formData["per-add-line1"]
      ? `${formData["per-add-line1"]}, ${formData["per-add-line2"]}, ${formData["per-city"]}, ${formData["per-state"]}, ${formData["per-pincode"]}`
      : null,

    course: formData.course,
    academic_qual: formData["academic-qual"],
    skills: formData["rel-skills"] || null,
    previous_training: formData["prev-training"] || null,

    reference: formData.reference || null,

    status: "submitted",
  };

  if (formData.photo) {
    requestBody.photo_url = formData.photo.fileUrl;
    requestBody.photo_key = formData.photo.encryptionKey;
    requestBody.photo_iv = formData.photo.iv;
  }

  if (formData.aadhar) {
    requestBody.aadhar_url = formData.aadhar.fileUrl;
    requestBody.aadhar_key = formData.aadhar.encryptionKey;
    requestBody.aadhar_iv = formData.aadhar.iv;
  }

  console.log(
    "Request Body Sent to Supabase:",
    JSON.stringify(requestBody, null, 2)
  );

  const response = await fetch(`${supabaseUrl}/rest/v1/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log("Supabase Response Status:", response.status);
  console.log("Supabase Response Body:", responseText);

  if (!response.ok) {
    throw new Error(`Failed to store application in database`);
  }
}

// const spamNamePatterns = new Map();

// function isSpamName(name) {
//   // Check if name ends with "noita" (or slight variations)
//   const spamRegex = /(no[i1í]ta|n0ita|nσita|n𝑜ita)$/i;

//   if (spamRegex.test(name)) {
//     spamNamePatterns.set(name, (spamNamePatterns.get(name) || 0) + 1);
//     return true;
//   }

//   return false;
// }

export async function onRequestPost(context) {
  try {
    // console.log("Request Method:", context.request.method);
    // console.log("Request Headers:", context.request.headers);

    let output = {};

    const contentType = context.request.headers.get("content-type") || "";

    // Parse FormData
    // NOTE: Allows multiple values per key
    if (contentType.includes("multipart/form-data")) {
      // Correctly Parse Multipart Form Data
      let input = await context.request.formData();
      for (let [key, value] of input.entries()) {
        // Handle File Inputs Separately
        if (value instanceof File) {
          // Extract first name & last name and format them
          const firstName = capitalizeFirstLetter(output["first-name"]);
          const lastName = capitalizeFirstLetter(output["last-name"]);

          // Define new file names based on input field name
          let fileName = value.name; // Default to original name

          if (key === "photo") {
            fileName = `${firstName}${lastName}_PassportPhoto.${value.name
              .split(".")
              .pop()}`;
          } else if (key === "aadhar") {
            fileName = `${firstName}${lastName}_AadharCard.${value.name
              .split(".")
              .pop()}`;
          }

          console.log(`Renaming ${value.name} to ${fileName} before upload.`);

          // Upload Encrypted File to Google Drive
          const fileData = await uploadFileToDatabase(
            value,
            fileName,
            context.env
          );

          // Store file metadata instead of raw URL
          output[key] = {
            fileUrl: fileData.fileUrl,
            encryptionKey: fileData.encryptionKey,
            iv: fileData.iv,
          };

          // let fileUrl = await uploadFileToDrive(value, fileName, context.env);

          // let fileUrl = await uploadFileToDatabase(
          //   value,
          //   fileName,
          //   context.env
          // );
          // output[key] = fileUrl;

          // output[key] = fileName;

          // Upload to MEGA & Google Drive
          // const { megaUrl, driveUrl } = await uploadFileToBothStorages(
          //   value,
          //   fileName,
          //   context.env
          // );

          // // Store URLs in output
          // if (key === "photo") {
          //   output.photo_mega = megaUrl || null;
          //   output.photo_drive = driveUrl || null;
          // } else if (key === "aadhar-card") {
          //   output.aadhar_mega = megaUrl || null;
          //   output.aadhar_drive = driveUrl || null;
          // }
        } else {
          output[key] = value;
        }
      }
    } else if (contentType.includes("application/json")) {
      // Handle JSON Requests Properly
      output = await context.request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse URL-Encoded Form Data
      let inputText = await context.request.text();
      let params = new URLSearchParams(inputText);
      for (let [key, value] of params) {
        output[key] = value;
      }
    } else {
      throw new Error("Unsupported Content-Type");
    }

    // console.log("Form Data:", output);

    const honeypot = output.address;

    // Return early with pretend confirmation if bot hit honeypot
    if (honeypot !== "") {
      return Response.redirect(
        "https://portal.vvidhya.com/application-form/",
        303
      );
    }

    // If the name contains a known spam, Return early with pretend confirmation
    // if (isSpamName(output.name.toLowerCase())) {
    //   return Response.redirect(
    //     "https://portal.vvidhya.com/application-form/",
    //     303
    //   );
    // }

    // Store the form-data in Supabase database
    await storeInDatabase(context.env, output);

    return Response.redirect(
      "https://portal.vvidhya.com/application-form/",
      303
    );

    // let englishChars = (
    //   output.message.match(/[a-zA-Z0-9.,&%()\[\]{}?!'"\s]/g) || []
    // ).length;
    // let totalChars = output.message.length;

    // // If more than 30% of characters are non-English, Return early with pretend confirmation
    // if (englishChars / totalChars < 0.7) {
    //   return Response.redirect(
    //     "https://portal.vvidhya.com/application-form/",
    //     303
    //   );
    // }

    // Send form-data as an email notification via Resend
    // const resend = new Resend(context.env.RESEND_API_KEY);
    // const { data, error } = await resend.emails.send({
    //   from: `Inquiry at V.Vidhya <${context.env.SENDER_EMAIL}>`,
    //   to: `Contact at V.Vidhya <${context.env.RECIPIENT_EMAIL}>`,
    //   replyTo: output.email,
    //   subject: `[vvidhya.com] Inquiry request from ${output.name}`,
    //   text: `Name: ${output.name}\nEmail: ${output.email}\nPhone: ${output.phone}\nCourse: ${output.course}\n\nMessage: ${output.message}`,
    // });
    // console.log({ data, error });

    // if (error) {
    //   return Response.redirect("https://portal.vvidhya.com/", 303);
    // } else {
    //   return Response.redirect(
    //     "https://portal.vvidhya.com/application-form/",
    //     303
    //   );
    // }
  } catch (err) {
    console.error("Error:", err);
    return new Response(`Errror: ${err.message}`, { status: 400 });
  }
}
