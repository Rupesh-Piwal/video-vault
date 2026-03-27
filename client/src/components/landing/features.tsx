import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Video, Zap, Link as LinkIcon, CloudUpload } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="bg-white pt-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl flex flex-col items-center text-center">
        {/* Tag */}
        <div className="relative mb-8 inline-flex items-center gap-2 px-3 py-1.5 border border-black/5 bg-black/5 font-mono font-thin text-xs text-black">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
          </span>
          FEATURES
          {/* Top Left */}
          <span className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-black/15" />
          {/* Top Right */}
          <span className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-black/15" />
          {/* Bottom Left */}
          <span className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-black/15" />
          {/* Bottom Right */}
          <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-black/15" />
        </div>

        {/* Headline */}
        <h2 className="text-[32px] sm:text-4xl lg:text-[42px] font-medium tracking-tight text-black mb-16 leading-[1.15] max-w-2xl">
          Built for <span className="text-[#a1a1aa]">performance</span> and
          <span className="text-[#a1a1aa]">{" "}scale</span>
        </h2>

        <div className="relative w-full text-left">
          <div className="relative border border-gray-100 bg-gray-50/50 rounded-xl p-3 z-10 grid grid-cols-6 gap-3">

            {/* Card 1: 100% Reliable Uploads */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-white shadow-sm border-gray-100 p-2">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <div className="relative flex h-24 w-56 items-center justify-center">
                  <CloudUpload className="absolute inset-0 size-20 m-auto text-gray-100/80" />
                  <span className="mx-auto block w-fit text-5xl font-bold tracking-tighter text-gray-900 z-10">
                    100%
                  </span>
                </div>
                <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
                  Reliable Uploads
                </h2>
                <p className="mt-2 text-center text-sm font-medium text-gray-500">
                  Automatic resumable parallel chunks guarantee your video uploads complete safely.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Automated Thumbnails */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white shadow-sm border-gray-100 p-2">
              <CardContent className="pt-6">
                <div className="relative mx-auto flex aspect-square size-32 items-center justify-center rounded-full border border-gray-100 bg-gray-50 before:absolute before:-inset-2 before:rounded-full before:border before:border-gray-50">
                  <Video strokeWidth={1.5} className="size-12 text-[#1DE9B6]" />
                </div>
                <div className="relative z-10 mt-10 space-y-2 text-center">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900">
                    Automated Thumbnails
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    Background workers silently extract high-res thumbnails while you focus on the assets.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Blazing Fast Speeds */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white shadow-sm border-gray-100 p-2">
              <CardContent className="pt-6">
                <div className="pt-6 lg:px-6 flex items-center justify-center h-[120px]">
                  <div className="w-full max-w-[200px] flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-[#1DE9B6] to-cyan-500 rounded-full animate-pulse opacity-80" />
                    </div>
                    <Zap className="size-8 text-[#1DE9B6]" fill="currentColor" />
                  </div>
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900">
                    Blazing Fast Speeds
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    Experience wire-speed continuous uploads pushing directly into robust S3 object storage.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Secure Shareable Links */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white shadow-sm border-gray-100 p-2">
              <CardContent className="grid pt-6 sm:grid-cols-2 gap-8">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 before:absolute before:-inset-2 before:rounded-full before:border before:border-gray-50">
                    <Shield className="size-5 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold tracking-tight text-gray-900">
                      Secure Shareable Links
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                      Generate granular, time-expiring URLs with public or private access control for any video.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl relative -mb-6 -mr-6 mt-6 h-fit border border-gray-100 p-6 py-6 sm:ml-6 bg-gray-50/50 flex flex-col justify-center items-center overflow-hidden">
                  <div className="absolute left-3 top-3 flex gap-1.5 opacity-50">
                    <span className="block size-2 rounded-full bg-gray-300"></span>
                    <span className="block size-2 rounded-full bg-gray-300"></span>
                  </div>
                  <LinkIcon className="size-24 text-gray-200 mt-6 rotate-45 transform" strokeWidth={1.5} />
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Team Collaboration */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white shadow-sm border-gray-100 p-2">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2 gap-8">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 before:absolute before:-inset-2 before:rounded-full before:border before:border-gray-50">
                    <Users className="size-5 text-gray-900" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold tracking-tight text-gray-900">
                      Built for Teams
                    </h2>
                    <p className="text-sm font-medium text-gray-500">
                      Share assets directly with your team and centralize video approvals in a unified inbox.
                    </p>
                  </div>
                </div>
                <div className="before:bg-gray-200 relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-0.5 sm:-my-6 sm:-mr-6">
                  <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-3 pr-2">
                      <span className="block h-fit rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 bg-white shadow-sm">
                        Client
                      </span>
                      <div className="ring-white size-8 ring-4 bg-gray-100 rounded-full shadow-sm z-10 flex-shrink-0">
                        <img
                          className="size-full rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
                          alt="Client Avatar"
                        />
                      </div>
                    </div>
                    <div className="relative ml-[calc(50%-1rem)] flex items-center gap-3 pl-2">
                      <div className="ring-white size-9 ring-4 bg-gray-100 rounded-full shadow-sm z-10 flex-shrink-0">
                        <img
                          className="size-full rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
                          alt="Reviewer Avatar"
                        />
                      </div>
                      <span className="block h-fit rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 bg-white shadow-sm">
                        Reviewer
                      </span>
                    </div>
                    <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-3 pr-2">
                      <span className="block h-fit rounded-md border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 bg-white shadow-sm">
                        Editor
                      </span>
                      <div className="ring-white size-8 ring-4 bg-gray-100 rounded-full shadow-sm z-10 flex-shrink-0">
                        <img
                          className="size-full rounded-full object-cover"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                          alt="Editor Avatar"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
