import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Unique Artwork",
    description: "Each NFT is a one-of-a-kind digital masterpiece, meticulously crafted by talented artists.",
    icon: "🎨"
  },
  {
    title: "Blockchain Verified",
    description: "Full transparency and ownership verification through Ethereum blockchain technology.",
    icon: "🔐"
  },
  {
    title: "Community Driven",
    description: "Join a vibrant community of collectors, artists, and crypto enthusiasts.",
    icon: "🌟"
  },
  {
    title: "Future Utility",
    description: "Holders gain exclusive access to events, drops, and special community benefits.",
    icon: "🚀"
  }
];

export const About = () => {
  return (
    <section className="py-20 px-6 bg-nft-gradient-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">About</span>{" "}
            <span className="bg-nft-gradient bg-clip-text text-transparent">
              CyberVault
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            CyberVault represents the pinnacle of digital art and blockchain technology. 
            Our collection features stunning cyberpunk-inspired artwork that pushes the 
            boundaries of creativity and innovation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-nft-card backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4 text-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">The Vision</h3>
            <p className="text-muted-foreground mb-6">
              CyberVault isn't just an NFT collection—it's a gateway to the future of digital ownership. 
              We believe in empowering artists and collectors through innovative blockchain technology 
              while creating stunning visual experiences that transcend traditional art boundaries.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">10,000</div>
                <div className="text-sm text-muted-foreground">Unique NFTs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">On-Chain</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold mb-6">Roadmap</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Phase 1: Genesis Launch</h4>
                  <p className="text-sm text-muted-foreground">Initial collection drop and community building</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Phase 2: Utility Expansion</h4>
                  <p className="text-sm text-muted-foreground">Exclusive events and holder benefits</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-muted rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold">Phase 3: Metaverse Integration</h4>
                  <p className="text-sm text-muted-foreground">Virtual gallery and avatar system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};