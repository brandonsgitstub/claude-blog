# Yapform Blog Integration (GitHub-as-CMS)

Publish blog posts from `claude-blog` to your Yapform Next.js app without redeploying. Posts are fetched from GitHub at runtime via the Contents API with ISR caching.

## How It Works

1. You write blog posts as markdown files in `claude-blog/content/`
2. The sync workflow pushes them to `Yapformapp/content/blog/`
3. Your Next.js app fetches posts from GitHub at runtime (no rebuild)
4. On-demand revalidation makes new posts live instantly

## Setup

### 1. Install Dependencies

```bash
npm install gray-matter remark remark-html
```

### 2. Copy Files to Your Yapform Project

```
integration/lib/blog.ts         → src/lib/blog.ts (or lib/blog.ts)
integration/app/blog/page.tsx   → app/blog/page.tsx
integration/app/blog/[slug]/page.tsx → app/blog/[slug]/page.tsx
integration/app/api/revalidate/route.ts → app/api/revalidate/route.ts
```

Adjust import paths (`@/lib/blog`) if your project uses a different alias.

### 3. Set Environment Variables

Add these to your Replit Secrets (or `.env.local`):

```
GITHUB_TOKEN=ghp_your_personal_access_token
REVALIDATION_SECRET=any_random_string_you_choose
```

Optional overrides (defaults match your setup):

```
GITHUB_BLOG_OWNER=brandonsgitstub
GITHUB_BLOG_REPO=Yapformapp
GITHUB_BLOG_PATH=content/blog
GITHUB_BLOG_BRANCH=main
```

### 4. Add Revalidation Secret to claude-blog Repo

Go to `claude-blog` repo → Settings → Secrets → Actions → Add:

- Name: `REVALIDATION_SECRET`
- Value: same string you set in step 3

This lets the sync workflow trigger revalidation after pushing content.

### 5. Test Locally

```bash
npm run dev
# Visit http://localhost:3000/blog
```

## Publishing Flow

```
Write post in claude-blog/content/
       ↓
Push to main (or merge PR)
       ↓
GitHub Actions syncs to Yapformapp/content/blog/
       ↓
Workflow triggers /api/revalidate on yapform.app
       ↓
Blog post is live (no Replit redeploy)
```

## Customization

### Styling

The blog pages use Tailwind CSS classes. If your app uses a different styling approach, update the JSX in `page.tsx` and `[slug]/page.tsx`.

The post content uses `prose` classes from `@tailwindcss/typography`. Install it if not already present:

```bash
npm install @tailwindcss/typography
```

Add to your Tailwind config:

```js
plugins: [require("@tailwindcss/typography")]
```

### Existing Blog Page

If your `/blog` route already exists, merge the data-fetching logic from `page.tsx` into your existing component rather than replacing it. The key import is:

```typescript
import { getAllPosts } from "@/lib/blog";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
```

### Cache Behavior

- ISR revalidates every 60 seconds by default (`export const revalidate = 60`)
- On-demand revalidation via `/api/revalidate` makes new posts live instantly
- Change the revalidation interval by editing the `revalidate` export in page files
