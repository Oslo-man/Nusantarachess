export function Name({ id, side }: { id: string; side: "w" | "b" }) {
  return (
    <div className="bc-name" id={id} data-side={side}>
      <div className="pb-avatar">
        <svg className="avatar-default-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="12" cy="8" r="4.2" />
          <path d="M3.8 21.2c0-4.5 3.7-8.1 8.2-8.1s8.2 3.6 8.2 8.1z" />
        </svg>
      </div>
      <div className="pb-text">
        <span className="pb-name">{side === "w" ? "Putih" : "Hitam"}</span>
        <span className="pb-meta" />
      </div>
    </div>
  );
}
