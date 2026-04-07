import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// ── Types ───────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  title: string;
  slug: string;
  date: string;
  description: string;
  author: string;
  tags: string[];
  category: string;
  draft: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string; // rendered HTML
}

// ── Config ──────────────────────────────────────────────────────────────────

const GITHUB_OWNER = process.env.GITHUB_BLOG_OWNER ?? "brandonsgitstub";
const GITHUB_REPO = process.env.GITHUB_BLOG_REPO ?? "Yapformapp";
const GITHUB_PATH = process.env.GITHUB_BLOG_PATH ?? "content/blog";
const GITHUB_BRANCH = process.env.GITHUB_BLOG_BRANCH ?? "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

const API_BASE = "https://api.github.com";

// ── GitHub API helpers ──────────────────────────────────────────────────────

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "yapform-blog",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
  type: string;
}

async function listMarkdownFiles(): Promise<GitHubFile[]> {
  const url = `${API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${GITHUB_BRANCH}`;
  const files: GitHubFile[] = await githubFetch(url);
  return files.filter((f) => f.name.endsWith(".md") && f.type === "file");
}

async function fetchFileContent(downloadUrl: string): Promise<string> {
  const res = await fetch(downloadUrl, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status}`);
  }
  return res.text();
}

// ── Markdown processing ─────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { meta: BlogPostMeta; body: string } {
  const { data, content } = matter(raw);
  return {
    meta: {
      title: data.title ?? "",
      slug: data.slug ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
      author: data.author ?? "Yapform",
      tags: data.tags ?? [],
      category: data.category ?? "",
      draft: data.draft ?? false,
    },
    body: content,
  };
}

async function renderMarkdown(markdown: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns all published blog posts sorted by date (newest first).
 * Only includes frontmatter metadata, not rendered content.
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const files = await listMarkdownFiles();

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fetchFileContent(file.download_url);
      const { meta } = parseFrontmatter(raw);
      return meta;
    })
  );

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns a single blog post by slug with rendered HTML content.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const files = await listMarkdownFiles();

  for (const file of files) {
    const raw = await fetchFileContent(file.download_url);
    const { meta, body } = parseFrontmatter(raw);

    // Match by frontmatter slug or filename
    const fileSlug = file.name.replace(/\.md$/, "");
    if (meta.slug === slug || fileSlug === slug) {
      if (meta.draft) return null;
      const content = await renderMarkdown(body);
      return { ...meta, slug: meta.slug || fileSlug, content };
    }
  }

  return null;
}

/**
 * Returns all post slugs for static generation.
 */
export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
