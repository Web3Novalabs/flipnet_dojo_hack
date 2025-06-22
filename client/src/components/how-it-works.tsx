import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  return (
    <div>
      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 bg-gradient-to-b from-gray-900 text-white to-black"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-gray-300 text-lg">
              Getting started with FlipNet is easy. Follow these simple steps to
              begin your prediction journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl flex flex-col items-center text-center z-10 relative h-full border border-gray-700/50">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
                <p className="text-gray-400">
                  Connect your Starknet-compatible wallet to access the FlipNet
                  platform.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-indigo-500/50 -translate-y-1/2 z-0"></div>
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl flex flex-col items-center text-center z-10 relative h-full border border-gray-700/50">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Markets</h3>
                <p className="text-gray-400">
                  Browse available prediction markets and select the ones that
                  interest you.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-indigo-500/50 -translate-y-1/2 z-0"></div>
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl flex flex-col items-center text-center z-10 relative h-full border border-gray-700/50">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Stake & Win</h3>
                <p className="text-gray-400">
                  Place your stake on the outcome you predict. If you&apos;re
                  right, earn rewards instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            {/* <Link href={"/flip"}> */}
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-8 rounded-full font-semibold transition cursor-pointer transform hover:scale-105 hover:shadow-lg inline-flex items-center">
                Start Playing Now <ArrowRight size={18} className="ml-2" />
              </button>
            {/* </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
