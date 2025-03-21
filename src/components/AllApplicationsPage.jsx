import { h } from "preact";
import ApplicationsTable from "./ApplicationsTable.jsx";

export default function AllApplicationsPage() {
  return (
    <section class="flex flex-col items-center justify-center gap-3 max-w-mdsm md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl">
      <h2 class="text-center text-font-color-sec text-[34px] md:text-5xl font-extrabold mb-10">
        Applications
      </h2>

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
    </section>
  );
}
