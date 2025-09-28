export default function SupportPage() {
  const email = "info@fastflyer.in"; 
  const phone = "+91-86672 94376";       

  return (
    <main className="relative container mx-auto px-6 py-16 text-center">
      {/* Background blob */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" />

      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-down">
        💬 Support
      </h1>

      <p className="text-lg text-gray-700 mb-12 animate-fade-in-up">
        How can we help? Reach out 24/7 for assistance.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 justify-center">
        {/* Email Card */}
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">📧 Email Us</h3>
          <p className="text-gray-600 mb-2">{email}</p>
          <a
            href={`mailto:${email}`}
            className="text-indigo-500 underline hover:text-indigo-700"
          >
            Send Email
          </a>
        </div>

        {/* Phone Card */}
        <div className="p-6 rounded-xl bg-white shadow-lg hover:scale-105 transition-transform">
          <h3 className="text-xl font-bold text-purple-600 mb-2">📞 Call Us</h3>
          <p className="text-gray-600 mb-2">{phone}</p>
          <a
            href={`tel:${phone}`}
            className="text-purple-500 underline hover:text-purple-700"
          >
            Call Now
          </a>
        </div>
      </div>
    </main>
  );
}
