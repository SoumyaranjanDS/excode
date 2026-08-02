import express from 'express';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { Problem } from '../models/problem.model.js';

const router = express.Router();

let fontCache = null;

// Helper to fetch Inter font as ArrayBuffer
async function getFont() {
  if (fontCache) return fontCache;
  const res = await fetch('https://unpkg.com/@fontsource/inter/files/inter-latin-700-normal.woff');
  const buffer = await res.arrayBuffer();
  fontCache = buffer;
  return buffer;
}

router.get('/problems/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let problem;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await Problem.findById(slug);
    } else {
      problem = await Problem.findOne({ slug });
    }

    if (!problem) {
      return res.status(404).send('Problem not found');
    }

    const title = problem.title;
    const category = problem.category || problem.type?.toLowerCase() || 'general';
    const difficulty = problem.level;
    const difficultyColor = problem.level === 'Easy' ? '#4ade80' : problem.level === 'Medium' ? '#fbbf24' : '#f87171';

    const fontData = await getFont();

    const difficultyStyle = `
      display: flex;
      padding: 10px 20px;
      background-color: rgba(74, 222, 128, 0.1);
      border: 2px solid ${difficultyColor};
      color: ${difficultyColor};
      border-radius: 10px;
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
    `;

    const markup = html`
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: #0f131c;
          color: #ffffff;
          width: 1200px;
          height: 630px;
          padding: 80px;
          font-family: Inter;
          border-top: 20px solid #adc6ff;
        "
      >
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
          <div style="${difficultyStyle}">
            ${difficulty}
          </div>
          <div style="
            display: flex;
            padding: 10px 20px;
            background-color: rgba(173, 198, 255, 0.1);
            border: 2px solid rgba(173, 198, 255, 0.3);
            color: #adc6ff;
            border-radius: 10px;
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
          ">
            ${category}
          </div>
        </div>
        
        <h1 style="
          font-size: 84px;
          font-weight: 800;
          margin: 0 0 30px 0;
          line-height: 1.2;
        ">
          ${title}
        </h1>
        
        <div style="display: flex; margin-top: auto; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; font-size: 32px; color: #8c909f; font-weight: 600;">
            Practice on Excode.in
          </div>
        </div>
      </div>
    `;

    const svg = await satori(markup, {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    const resvg = new Resvg(svg, {
      background: '#0f131c',
      fitTo: {
        mode: 'width',
        value: 1200
      }
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(pngBuffer);
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    res.status(500).send('Error generating image');
  }
});

export default router;
