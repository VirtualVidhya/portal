import { useEffect } from "preact/hooks";

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

async function decryptFile(fileUrl, keyBase64, ivBase64) {
  try {
    // Extract fileId from Google Drive URL
    const match = fileUrl.match(/[?&]id=([^&]+)/);
    if (!match) throw new Error("Invalid file URL");
    const fileId = match[1];
    // Use your API worker proxy endpoint (adjust path if necessary)
    const proxyUrl = `https://api.vvidhya.com/api/proxy?fileId=${encodeURIComponent(
      fileId
    )}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Failed to fetch encrypted file");
    const encryptedBuffer = await response.arrayBuffer();

    const keyBytes = base64ToUint8Array(keyBase64);
    const ivBytes = base64ToUint8Array(ivBase64);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encryptedBuffer
    );

    return URL.createObjectURL(new Blob([decryptedBuffer]));
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

export default function useDecryptFiles(application) {
  useEffect(() => {
    async function runDecryption() {
      // Decrypt passport photo if all data is available.
      if (
        application.photo_url &&
        application.photo_key &&
        application.photo_iv
      ) {
        const photoBlobUrl = await decryptFile(
          application.photo_url,
          application.photo_key,
          application.photo_iv
        );
        if (photoBlobUrl) {
          const passportImg = document.getElementById("passport-photo");
          if (passportImg) {
            passportImg.src = photoBlobUrl;
          }
        } else {
          console.log("Failed to decrypt passport photo file.");
        }
      } else {
        console.log("Passport photo data is missing.");
      }

      // Decrypt Aadhar file if all data is available.
      if (
        application.aadhar_url &&
        application.aadhar_key &&
        application.aadhar_iv
      ) {
        const aadharBlobUrl = await decryptFile(
          application.aadhar_url,
          application.aadhar_key,
          application.aadhar_iv
        );
        if (aadharBlobUrl) {
          const aadharLink = document.getElementById("view-aadhar-card");
          if (aadharLink) {
            aadharLink.href = aadharBlobUrl;
            aadharLink.download = `${application.full_name}_Aadhar.pdf`;
          }
        } else {
          console.log("Failed to decrypt Aadhar Card file.");
        }
      } else {
        console.log("Aadhar card data is missing.");
      }
    }

    runDecryption();
  }, [application]);
}
