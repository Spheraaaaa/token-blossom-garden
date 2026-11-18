import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up and set up your profile to begin your NFT journey with PureNFT.",
  },
  {
    title: "Create Wallet",
    description: "Create your crypto wallet to securely buy, sell and manage your digital assets.",
  },
  {
    title: "Discover NFTs",
    description: "Browse through our curated collection of unique digital assets from top creators.",
  },
  {
    title: "Make Transactions",
    description: "Buy, sell, or trade NFTs with confidence using our secure blockchain technology.",
  },
  {
    title: "Manage Portfolio",
    description: "Track your digital asset performance and manage your growing NFT collection.",
  },
  {
    title: "Connect & Earn",
    description: "Join our community, connect with other collectors, and earn rewards.",
  },
];

export const HowItWorksSection = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Simple Process
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with NFTs in just a few simple steps
          </p>
        </div>
        <Link
          to="/register"
          className="btn-brand group inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Get Started Today
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-border pt-6">
            <span className="font-display text-sm font-semibold tabular-nums text-primary">
              Step {index + 1}
            </span>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
