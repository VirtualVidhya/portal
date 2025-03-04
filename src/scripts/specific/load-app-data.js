// const API_URL = import.meta.env.PUBLIC_API_URL + "/api/get-applications";

console.log("Executing load-data.js");

const API_URL = "/api/get-applications";

async function fetchApplications() {
  console.log("Fetching Applications...");
  try {
    console.log("Fetching applications from:", API_URL);
    const response = await fetch(API_URL);
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

async function decryptFile(encryptedBase64, keyBase64, ivBase64) {
  try {
    console.log("Decrypting with key:", keyBase64);
    console.log("Decrypting with IV:", ivBase64);

    // Convert Base64 to Uint8Array properly
    function base64ToUint8Array(base64) {
      return new Uint8Array(
        atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map((c) => c.charCodeAt(0))
      );
    }

    const key = base64ToUint8Array(keyBase64);
    const iv = base64ToUint8Array(ivBase64);
    const encryptedData = base64ToUint8Array(encryptedBase64);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encryptedData
    );

    return URL.createObjectURL(new Blob([decryptedBuffer]));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

async function displayApplications() {
  console.log("Displaying Applications...");
  const applications = await fetchApplications();
  const tableBody = document.getElementById("applications-table");

  if (applications.length === 0) {
    tableBody.innerHTML =
      "<tr><td colspan='6'>No applications found.</td></tr>";
    return;
  }

  tableBody.innerHTML = ""; // Clear loading message

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

    // Decrypt photo & aadhar asynchronously
    const photoCell = row.querySelector(".photo-cell");
    const aadharCell = row.querySelector(".aadhar-cell");

    const photoURL = await decryptFile(
      app.photo_url,
      app.photo_key,
      app.photo_iv
    );
    const aadharURL = await decryptFile(
      app.aadhar_url,
      app.aadhar_key,
      app.aadhar_iv
    );

    if (photoURL) {
      photoCell.innerHTML = `<img src="${photoURL}" width="100" height="100" alt="Passport Photo" />`;
    } else {
      photoCell.innerHTML = "Decryption Failed";
    }

    if (aadharURL) {
      aadharCell.innerHTML = `<a href="${aadharURL}" download="${app.full_name}_Aadhar.pdf">Download Aadhar</a>`;
    } else {
      aadharCell.innerHTML = "Decryption Failed";
    }
  });
}

// window.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded, starting application display...");
// });

displayApplications();
