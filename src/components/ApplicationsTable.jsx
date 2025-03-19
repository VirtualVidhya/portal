import { h } from "preact";
import { useApplications } from "./ApplicationContext";

export default function ApplicationsTable() {
  const { applications } = useApplications();

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
            <a href={`/dashboard/application/${app.id}`}>
              <button
                title="View Full Application"
                aria-label="View Full Application"
              >
                View
              </button>
            </a>
          </td>
        </tr>
      ))}
    </>
  );
}
