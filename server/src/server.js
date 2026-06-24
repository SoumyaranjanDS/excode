import "dotenv/config"
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import evaluationRoutes from "./routes/evaluation.routes.js"
import submissionRoutes from "./routes/submission.routes.js"

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/evaluate", evaluationRoutes)
app.use("/api/submissions", submissionRoutes)

app.get("/", (req, res) => {
    res.json("Hello World")
})

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT)
})