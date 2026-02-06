import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { PlusIcon, Upload } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <div className="relative mx-auto flex w-full max-w-[320px] md:max-w-3xl flex-col justify-between gap-y-4 border-y px-4 py-8 dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)]">
      <PlusIcon
        className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6"
        strokeWidth={1}
      />

      <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l" />
      <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r" />

      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed" />

      <h2 className="text-center font-bold text-[36px] md:text-[66px] leading-tight tracking-tighter">
        Video storage & sharing vault
      </h2>
      <p className="text-balance text-center font-medium text-muted-foreground text-sm md:text-[22px] text-[15px] space-y-1 tracking-wider">
        <span> Upload videos and </span>
        <Highlighter action="highlight" color="#4E4F4E">
          <span className="text-white">generate thumbnails</span>
        </Highlighter>
      </p>

      <div className="flex items-center justify-center gap-2">
        <Link
          href="/dashboard"
          className="cursor-pointer bg-white text-black px-6 py-1.5 md:px-8 md:py-1.5 text-sm md:text-lg font-thin rounded-md inline-flex items-center gap-2 hover:bg-gray-200 transition"
        >
          <Upload height={17} width={17} />
          Upload Video
        </Link>
      </div>
    </div>
  );
}
