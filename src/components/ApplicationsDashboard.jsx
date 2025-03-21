import { h } from "preact";
import Router from "preact-router";
import AllApplicationsPage from "./AllApplicationsPage.jsx";
import IndApplicationPage from "./IndApplicationPage.jsx";
import { ApplicationProvider } from "./ApplicationContext.jsx";

// This component wraps dashboard routes in the ApplicationProvider so that both the table and detail pages share the same data.
export default function ApplicationsDashboard({ initialApplications }) {
  return (
    <ApplicationProvider initialApplications={initialApplications}>
      <Router>
        {/* The default route shows the applications table */}
        <AllApplicationsPage path="/dashboard/applications" default />
        {/* Route for individual application details */}
        <IndApplicationPage path="/dashboard/applications/:id" />
      </Router>
    </ApplicationProvider>
  );
}
