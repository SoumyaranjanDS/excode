export function parseFrontmatter(markdownContent) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: markdownContent };
  }

  const frontmatterString = match[1];
  const content = match[2];

  const data = {};
  const lines = frontmatterString.split('\n');
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove surrounding quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, content };
}

// Helper to fetch all articles using Vite's import.meta.glob
export async function getAllArticles() {
  const modules = import.meta.glob('../content/articles/*.md', { query: '?raw', import: 'default' });
  const articles = [];

  for (const path in modules) {
    const content = await modules[path]();
    const { data } = parseFrontmatter(content);
    
    // Extract slug from filename (e.g., ../content/articles/my-post.md -> my-post)
    const slug = path.split('/').pop().replace('.md', '');
    
    articles.push({
      slug,
      ...data,
    });
  }

  // Sort by date descending
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getArticleBySlug(targetSlug) {
  const modules = import.meta.glob('../content/articles/*.md', { query: '?raw', import: 'default' });
  
  for (const path in modules) {
    const slug = path.split('/').pop().replace('.md', '');
    if (slug === targetSlug) {
      const content = await modules[path]();
      return parseFrontmatter(content);
    }
  }
  
  return null;
}
