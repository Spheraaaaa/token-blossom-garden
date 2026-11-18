import { Shield, Award, CheckCircle2, BadgeCheck, Lock } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Trading",
    description: "Advanced blockchain security and escrow system protects every transaction",
  },
  {
    icon: Award,
    title: "Verified Artists",
    description: "All creators are thoroughly vetted to ensure authentic, high-quality NFTs",
  },
  {
    icon: CheckCircle2,
    title: "100% Ownership",
    description: "Full digital rights and provable ownership of all purchased collectibles",
  },
  {
    icon: BadgeCheck,
    title: "Authenticity Guaranteed",
    description: "Every NFT is verified with blockchain certification of authenticity",
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Your personal information is always secure and never shared",
  },
];

export const TrustIndicators = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Secure &amp; Trusted
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Your security and trust are our highest priorities
          </p>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {trustFeatures.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5 py-6">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-inset ring-primary/20">
                <Icon className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-1 leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
