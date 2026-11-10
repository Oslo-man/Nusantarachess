import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { LibraryMain } from "./LibraryMain";

export function LibraryPage() {
  return (
    <>
      <AuthGateOverlay />
      <LibraryMain />
    </>
  );
}
