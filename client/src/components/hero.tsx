import { ArrowRight, Shield } from "lucide-react";
import flip_img from "../../public/flip.jpg";

const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#0a0a0a] backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                  Predict. Stake. Win.
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300">
                  FlipNet is the next-generation prediction market on Starknet
                  where players stake tokens to forecast event outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* <Link href="/flip"> */}
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer py-3 px-8 rounded-full font-semibold transition transform hover:scale-105 hover:shadow-lg flex items-center justify-center">
                      Start Playing <ArrowRight size={18} className="ml-2" />
                    </button>
                  {/* </Link> */}

                  <button className="bg-transparent border cursor-pointer border-indigo-500 py-3 px-8 rounded-full font-semibold transition hover:bg-indigo-500/20 flex items-center justify-center text-white">
                    Learn More
                  </button>
                </div>
                <div className="mt-8 flex items-center text-gray-400 text-sm">
                  <Shield size={16} className="mr-2" />
                  <span>Secure, transparent, and verifiable on Starknet</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10 animate-float">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gray-900 rounded-lg p-2">
                  <img src={flip_img} alt="Hero Image" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
