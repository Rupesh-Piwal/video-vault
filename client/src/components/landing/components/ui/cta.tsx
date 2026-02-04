import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusIcon, Upload } from "lucide-react";

export function CallToAction() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-4 border-y px-4 py-8 dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)]">
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

      <h2 className="text-center font-semibold text-3xl md:text-[72px] leading-tight">
        Video storage and sharing vault
      </h2>
      <p className="text-balance text-center font-medium text-muted-foreground text-sm md:text-[18px]">
        Upload large videos, process them in the background, <br /> and share
        secure public or private links.
      </p>

      <div className="flex items-center justify-center gap-2">
        <Button className="cursor-pointer bg-white text-black px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-thin rounded-md inline-flex items-center gap-2 hover:bg-gray-200 transition">
          <Upload height={5} width={5} />
          Upload Video
        </Button>
      </div>
    </div>
  );
}
