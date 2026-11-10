import { SettingsIcon } from "../../components/ActionIcons";
import { ResumeBanner } from "./ResumeBanner";
import { TimeControlDropdown } from "./TimeControlDropdown";

export function DashboardPage() {
  return (
    <div id="dashboard-page" className="page">
      <div className="topbar">
        <button className="btn-icon" id="dashboard-settings-btn" title="Enter Code">
          <SettingsIcon />
        </button>
      </div>
      <div className="dashboard-content">
        <ResumeBanner />
        <h2 className="section-title">Kontrol Waktu</h2>
        <TimeControlDropdown />
        <button className="btn-primary btn-find-match" id="find-match-btn" disabled>Pilih kontrol waktu dulu</button>
      </div>
    </div>
  );
}
