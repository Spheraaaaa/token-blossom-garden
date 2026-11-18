const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Total Volume", value: "$100M+" },
  { label: "NFTs Created", value: "1M+" },
  { label: "Platform Uptime", value: "99.9%" },
  { label: "Secure Transactions", value: "100%" },
  { label: "Global Reach", value: "190+" },
];

export const StatsSection = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 md:py-28">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Growing Community
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of creators and collectors in our thriving marketplace
        </p>
      </div>

      <dl className="mt-12 grid grid-cols-2 border-l border-t border-border md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse border-b border-r border-border px-5 py-7 md:px-8">
            <dt className="mt-1 text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="font-display text-2xl md:text-3xl font-semibold tabular-nums text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
