
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Digital Artist",
    content: "PureNFT completely transformed my career as a digital artist. Their platform made it easy to monetize my work and connect with a global audience of collectors.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "NFT Collector",
    content: "I've used several NFT marketplaces, but PureNFT stands out for their security and user experience. The verification process ensures I'm only buying authentic pieces.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Blockchain Developer",
    content: "From a technical perspective, PureNFT's implementation of smart contracts is impeccable. Their gas fee optimization and security protocols are industry-leading.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <div className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-primary/6 via-accent/4 to-transparent rounded-full blur-3xl animate-simple-float opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-[150px] h-[150px] bg-gradient-to-br from-accent/4 via-secondary/3 to-transparent rounded-full blur-2xl animate-simple-float opacity-30" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-primary/10 shadow-lg mb-6">
            <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">Community Testimonials</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">What Our</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Users Say</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-light">
            Trusted by creators and collectors worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-300 hover:bg-card/60 group"
            >
              <CardContent className="p-6 relative">
                <div className="mb-4">
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed text-center italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
