import { AdminPanelSection } from "./AdminPanelSection";

export function DashboardSettingsModal() {
  return (
    <div className="dashboard-settings-overlay hidden" id="dashboard-settings-modal">
      <div className="dashboard-settings-box" role="dialog" aria-modal="true" aria-labelledby="dashboard-settings-title-gate" tabIndex={-1}>
        <h3 id="dashboard-settings-title-gate">Enter Code</h3>
        <h3 id="dashboard-settings-title-admin" className="hidden">Pengaturan Admin</h3>
        <div id="admin-unlock-section">
          <label className="admin-field-label" htmlFor="admin-code-input">Kode</label>
          <input
            type="password"
            id="admin-code-input"
            className="admin-text-input"
            placeholder="Masukkan kode akses"
            autoComplete="off"
          />
          <p className="admin-error-text hidden" id="admin-unlock-error" />
          <button type="button" className="btn-primary admin-full-btn" id="admin-unlock-btn">Gunakan Kode</button>
        </div>
        <AdminPanelSection />
        <button type="button" className="option-item option-item-close" id="dashboard-settings-close-btn">
          Tutup
        </button>
      </div>
    </div>
  );
}
