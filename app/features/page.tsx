export default function FeaturesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Our Powerful Features
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg hover:scale-105 transition-transform shadow-lg text-center">
          <div className="text-4xl mb-4 animate-bounce">📍</div>
          <h2 className="text-xl font-semibold text-black">Real-time Tracking</h2>
          <p className="text-sm text-black mt-2">
            Monitor your shipments live with precise GPS updates.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg hover:scale-105 transition-transform shadow-lg text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <h2 className="text-xl font-semibold text-black">Instant Booking</h2>
          <p className="text-sm text-black mt-2">
            Book your deliveries instantly with just a few clicks.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg hover:scale-105 transition-transform shadow-lg text-center">
          <div className="text-4xl mb-4 animate-spin-slow">💰</div>
          <h2 className="text-xl font-semibold text-black">Transparent Pricing</h2>
          <p className="text-sm text-black mt-2">
            No hidden charges – get clear and upfront pricing every time.
          </p>
        </div>
      </div>
    </main>
  );
}
