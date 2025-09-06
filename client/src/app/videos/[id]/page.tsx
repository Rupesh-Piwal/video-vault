import { createClient } from "@/supabase/client";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient(); // ✅ get the client instance

  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: thumbnails } = await supabase
    .from("thumbnails")
    .select("*")
    .eq("video_id", params.id);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{video?.title}</h1>
      <video controls src={video?.url} className="w-full max-w-lg" />
      <h2 className="mt-4 font-semibold">Thumbnails</h2>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {thumbnails?.map((t) => (
          <img
            key={t.id}
            src={`https://your-s3-bucket.s3.amazonaws.com/${t.storage_key}`}
            className="rounded"
          />
        ))}
      </div>
    </div>
  );
}
