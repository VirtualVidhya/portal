import { h } from "preact";
import { ApplicationProvider } from "./ApplicationContext.jsx";
import ApplicationsTable from "./ApplicationsTable.jsx";

export default function DashboardApplications({ initialApplications }) {
  return (
    <ApplicationProvider initialApplications={initialApplications}>
      <div class="app-data-container">
        <table class="app-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Course</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <ApplicationsTable />
          </tbody>
        </table>
      </div>
    </ApplicationProvider>
  );
}
