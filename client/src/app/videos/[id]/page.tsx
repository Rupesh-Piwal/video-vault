import VideoPage from "../video-page";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap on server
  return <VideoPage videoId={id} />;
}
