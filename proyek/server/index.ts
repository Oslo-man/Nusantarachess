"use strict";
require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");

const db = require("./lib/db");
const security = require("./lib/security");
const authRoutes = require("./routes/auth");
const matchRoutes = require("./routes/match");
const practiceRoutes = require("./routes/practice");
const puzzleRoutes = require("./routes/puzzle");
const reviewRoutes = require("./routes/review");
const profileRoutes = require("./routes/profile");
const leaderboardRoutes = require("./routes/leaderboard");
const lessonsRoutes = require("./routes/lessons");
const adminRoutes = require("./routes/admin");
const publicRoutes = require("./routes/public");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(security.securityHeaders);
app.use(cors(security.corsOptions()));
app.use(security.apiLimiter);
app.use(security.originGuard);
app.use(security.jsonContentGuard);
app.use(express.json({ limit: "256kb", strict: true }));

app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/puzzle", puzzleRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (req: SrvReq, res: SrvRes) => {
  res.json({ ok: true, service: "nusantarachess-server", stockfish: "client-side-only" });
});

app.use(security.notFound);
app.use(security.errorHandler);

security.warnInsecureConfig();

if (process.env.VERCEL) {
  db.ensureSchema().catch((err: any) => {
    console.error("[server] Gagal menyiapkan skema database:", err.message);
  });
} else {
  const httpServer = http.createServer(app);

  db.ensureSchema()
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`NusantaraChess server berjalan di http://localhost:${PORT}`);
        console.log("Stockfish TIDAK berjalan di server ini - tetap 100% di client (browser pemain).");
      });
    })
    .catch((err: any) => {
      console.error("[server] Gagal menyiapkan skema database, server tidak dijalankan:", err.message);
      process.exit(1);
    });
}

module.exports = app;
