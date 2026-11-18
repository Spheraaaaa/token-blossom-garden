import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, CheckCircle2 } from "lucide-react";

const trustBadges = [
  { icon: Shield, text: "Escrow Protection" },
  { icon: CheckCircle2, text: "Verified Creators" },
  { icon: Star, text: "Trusted Platform" },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "$100M+", label: "Trading Volume" },
  { value: "1M+", label: "NFTs Created" },
];

/** Staggered entrance delay for the hero's single motion moment. */
const rise = (step: number) => ({ animationDelay: `${80 + step * 90}ms` });

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient light: violet from above, green from the lower right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(263 84% 74% / 0.16), transparent 70%), radial-gradient(70% 45% at 50% 115%, hsl(142 76% 36% / 0.12), transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="hero-rise font-display text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.035em]"
            style={rise(0)}
          >
            <span className="block text-foreground">Buy &amp; Sell</span>
            <span className="block text-primary">Digital NFTs</span>
          </h1>

          <p
            className="hero-rise mx-auto mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground"
            style={rise(1)}
          >
            The most trusted NFT marketplace with verified creators,
            <span className="font-semibold text-foreground"> low fees</span>, and
            <span className="font-semibold text-foreground"> secure transactions</span>.
          </p>

          <ul
            className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            style={rise(2)}
          >
            {trustBadges.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="hero-rise mt-10 flex justify-center" style={rise(3)}>
            <Link
              to="/marketplace"
              className="btn-brand group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold"
            >
              Explore Marketplace
              <ArrowRight
                className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <dl
          className="hero-rise mx-auto mt-20 grid max-w-3xl grid-cols-3 divide-x divide-border/70 border-y border-border/70"
          style={rise(4)}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse px-2 py-6 text-center">
              <dt className="mt-1.5 text-xs sm:text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tabular-nums text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
