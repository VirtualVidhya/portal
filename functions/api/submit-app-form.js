// POST /api/submit-app-form

// import { Resend } from "resend";
import { Storage } from "megajs";

async function uploadFileToDrive(file, fileName, env) {
  console.log(`Uploading ${fileName} to MEGA...`);

  const mega = new Storage({
    email: env.MEGA_EMAIL,
    password: env.MEGA_PASSWORD,
  });

  await mega.ready; // Ensure login is successful

  // Convert file to buffer
  const fileBuffer = await file.arrayBuffer();
  const fileSize = fileBuffer.byteLength; // Get file size

  const uploadStream = mega.upload({ name: fileName, size: fileSize }); // Specify file size
  uploadStream.end(Buffer.from(fileBuffer)); // Upload the file buffer

  return new Promise((resolve, reject) => {
    uploadStream.on("complete", (file) => {
      console.log(`File uploaded: ${file.name}`);
      resolve(file.downloadLink); // Get shareable MEGA URL
    });

    uploadStream.on("error", (err) => {
      console.error("MEGA Upload Error:", err);
      reject(err);
    });
  });
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
    full_name: `${formData["first-name"]} ${formData["middle-name"] || ""} ${
      formData["last-name"]
    }`,
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

    // Parse FormData to JSON
    // NOTE: Allows multiple values per key
    if (contentType.includes("multipart/form-data")) {
      // Correctly Parse Multipart Form Data
      let input = await context.request.formData();
      for (let [key, value] of input.entries()) {
        // Handle File Inputs Separately
        if (value instanceof File) {
          fileUrl = await uploadFileToDrive(value, value.name, context.env);
          // output[key] = await uploadFileToSupabase(value, key, context.env);
          output[key] = fileUrl;
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
