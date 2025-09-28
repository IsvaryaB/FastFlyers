import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="relative container mx-auto px-6 py-16 text-center">
      {/* Background blob for creativity */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" />

      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-down">
        🌍 Our Services
      </h1>

      <p className="text-lg text-gray-700 mb-12 animate-fade-in-up">
        Explore our <span className="font-semibold text-indigo-600">pickup</span>,{" "}
        <span className="font-semibold text-purple-600">air freight</span>, and{" "}
        <span className="font-semibold text-indigo-600">last-mile delivery</span> services
        tailored for <span className="font-bold">speed</span> and <span className="font-bold">reliability</span>.
      </p>

      {/* Services Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">🚚 Pickup</h3>
          <p className="text-gray-600">
            Fast and hassle-free doorstep pickup, ensuring your shipment starts its journey smoothly.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-purple-600 mb-2">✈️ Air Freight</h3>
          <p className="text-gray-600">
            Reliable international and domestic air cargo services designed for speed and security.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">📦 Last-Mile Delivery</h3>
          <p className="text-gray-600">
            Get packages delivered right to the customer’s door with real-time tracking.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 animate-pop-in">
        <Link
          href="/book"
          prefetch={false}
          className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform hover:scale-110 transition-all duration-300"
        >
          Start Shipping 🚀
        </Link>
      </div>
    </main>
  );
}
