// scripts/compute_signature.js
// Usage example:
//   SUPPLY SIGNING_KEY in env or .env, then run:
//   node scripts/compute_signature.js --certificate_id "2025-CSE-000123" --student_name "Alice" --course_name "BSc CS" --course_start_date "2024-08-01" --course_end_date "2025-05-31" --grade "A" --issued_at "2025-06-15"

import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx === -1 ? "" : process.argv[idx + 1] || "";
}

const certificate_id = getArg("certificate_id");
const student_name = getArg("student_name");
const course_name = getArg("course_name");
const course_start_date = getArg("course_start_date");
const course_end_date = getArg("course_end_date");
const grade = getArg("grade");
const issued_at = getArg("issued_at");

if (!certificate_id || !student_name || !course_name || !issued_at) {
  console.error(
    "Missing required args. Required: --certificate_id --student_name --course_name --issued_at"
  );
  process.exit(1);
}

const SIGNING_KEY = process.env.SIGNING_KEY;
if (!SIGNING_KEY) {
  console.error("Set SIGNING_KEY in env (e.g. export SIGNING_KEY=...)");
  process.exit(1);
}

function canonicalize(obj) {
  const parts = [
    obj.certificate_id || "",
    (obj.student_name || "").trim(),
    (obj.course_name || "").trim(),
    obj.course_start_date || "",
    obj.course_end_date || "",
    (obj.grade || "").trim(),
    obj.issued_at || "",
  ];
  return parts.join("|");
}

function signHmacHex(canonical, key) {
  return crypto.createHmac("sha256", key).update(canonical).digest("hex");
}

const canonical = canonicalize({
  certificate_id,
  student_name,
  course_name,
  course_start_date,
  course_end_date,
  grade,
  issued_at,
});
const signature = signHmacHex(canonical, SIGNING_KEY);

console.log("canonical_string=" + canonical);
console.log("signature=" + signature);
