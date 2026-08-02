import "dotenv/config"
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import evaluationRoutes from "./routes/evaluation.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import ogRoutes from "./routes/og.routes.js"
import { Problem } from "./models/problem.model.js"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
app.use("/api/og", ogRoutes)

app.get("/api/sitemap.xml", async (req, res) => {
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

  try {
    const problems = await Problem.find({ isPublished: true }).select('slug category');
    
    const problemRoutes = problems.map(p => {
      const cat = p.category || 'general';
      const slug = p.slug || p._id;
      return `/problems/${cat}/${slug}`;
    });

    const allRoutes = [...staticRoutes, ...problemRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(route => {
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/problems/') && route !== '/problems' ? '0.9' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
})

// SSR Injection Route for Problem SEO
app.get("/problems/:category/:slug", async (req, res, next) => {
  const { slug, category } = req.params;
  
  try {
    let problem;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await Problem.findById(slug);
    } else {
      problem = await Problem.findOne({ slug });
    }

    if (!problem) {
      return next(); // Fallback to standard handling if not found
    }

    // Path to the built React index.html
    const indexPath = path.resolve(__dirname, "../../client/dist/index.html");
    
    if (!fs.existsSync(indexPath)) {
      // In dev mode or if build is missing, just send a simple HTML with meta tags
      // or fallback to next()
      return next(); 
    }

    let html = fs.readFileSync(indexPath, "utf8");

    const title = `${problem.title} – Practice ${category} Problem | Excode`;
    const description = `Solve ${problem.title}, a ${problem.level} ${category} problem. ${problem.real_world_context || 'Practice with real dev scenarios on Excode.'}`;
    const url = `https://excode.in/problems/${category}/${slug}`;
    const ogImage = `https://excode.in/api/og/problems/${slug}`;

    const seoTags = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <link rel="canonical" href="${url}" />

      <!-- Open Graph -->
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:type" content="article" />
      <meta property="og:image" content="${ogImage}" />

      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${ogImage}" />

      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "${problem.title}",
        "description": "${problem.real_world_context || description}",
        "educationalLevel": "${problem.level}",
        "learningResourceType": "Coding Exercise",
        "about": {
          "@type": "Thing",
          "name": "${category}"
        },
        "provider": {
          "@type": "Organization",
          "name": "Excode",
          "url": "https://excode.in"
        }
      }
      </script>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://excode.in" },
          { "@type": "ListItem", "position": 2, "name": "Problems", "item": "https://excode.in/problems" },
          { "@type": "ListItem", "position": 3, "name": "${category}", "item": "https://excode.in/problems/${category}" },
          { "@type": "ListItem", "position": 4, "name": "${problem.title}", "item": "${url}" }
        ]
      }
      </script>
    `;

    // Replace the existing title/meta or inject into head
    html = html.replace(/<title>.*?<\/title>/i, '');
    html = html.replace('</head>', `${seoTags}</head>`);

    res.send(html);

  } catch (error) {
    console.error("SSR Injection Error:", error);
    next();
  }
})

app.get("/", (req, res) => {
    res.json("Hello World")
})

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT)
})