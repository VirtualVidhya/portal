import { h } from "preact";
import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

const ApplicationContext = createContext();

/**
 * ApplicationProvider accepts an initialApplications prop and stores it
 * in state. It provides the applications and a setter via context.
 */
export function ApplicationProvider({ initialApplications, children }) {
  let parsedData = [];
  if (typeof initialApplications === "string") {
    try {
      parsedData = JSON.parse(initialApplications) || [];
    } catch (e) {
      console.error("Error parsing initialApplications:", e);
      parsedData = [];
    }
  } else {
    parsedData = initialApplications || [];
  }

  const [applications, setApplications] = useState(parsedData);
  // console.log("ApplicationProvider initial applications:", applications);
  return (
    <ApplicationContext.Provider value={{ applications, setApplications }}>
      {children}
    </ApplicationContext.Provider>
  );
}

/**
 * useApplications hook for accessing the applications context.
 */
export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplications must be used within an ApplicationProvider"
    );
  }
  return context;
}
