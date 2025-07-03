import { useEffect } from "react";

export const useWarnIfUnsavedChanges = (
  unsavedChanges: boolean,
  callback: () => void
) => {
  useEffect(() => {
    const checkForUnsavedData = (event: Event) => {
      console.log("changing route");
      if (unsavedChanges) {
        callback();
        // you can use your logic to check any unsaved data
        event.preventDefault();
        // legacy browser support
        event.returnValue = true;
      }
    };
    window.addEventListener("beforeunload", checkForUnsavedData);
    window.addEventListener("popstate", checkForUnsavedData);

    return () => {
      window.removeEventListener("beforeunload", checkForUnsavedData);
      window.removeEventListener("popstate", checkForUnsavedData);
    };
  }, [unsavedChanges, callback]);
};
