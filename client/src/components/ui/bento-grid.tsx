import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      "bg-glass-bg backdrop-blur-md border border-glass-border hover:border-neon-purple/50 transition-all duration-300",
      className
    )}
    {...props}
  >
    {/* Hover Glow Effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/0 to-electric-blue/0 group-hover:from-neon-purple/10 group-hover:to-electric-blue/10 transition-all duration-300" />
    
    <div>{background}</div>
    
    <div className="relative z-10 p-8">
      <div className="pointer-events-none flex transform-gpu flex-col gap-4 transition-all duration-300 lg:group-hover:-translate-y-6">
        {/* Icon with gradient background */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-purple to-deep-purple flex items-center justify-center shadow-lg shadow-neon-purple/50 group-hover:shadow-neon-purple/70 transition-shadow">
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {name}
          </h3>
          <p className="text-sm text-text-gray-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Mobile CTA - Always visible */}
      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center mt-4 transition-all duration-300 lg:hidden"
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0 text-neon-purple hover:text-electric-blue"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    {/* Desktop CTA - Appears on hover */}
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="pointer-events-auto p-0 text-neon-purple hover:text-electric-blue"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>
  </div>
)

export { BentoCard, BentoGrid }
