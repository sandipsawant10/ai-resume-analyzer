import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

import userRouter from "./src/routes/user.route.js";
import resumeRoutes from "./src/routes/resume.route.js";

app.use("/resume", resumeRoutes);
app.use("/auth", userRouter);

export default app;
