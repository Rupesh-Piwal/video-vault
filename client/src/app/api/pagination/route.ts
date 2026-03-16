import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function fetchVideos(
  search: string,
  cursor: string | null,
  limit: number,
) {
  const supabase = await createClient();

  let query = supabase.from("videos").select("*");

  if (search) {
    query = query.ilike("original_filename", `%${search}%`);
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  query = query.order("created_at", { ascending: false });

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const nextCursor =
    data.length === limit ? data[data.length - 1].created_at : null;

  return {
    videos: data,
    nextCursor,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);

  try {
    const result = await fetchVideos(search, cursor, limit);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}
