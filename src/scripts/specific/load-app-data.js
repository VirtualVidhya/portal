// const API_URL = import.meta.env.PUBLIC_API_URL + "/api/get-applications";
const API_URL = "/api/get-applications";

async function fetchApplications() {
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
    const key = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
    const encryptedData = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0)
    );

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

window.addEventListener("DOMContentLoaded", displayApplications);
