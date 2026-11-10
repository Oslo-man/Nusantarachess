import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { ProfileMain } from "./ProfileMain";

export function ProfilePage() {
  return (
    <>
      <AuthGateOverlay />
      <ProfileMain />
    </>
  );
}
