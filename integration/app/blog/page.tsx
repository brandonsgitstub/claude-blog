import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Yapform",
  description:
    "Guides on quiz marketing, lead generation, zero-party data, and conversion optimization.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Blog</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts published yet.</p>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-6">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-2xl font-semibold group-hover:text-blue-600">
                {post.title}
              </h2>
            </Link>

            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>&middot;</span>
              <span>{post.author}</span>
            </div>

            <p className="mt-2 text-gray-600">{post.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
