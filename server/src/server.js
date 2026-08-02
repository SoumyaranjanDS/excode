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
const frontendUrl = process.env.FRONTEND_URL?.endsWith('/') 
  ? process.env.FRONTEND_URL.slice(0, -1) 
  : process.env.FRONTEND_URL;

const allowedOrigins = [
  frontendUrl,
  frontendUrl?.includes('https://www.') ? frontendUrl.replace('https://www.', 'https://') : frontendUrl?.replace('https://', 'https://www.'),
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(express.json())

const PORT = process.env.PORT || 3000

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/evaluate", evaluationRoutes)
app.use("/api/submissions", submissionRoutes)

app.get("/api/sitemap.xml", (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || "https://excode.in";
  
  // Core static routes for indexing
  const staticRoutes = [
    "/",
    "/problems",
    "/why",
    "/feture",
    "/login",
    "/signup"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(route => {
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
})

app.get("/", (req, res) => {
    res.json("Hello World")
})

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT)
})