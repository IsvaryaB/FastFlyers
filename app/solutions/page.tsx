export default function SolutionsPage() {
  return (
    <main className="relative container mx-auto px-6 py-16 text-center">
      {/* Background blob */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />

      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-down">
        🛠 Our Solutions
      </h1>

      <p className="text-lg text-gray-700 mb-12 animate-fade-in-up">
        Industry-specific logistics solutions for e-commerce, healthcare, and manufacturing.
      </p>

      {/* Solutions Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
        {/* E-commerce */}
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">🛒 E-commerce</h3>
          <p className="text-gray-600">
            Fast and reliable shipping solutions for online stores, with real-time tracking and optimized routes.
          </p>
        </div>

        {/* Healthcare */}
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-purple-600 mb-2">🏥 Healthcare</h3>
          <p className="text-gray-600">
            Specialized logistics for medical supplies, ensuring temperature control and timely delivery.
          </p>
        </div>

        {/* Manufacturing */}
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">🏭 Manufacturing</h3>
          <p className="text-gray-600">
            End-to-end supply chain solutions for factories, including warehousing, freight, and distribution.
          </p>
        </div>
      </div>
    </main>
  );
}
