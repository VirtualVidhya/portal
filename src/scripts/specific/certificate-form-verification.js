// Dev probe config - adjust if your wrangler dev port differs.
const DEV_WRANGLER_ORIGIN = "http://localhost:8788";

async function getApiBase() {
  // Try the local Pages dev server quickly; if it responds use it, else use same-origin (production)
  // try {
  //   const ping = await fetch(
  //     `${WRANGLER_ORIGIN}/certificate-authenticator?token=__ping__`,
  //     { method: "GET", mode: "cors", cache: "no-store" }
  //   );
  //   if (ping.ok) return WRANGLER_ORIGIN;
  // } catch (e) {}

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return DEV_WRANGLER_ORIGIN;
  }

  return "";
}

// --- Helper to fetch JSON safely and show helpful debug text when response isn't JSON
async function safeFetchJson(url, fetchOptions = {}) {
  let resp;
  try {
    resp = await fetch(
      url,
      Object.assign(
        { method: "GET", mode: "cors", cache: "no-store" },
        fetchOptions
      )
    );
  } catch (err) {
    // network-level errors, blocked by client/extensions etc.
    throw new Error(
      `Network error or blocked by client: ${err.message || err}`
    );
  }

  const contentType = resp.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Read the body as text so we can see the HTML/error.
    const text = await resp.text();
    // Trim lengthy HTML for safety
    const snippet = text
      ? text.length > 1000
        ? text.slice(0, 1000) + "…[truncated]"
        : text
      : "<empty response>";
    throw new Error(
      `Non-JSON response (status ${resp.status}). Response body (snippet): ${snippet}`
    );
  }

  // parse JSON
  try {
    return await resp.json();
  } catch (err) {
    // In case parse still fails
    const text = await resp.text();
    throw new Error(
      `Failed to parse JSON: ${err.message}. Response text: ${text.slice(
        0,
        200
      )}`
    );
  }
}

function escapeHtml(s) {
  return String(s || "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

const form = document.getElementById("certificate-form");
const error_msg = document.getElementById("field-error");
const loading_indicator = document.querySelector(
  ".form-submit-btn .dot-loader"
);
const submit_btn_text = document.querySelector(".form-submit-btn span");
const certi_ip_field = document.getElementById("certificate-id-ip");
const valid_response_section = document.getElementById(
  "valid-response-section"
);
const invalid_response_section = document.getElementById(
  "invalid-response-section"
);

function toggleSubmitBtnVerifyingState(is_verifying) {
  if (is_verifying) {
    submit_btn_text.textContent = `Verifying`;
    loading_indicator.classList.remove("hidden");
  } else {
    submit_btn_text.textContent = `Verify`;
    loading_indicator.classList.add("hidden");
  }
}

function resetInputErrorStyles() {
  certi_ip_field.classList.remove("border-font-color-red-dark");
  certi_ip_field.classList.add("border-2");
}

function toggleError(is_showing, msg = "", is_input_error = false) {
  if (is_showing) {
    if (is_input_error) {
      certi_ip_field.classList.add("border-font-color-red-dark");
      certi_ip_field.classList.add("border-2");
    }
  } else {
    resetInputErrorStyles();
  }
  error_msg.textContent = `${msg}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  resetInputErrorStyles();
  valid_response_section.classList.add("hidden");
  invalid_response_section.classList.add("hidden");
  toggleSubmitBtnVerifyingState(true);
  error_msg.innerHTML = "";

  const certiId = certi_ip_field.value.trim().toUpperCase();

  if (!certiId) {
    toggleError(true, "Please enter a certificate-id.", true);
    toggleSubmitBtnVerifyingState(false);
    return;
  }

  var reg = new RegExp("^V\\d{4}[A-Za-z]{3}\\d{3}$");

  if (!reg.test(certiId)) {
    console.log(reg.test(certiId), certiId);
    toggleError(true, "Please enter the certificate-id in valid format.", true);
    toggleSubmitBtnVerifyingState(false);
    return;
  }

  const apiBase = await getApiBase(); // '' in prod, wrangler origin in dev if available
  // const url = `${apiBase}/certificate-authenticator/verify?token=${encodeURIComponent(certiId)}`;
  const url = `${apiBase}/api/certificate/verify?token=${encodeURIComponent(
    certiId
  )}`;

  try {
    // const resp = await fetch(
    //   `/certificate-authenticator/verify?token=${encodeURIComponent(certiId)}`
    // );
    // const resp = await fetch(
    //   `/certificate-authenticator?token=${encodeURIComponent(certiId)}`
    // );
    // const json = await resp.json();

    // const resp = await fetch(url, { method: "GET", mode: "cors" });
    // If server returns HTML (404 page), parsing will fail, we'll catch that
    // const json = await resp.json();
    const json = await safeFetchJson(url);

    if (json.error) {
      toggleError(
        true,
        `Error: ${json.error}${json.detail ? " — " + json.detail : ""}`,
        false
      );
      toggleSubmitBtnVerifyingState(false);
      return;
    }

    if (json.valid) {
      const certi_data = json.record;

      const certi_id_el = document.getElementById("certi-id");
      const certi_studentname_el =
        document.getElementById("certi-student-name");
      const certi_coursename_el = document.getElementById("certi-course-name");
      const certi_grade_el = document.getElementById("certi-grade");
      const certi_startdate_el = document.getElementById(
        "certi-course-start-date"
      );
      const certi_enddate_el = document.getElementById("certi-course-end-date");
      const certi_issueddate_el = document.getElementById("certi-issued-date");

      certi_id_el.innerHTML = `${escapeHtml(certi_data.certificate_id || "")}`;
      certi_studentname_el.innerHTML = `${escapeHtml(
        certi_data.student_name || ""
      )}`;
      certi_coursename_el.innerHTML = `${escapeHtml(
        certi_data.course_name || ""
      )}`;
      certi_grade_el.innerHTML = `${escapeHtml(certi_data.grade || "")}`;
      certi_startdate_el.innerHTML = `${escapeHtml(
        certi_data.course_start_date || ""
      )}`;
      certi_enddate_el.innerHTML = `${escapeHtml(
        certi_data.course_end_date || ""
      )}`;
      certi_issueddate_el.innerHTML = `${escapeHtml(
        certi_data.issued_at || ""
      )}`;

      valid_response_section.classList.remove("hidden");
      valid_response_section.classList.add("flex");
    } else {
      const reason = json.reason || "invalid";
      let message = "Certificate not valid";
      if (reason === "not_found") message = "Certificate not found";
      if (reason === "revoked") message = "Certificate has been revoked";
      if (reason === "signature_mismatch")
        message =
          "Certificate data has been tampered with or signature mismatch";

      invalid_response_section.classList.remove("hidden");
      invalid_response_section.classList.add("flex");
    }
    toggleSubmitBtnVerifyingState(false);
  } catch (err) {
    // toggleError(true, `Network or parse error: ${err.message}`, false);
    const msg = String(err.message || err);
    const userFriendly =
      msg.includes("blocked by client") || msg.includes("ERR_BLOCKED_BY_CLIENT")
        ? "Request blocked by a browser extension (adblock/privacy). Try disabling adblock for this site or use a different browser."
        : msg.startsWith("Non-JSON response")
        ? "Unexpected non-JSON response from server. Check server logs or open the network tab to see the response."
        : "Network or parse error: " + msg;
    toggleError(true, userFriendly, false);
    toggleSubmitBtnVerifyingState(false);
  }

  // form.reset();
});
