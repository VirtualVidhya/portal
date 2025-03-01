// POST /api/submit-app-form

// import { Resend } from "resend";
import { Storage } from "megajs";
import { google } from "googleapis";

function capitalizeFirstLetter(name) {
  if (!name) return "Unknown";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

async function uploadFileToMega(file, fileName, env) {
  console.log(`Uploading ${fileName} to MEGA...`);

  const credentials = {
    email: env.MEGA_EMAIL,
    password: env.MEGA_PASSWORD,
  };

  await mega.ready; // Ensure login is successful

  console.log(`Logged into MEGA as ${env.MEGA_EMAIL}`);
  console.log(`Used Storage: ${mega.space.used} bytes`);
  console.log(`Available Storage: ${mega.space.total - mega.space.used} bytes`);
  console.log(`Available Bandwidth: ${mega.quota.free} bytes`);

  // Convert file to buffer
  const fileBuffer = new Uint8Array(await file.arrayBuffer());
  const fileSize = fileBuffer.length; // Get file size

  // Upload file to MEGA
  const uploadStream = mega.upload({ name: fileName, size: fileSize });
  uploadStream.end(fileBuffer); // Send file buffer to MEGA

  return new Promise((resolve, reject) => {
    uploadStream.on("complete", async (file) => {
      console.log(`File uploaded successfully: ${file.name}`);

      try {
        // Generate public share link
        const shareURL = await file.link();
        console.log(`🔗 MEGA File Link: ${shareURL}`);
        resolve(shareURL);
      } catch (linkError) {
        console.error("Error generating MEGA file link:", linkError);
        reject(new Error("Failed to generate MEGA file link"));
      }
    });

    uploadStream.on("error", (err) => {
      console.error("MEGA Upload Error:", err);
      reject(new Error("MEGA Upload Failed"));
    });
  });
}

async function uploadFileToGoogleDrive(file, fileName, env) {
  console.log(`Uploading ${fileName} to Google Drive...`);

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(env.GOOGLE_CREDENTIALS), // Store credentials as a secret
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });

  const fileBuffer = new Uint8Array(await file.arrayBuffer());
  const fileMetadata = {
    name: fileName,
    parents: [env.GOOGLE_DRIVE_FOLDER_ID], // Set folder ID in Google Drive
  };

  const media = {
    mimeType: file.type,
    body: Buffer.from(fileBuffer),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
  });

  return `https://drive.google.com/file/d/${response.data.id}/view`;
}

async function uploadFileToBothStorages(file, fileName, env) {
  let megaUrl = null;
  let driveUrl = null;

  console.log(`Uploading ${fileName} to MEGA and Google Drive...`);

  // Try MEGA upload
  try {
    megaUrl = await uploadFileToMega(file, fileName, env);
    console.log(`MEGA Upload Successful: ${megaUrl}`);
  } catch (megaError) {
    console.error("MEGA Upload Failed:", megaError.message);
  }

  // Try Google Drive upload
  try {
    driveUrl = await uploadFileToGoogleDrive(file, fileName, env);
    console.log(`Google Drive Upload Successful: ${driveUrl}`);
  } catch (driveError) {
    console.error("Google Drive Upload Failed:", driveError.message);
  }

  // If both fail, throw an error
  if (!megaUrl && !driveUrl) {
    throw new Error("File uploads failed.");
  }

  // Return successful URLs (whichever worked)
  return { megaUrl, driveUrl };
}

// async function uploadFileToDrive(file, fileName, env) {
//   console.log(`Uploading ${fileName} to MEGA...`);

//   const mega = new Storage({
//     email: env.MEGA_EMAIL,
//     password: env.MEGA_PASSWORD,
//   });

//   await mega.ready; // Ensure login is successful

//   console.log(`Used Storage: ${mega.space.used} bytes`);
//   console.log(`Available Storage: ${mega.space.total - mega.space.used} bytes`);
//   console.log(`Available Bandwidth: ${mega.quota.free} bytes`);

//   // Convert file to buffer
//   const fileBuffer = new Uint8Array(await file.arrayBuffer());
//   const fileSize = fileBuffer.length; // Get file size

//   const uploadStream = mega.upload({ name: fileName, size: fileSize }); // Specify file size
//   uploadStream.end(fileBuffer); // Upload the file buffer

//   return new Promise((resolve, reject) => {
//     uploadStream.on("complete", (file) => {
//       console.log(`File uploaded: ${file.name}`);
//       resolve(file.downloadLink); // Get shareable MEGA URL
//     });

//     uploadStream.on("error", (err) => {
//       console.error("MEGA Upload Error:", err);
//       reject(err);
//     });
//   });
// }

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
    photo_url: formData.photo || null,
    aadhar_url: formData["aadhar-card"] || null,

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
          } else if (key === "aadhar-card") {
            fileName = `${firstName}${lastName}_AadharCard.${value.name
              .split(".")
              .pop()}`;
          }

          console.log(`Renaming ${value.name} to ${fileName} before upload.`);

          // let fileUrl = await uploadFileToDrive(value, fileName, context.env);
          // output[key] = fileUrl;
          // Upload to MEGA & Google Drive
          const { megaUrl, driveUrl } = await uploadFileToBothStorages(
            value,
            fileName,
            context.env
          );

          // Store URLs in output
          if (key === "photo") {
            output.photo_mega = megaUrl || null;
            output.photo_drive = driveUrl || null;
          } else if (key === "aadhar-card") {
            output.aadhar_mega = megaUrl || null;
            output.aadhar_drive = driveUrl || null;
          }
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
