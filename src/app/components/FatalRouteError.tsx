interface FatalRouteErrorProps {
  message: string;
}

export function FatalRouteError({ message }: FatalRouteErrorProps) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif", color: "#e8e4d9" }}>
      <h2 style={{ marginBottom: "12px" }}>Gagal memuat halaman</h2>
      <p style={{ color: "#a09880", marginBottom: "20px" }}>{message}</p>
      <button
        type="button"
        onClick={() => location.reload()}
        style={{
          padding: "10px 24px",
          background: "#73AA4A",
          border: "none",
          borderRadius: "4px",
          color: "#1a1a1a",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        Muat ulang
      </button>
    </div>
  );
}
