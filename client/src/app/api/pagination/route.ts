import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function fetchVideos(
  search: string,
  cursor: { created_at: string; id: string } | null,
  limit: number,
) {
  const supabase = await createClient();

  let query = supabase.from("videos").select("*");

  if (search) {
    query = query.ilike("original_filename", `%${search}%`);
  }

  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`,
    );
  }

  query = query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const nextCursor =
    data.length === limit
      ? {
          created_at: data[data.length - 1].created_at,
          id: data[data.length - 1].id,
        }
      : null;

  return {
    videos: data,
    nextCursor,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const cursorParam = searchParams.get("cursor");

  let cursor = null;
  try {
    cursor = cursorParam ? JSON.parse(cursorParam) : null;
  } catch {
    cursor = null;
  }

  const limit = Number(searchParams.get("limit") || 10);

  try {
    const result = await fetchVideos(search, cursor, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
