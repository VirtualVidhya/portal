import { h } from "preact";
import ApplicationsTable from "./ApplicationsTable.jsx";

export default function AllApplicationsPage() {
  return (
    <div class="app-data-container">
      <table class="app-data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Course</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <ApplicationsTable />
        </tbody>
      </table>
    </div>
  );
}
