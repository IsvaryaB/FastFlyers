"use client"

export default function JoinUsPage() {
  const applyNow = () => {
    alert("Thank you for your interest! Redirecting to careers page...")
    window.location.href = "https://your-careers-page.com" // Replace with your careers link
  }

  return (
    <main className="relative container mx-auto px-6 py-16 text-center">
      {/* Floating blob */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 animate-bounce" />

      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-down">
        🚀 Join Our Team
      </h1>

      <p className="text-lg text-gray-700 mb-8 animate-fade-in-up">
        We’re hiring across operations, engineering, and support. <br />
        Be part of a fast-growing, innovative, and passionate community.
      </p>

      <button
        onClick={applyNow}
        className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform hover:scale-110 transition-all duration-300 animate-pop-in"
      >
        Apply Now
      </button>

      {/* Roles Section */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">⚙️ Engineering</h3>
          <p className="text-gray-600">Build scalable and creative solutions for our users.</p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">📦 Operations</h3>
          <p className="text-gray-600">Ensure smooth deliveries and world-class logistics.</p>
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">💬 Support</h3>
          <p className="text-gray-600">Help our customers with care and clear communication.</p>
        </div>
      </div>
    </main>
  )
}
