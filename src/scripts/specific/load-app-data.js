const API_URL = "/api/get-applications";

// Helper: Convert URL-safe Base64 to Uint8Array (with padding).
function base64ToUint8Array(base64) {
  base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
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

// Extract fileId from a Google Drive URL of the form "https://drive.google.com/uc?id=<fileId>"
function extractFileId(url) {
  const match = url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : null;
}

// Decrypts an encrypted file by fetching its binary data from our drive-proxy.
async function decryptFile(fileUrl, keyBase64, ivBase64) {
  try {
    const fileId = extractFileId(fileUrl);
    if (!fileId) throw new Error("Invalid file URL, cannot extract fileId");
    // console.log("Fetching encrypted file...");
    // console.log("Fetching encrypted file for fileId:", fileId);
    // console.log("Using key:", keyBase64);
    // console.log("Using IV:", ivBase64);

    // Call our drive-proxy endpoint with the fileId.
    const proxyUrl = `/api/proxy?fileId=${encodeURIComponent(fileId)}`;
    const fileResponse = await fetch(proxyUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to fetch encrypted file from proxy.");
    }
    const encryptedBuffer = await fileResponse.arrayBuffer();

    // Decode key and IV from Base64.
    const keyBytes = base64ToUint8Array(keyBase64);
    const ivBytes = base64ToUint8Array(ivBase64);

    // Import the key for decryption using AES-GCM.
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decrypt the encrypted binary data.
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encryptedBuffer
    );

    // Return an object URL for the decrypted file.
    return URL.createObjectURL(new Blob([decryptedBuffer]));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// Fetch application data from our API.
async function fetchApplications() {
  // console.log("Fetching Applications from:", API_URL);
  try {
    const response = await fetch(API_URL);
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

let applications;

// Display the applications on the page.
async function displayApplications() {
  // console.log("Displaying Applications...");
  applications = await fetchApplications();
  const tableBody = document.getElementById("applications-table");

  if (applications.length === 0) {
    tableBody.innerHTML = `<tr class="text-center"><td colspan='6'>No applications found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = ""; // Clear any loading message

  applications.forEach(async (app) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${app.full_name}</td>
    <td>${app.email}</td>
    <td>${app.contact_no}</td>
    <td>${app.course}</td>
    <td>${app.status}</td>
    <td>
      <a href="/dashboard/application/${app.id}">
        <ViewMoreBtn attributes={viewAppBtnAttr} />
      </a>
    </td>
  `;
    // row.innerHTML = `
    //   <td>${app.full_name}</td>
    //   <td>${app.email}</td>
    //   <td>${app.contact_no}</td>
    //   <td>${app.course}</td>
    //   <td class="photo-cell">Loading...</td>
    //   <td class="aadhar-cell">Loading...</td>
    // `;
    tableBody.appendChild(row);

    // const photoCell = row.querySelector(".photo-cell");
    // const aadharCell = row.querySelector(".aadhar-cell");

    // let photoURL = null;
    // if (app.photo_url && app.photo_key && app.photo_iv) {
    //   photoURL = await decryptFile(app.photo_url, app.photo_key, app.photo_iv);
    // }
    // if (photoURL) {
    //   photoCell.innerHTML = `<img src="${photoURL}" width="100" height="100" alt="Passport Photo" />`;
    // } else {
    //   photoCell.innerHTML = "Decryption Failed";
    // }

    // let aadharURL = null;
    // if (app.aadhar_url && app.aadhar_key && app.aadhar_iv) {
    //   aadharURL = await decryptFile(
    //     app.aadhar_url,
    //     app.aadhar_key,
    //     app.aadhar_iv
    //   );
    // }
    // if (aadharURL) {
    //   aadharCell.innerHTML = `<a href="${aadharURL}" download="${app.full_name}_Aadhar.pdf">Download Aadhar</a>`;
    // } else {
    //   aadharCell.innerHTML = "Decryption Failed";
    // }
  });
}

// Start the display process.
displayApplications();

function showIndividualApplication() {}
