import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/blog", "page");
  revalidatePath("/blog/[slug]", "page");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
