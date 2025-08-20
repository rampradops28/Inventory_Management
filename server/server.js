import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import rbacRoutes from "./routes/rbac.routes.js";
import adminRbacRoutes from "./routes/admin.rbac.routes.js";
import assetsRoutes from "./routes/assets.routes.js";
import purchasesRoutes from "./routes/purchases.routes.js";
import transfersRoutes from "./routes/transfers.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rbac", rbacRoutes);
app.use("/api/admin-rbac", adminRbacRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/purchases", purchasesRoutes);
app.use("/api/transfers", transfersRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
