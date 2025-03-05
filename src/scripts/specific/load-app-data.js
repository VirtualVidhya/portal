// // const API_URL = import.meta.env.PUBLIC_API_URL + "/api/get-applications";

// console.log("Executing load-data.js");

// const API_URL = "/api/get-applications";

// async function fetchApplications() {
//   console.log("Fetching Applications...");
//   try {
//     console.log("Fetching applications from:", API_URL);
//     const response = await fetch(API_URL);
//     const applications = await response.json();
//     return applications;
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return [];
//   }
// }

// function base64ToUint8Array(base64) {
//   base64 = base64.replace(/-/g, "+").replace(/_/g, "/"); // Handle URL-safe Base64
//   const binaryString = atob(base64);
//   const length = binaryString.length;
//   const bytes = new Uint8Array(length);
//   for (let i = 0; i < length; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes;
// }

// async function decryptFile(encryptedBase64, keyBase64, ivBase64) {
//   try {
//     console.log("Decrypting with key:", keyBase64);
//     console.log("Decrypting with IV:", ivBase64);

//     const key = base64ToUint8Array(keyBase64);
//     const iv = base64ToUint8Array(ivBase64);
//     const encryptedData = base64ToUint8Array(encryptedBase64);

//     const cryptoKey = await crypto.subtle.importKey(
//       "raw",
//       key,
//       { name: "AES-GCM" },
//       false,
//       ["decrypt"]
//     );

//     const decryptedBuffer = await crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       cryptoKey,
//       encryptedData
//     );

//     return URL.createObjectURL(new Blob([decryptedBuffer]));
//   } catch (error) {
//     console.error("Decryption failed:", error);
//     return null;
//   }
// }

// async function displayApplications() {
//   console.log("Displaying Applications...");
//   const applications = await fetchApplications();
//   const tableBody = document.getElementById("applications-table");

//   if (applications.length === 0) {
//     tableBody.innerHTML =
//       "<tr><td colspan='6'>No applications found.</td></tr>";
//     return;
//   }

//   tableBody.innerHTML = ""; // Clear loading message

//   applications.forEach(async (app) => {
//     const row = document.createElement("tr");

//     row.innerHTML = `
//       <td>${app.full_name}</td>
//       <td>${app.email}</td>
//       <td>${app.contact_no}</td>
//       <td>${app.course}</td>
//       <td class="photo-cell">Decrypting...</td>
//       <td class="aadhar-cell">Decrypting...</td>
//     `;

//     tableBody.appendChild(row);

//     // Decrypt photo & aadhar asynchronously
//     const photoCell = row.querySelector(".photo-cell");
//     const aadharCell = row.querySelector(".aadhar-cell");

//     const photoURL = await decryptFile(
//       app.photo_url,
//       app.photo_key,
//       app.photo_iv
//     );
//     const aadharURL = await decryptFile(
//       app.aadhar_url,
//       app.aadhar_key,
//       app.aadhar_iv
//     );

//     if (photoURL) {
//       photoCell.innerHTML = `<img src="${photoURL}" width="100" height="100" alt="Passport Photo" />`;
//     } else {
//       photoCell.innerHTML = "Decryption Failed";
//     }

//     if (aadharURL) {
//       aadharCell.innerHTML = `<a href="${aadharURL}" download="${app.full_name}_Aadhar.pdf">Download Aadhar</a>`;
//     } else {
//       aadharCell.innerHTML = "Decryption Failed";
//     }
//   });
// }

// // window.addEventListener("DOMContentLoaded", () => {
// //   console.log("DOM fully loaded, starting application display...");
// // });

// displayApplications();

console.log("Executing load-app-data.js");

const API_URL = "/api/get-applications";

// Helper: Convert URL-safe Base64 to Uint8Array, adding padding if necessary.
function base64ToUint8Array(base64) {
  // Convert URL-safe Base64 to standard Base64
  base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if missing
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decrypts an encrypted file by fetching its binary data via the proxy endpoint.
async function decryptFile(fileUrl, keyBase64, ivBase64) {
  try {
    console.log("Decrypting file from:", fileUrl);
    console.log("Using key:", keyBase64);
    console.log("Using IV:", ivBase64);

    // Decode key and IV from Base64 (with proper padding)
    const keyBytes = base64ToUint8Array(keyBase64);
    const ivBytes = base64ToUint8Array(ivBase64);

    // Use a proxy endpoint to fetch the file to bypass CORS restrictions.
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(fileUrl)}`;
    const fileResponse = await fetch(proxyUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to fetch encrypted file.");
    }
    const encryptedBuffer = await fileResponse.arrayBuffer();

    // Import the key for decryption using AES-GCM
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decrypt the binary data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encryptedBuffer
    );

    // Create an object URL from the decrypted data.
    return URL.createObjectURL(new Blob([decryptedBuffer]));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// Fetch application data from the API.
async function fetchApplications() {
  console.log("Fetching Applications from:", API_URL);
  try {
    const response = await fetch(API_URL);
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

// Display the applications on the page.
async function displayApplications() {
  console.log("Displaying Applications...");
  const applications = await fetchApplications();
  const tableBody = document.getElementById("applications-table");

  if (applications.length === 0) {
    tableBody.innerHTML =
      "<tr><td colspan='6'>No applications found.</td></tr>";
    return;
  }

  tableBody.innerHTML = ""; // Clear any loading message

  // For each application record, create a table row and decrypt file data.
  applications.forEach(async (app) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${app.full_name}</td>
      <td>${app.email}</td>
      <td>${app.contact_no}</td>
      <td>${app.course}</td>
      <td class="photo-cell">Decrypting...</td>
      <td class="aadhar-cell">Decrypting...</td>
    `;

    tableBody.appendChild(row);

    // Locate the cells where decrypted data will be shown.
    const photoCell = row.querySelector(".photo-cell");
    const aadharCell = row.querySelector(".aadhar-cell");

    // Decrypt the photo (assumed to be an image)
    let photoURL = null;
    if (app.photo_url && app.photo_key && app.photo_iv) {
      photoURL = await decryptFile(app.photo_url, app.photo_key, app.photo_iv);
    }
    if (photoURL) {
      photoCell.innerHTML = `<img src="${photoURL}" width="100" height="100" alt="Passport Photo" />`;
    } else {
      photoCell.innerHTML = "Decryption Failed";
    }

    // Decrypt the aadhar document (assumed to be a PDF)
    let aadharURL = null;
    if (app.aadhar_url && app.aadhar_key && app.aadhar_iv) {
      aadharURL = await decryptFile(
        app.aadhar_url,
        app.aadhar_key,
        app.aadhar_iv
      );
    }
    if (aadharURL) {
      aadharCell.innerHTML = `<a href="${aadharURL}" download="${app.full_name}_Aadhar.pdf">Download Aadhar</a>`;
    } else {
      aadharCell.innerHTML = "Decryption Failed";
    }
  });
}

// Start the application display process.
displayApplications();
