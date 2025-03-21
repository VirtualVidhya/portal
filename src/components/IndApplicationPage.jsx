import { h } from "preact";
import { route } from "preact-router";
import { useApplications } from "./ApplicationContext.jsx";

export default function ApplicationDetail({ id }) {
  // Retrieve the list of applications from context.
  const { applications } = useApplications();

  // Look for the application with the given id.
  const application = applications.find((app) => app.id === id);

  // If not found, optionally you can route back or show a fallback.
  if (!application) {
    // For instance, redirect back to the table page.
    route("/dashboard/applications");
    return <div>Application not found. Redirecting...</div>;
  }

  return (
    <div class="ind-app-data-container">
      <table class="ind-app-data-table">
        <tbody id="applications-table">
          <tr class="text-left">
            <td colspan="2">
              <img
                id="passport-photo"
                src="/images/examples/passport-photo.png"
                alt="Passport Photo"
                class="w-auto h-18"
              />
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{application.full_name}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{application.age}</td>
          </tr>
          <tr>
            <td>DOB</td>
            <td>{application.dob}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{application.gender}</td>
          </tr>
          <tr>
            <td>Employment Status</td>
            <td>{application.employment_status}</td>
          </tr>
          <tr>
            <td>Occupation</td>
            <td>{application.occupation}</td>
          </tr>

          <tr>
            <td>Mobile Number</td>
            <td>{application.contact_no}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{application.email}</td>
          </tr>
          <tr>
            <td>Emergency Contact Number</td>
            <td>{application.parent_contact_no}</td>
          </tr>
          <tr>
            <td>Current Address</td>
            <td>{application.curr_address}</td>
          </tr>
          <tr>
            <td>Permanent Address</td>
            <td>{application.per_address}</td>
          </tr>

          <tr>
            <td>Course</td>
            <td>{application.course}</td>
          </tr>
          <tr>
            <td>Academic Qualificaion</td>
            <td>{application.academic_qual}</td>
          </tr>
          <tr>
            <td>Skills Relevant to the course</td>
            <td>{application.skills}</td>
          </tr>
          <tr>
            <td>Previous Training related to the similar course </td>
            <td>{application.previous_training}</td>
          </tr>

          <tr>
            <td>How did you hear about us?</td>
            <td>{application.reference}</td>
          </tr>

          <tr>
            <td colspan="2">
              <a
                id="view-aadhar-card"
                class="form-submit-btn inline-block"
                type="button"
                aria-label="View Aadhar Card"
                href="/images/examples/aadhar-card.pdf"
                download="/images/examples/aadhar-card.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aadhar Card
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <button onClick={() => route("/dashboard/applications")}>
        Back to Applications
      </button> */}
    </div>
  );
}
