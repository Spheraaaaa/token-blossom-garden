import { NFTCard } from "./NFTCard";
import nft1 from "@/assets/nft-1.jpg";
import nft2 from "@/assets/nft-2.jpg";
import nft3 from "@/assets/nft-3.jpg";

const nftData = [
  {
    id: 1001,
    title: "Quantum Crystals",
    image: nft1,
    price: "2.5",
    rarity: "Legendary",
    creator: "CyberArtist"
  },
  {
    id: 1002,
    title: "Neon Guardian",
    image: nft2,
    price: "3.2",
    rarity: "Epic",
    creator: "DigitalVoid"
  },
  {
    id: 1003,
    title: "Cosmic Realm",
    image: nft3,
    price: "1.8",
    rarity: "Rare",
    creator: "NebulaCreator"
  },
  {
    id: 1004,
    title: "Matrix Fragment",
    image: nft1,
    price: "4.1",
    rarity: "Mythic",
    creator: "CyberArtist"
  },
  {
    id: 1005,
    title: "Cyber Samurai",
    image: nft2,
    price: "2.9",
    rarity: "Epic",
    creator: "DigitalVoid"
  },
  {
    id: 1006,
    title: "Stellar Gateway",
    image: nft3,
    price: "2.2",
    rarity: "Rare",
    creator: "NebulaCreator"
  }
];

export const NFTGallery = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-nft-gradient bg-clip-text text-transparent">
              Featured
            </span>{" "}
            <span className="text-foreground">Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover unique digital masterpieces from our exclusive CyberVault collection.
            Each NFT is carefully crafted and verified on the blockchain.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nftData.map((nft, index) => (
            <div 
              key={nft.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NFTCard {...nft} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-nft-gradient-secondary border border-primary/30 hover:border-primary/60 text-foreground px-8 py-3 rounded-lg hover:shadow-nft-border-glow transition-all duration-300">
            View All Collection
          </button>
        </div>
      </div>
    </section>
  );
};