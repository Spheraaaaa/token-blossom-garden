import { useId } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Tailwind size classes for the mark, e.g. "w-9 h-9" */
  markClassName?: string;
  /** Tailwind classes for the wordmark text */
  textClassName?: string;
  showText?: boolean;
}

// Rounded "P" with a stem that curls into a tail at the bottom-left.
const P_OUTER =
  "M18 6 H29 C37 6 42 12 42 19 C42 26 37 31 29 31 H22 V37 C22 41 19 44 14 45 V10 C14 7.8 15.8 6 18 6 Z";
const P_COUNTER =
  "M22 13 H29 C32 13 34.5 15.5 34.5 18.5 C34.5 21.5 32 24 29 24 H22 Z";

/**
 * PureNFT mark: a glossy "P" with a green → violet gradient,
 * a darker fold on the stem and a soft violet glow.
 */
export const BrandMark = ({ className }: { className?: string }) => {
  const id = useId().replace(/:/g, "");
  const grad = `pm-grad-${id}`;
  const fold = `pm-fold-${id}`;
  const shine = `pm-shine-${id}`;
  const glow = `pm-glow-${id}`;

  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="PureNFT">
      <defs>
        <linearGradient id={grad} x1="14" y1="6" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34E5A0" />
          <stop offset="0.55" stopColor="#3FB8C9" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id={fold} x1="14" y1="31" x2="22" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6D28D9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={shine} x1="28" y1="6" x2="28" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glow})`}>
        <path d={`${P_OUTER} ${P_COUNTER}`} fill={`url(#${grad})`} fillRule="evenodd" />
      </g>
      {/* Darker fold where the stem turns into the tail */}
      <path d="M14 31 H22 V37 C22 41 19 44 14 45 Z" fill={`url(#${fold})`} />
      {/* Glossy highlight across the top of the bowl */}
      <path
        d="M18 6 H29 C35 6 39.5 9.5 41.2 14 H14.4 V10 C14 7.8 15.8 6 18 6 Z"
        fill={`url(#${shine})`}
      />
    </svg>
  );
};

export const BrandLogo = ({
  className,
  markClassName = "w-8 h-8 md:w-9 md:h-9",
  textClassName = "text-lg md:text-xl",
  showText = true,
}: BrandLogoProps) => (
  <span className={cn("flex items-center gap-2", className)}>
    <BrandMark
      className={cn(
        markClassName,
        "shrink-0 drop-shadow-[0_0_10px_rgba(139,92,246,0.45)] transition-transform duration-200 group-hover:scale-105"
      )}
    />
    {showText && (
      <span className={cn("font-bold tracking-tight", textClassName)}>
        <span className="text-foreground">Pure</span>
        <span className="bg-gradient-to-r from-[#34E5A0] to-[#8B5CF6] bg-clip-text text-transparent">
          NFT
        </span>
      </span>
    )}
  </span>
);
