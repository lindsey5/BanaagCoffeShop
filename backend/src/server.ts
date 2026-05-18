import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import dns from "node:dns/promises";

import authRoutes from "./routes/authRoutes";
import roleRoutes from "./routes/roleRoutes";
import inventoryItemRoutes from "./routes/inventoryItemRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import menuRoutes from "./routes/menuRoutes";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 3000;
const origin = process.env.ORIGIN || "http://localhost:5173";

app.use(cors({
  origin,
  methods: ["*"],
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => res.send("Hi"));

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/inventory-items", inventoryItemRoutes);
app.use('/api/menus', menuRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();