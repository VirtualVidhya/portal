import { h } from "preact";
import { useApplications } from "./ApplicationContext";

export default function ApplicationsTable() {
  const { applications } = useApplications();

  // console.log("ApplicationsTable applications:", applications);

  if (!applications || applications.length === 0) {
    return (
      <tr className="text-center">
        <td colSpan="6">No applications found.</td>
      </tr>
    );
  }

  return (
    <>
      {applications.map((app) => (
        <tr key={app.id}>
          <td>{app.full_name}</td>
          <td>{app.email}</td>
          <td>{app.contact_no}</td>
          <td>{app.course}</td>
          <td>{app.status}</td>
          <td>
            <a
              href={`/dashboard/applications/${app.id}`}
              id="view-more-btn"
              class="view-more-btn"
              title="View Full Application"
              aria-label="View Full Application"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="util-icon"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="50"
                aria-hidden="true"
              >
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
              </svg>
            </a>
          </td>
        </tr>
      ))}
    </>
  );
}
