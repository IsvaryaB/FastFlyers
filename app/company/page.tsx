// app/partner-community/page.tsx
export default function PartnerCommunityPage() {
  return (
    <main className="bg-gray-50 font-sans min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12 py-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ff-dark tracking-tight">
            <span className="text-ff-primary">FastFlyer</span> Global Partner Network
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting you to the world with the industry's leading logistics experts.
          </p>
        </header>

        {/* Partner Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* DHL */}
          <div className="logo-card bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center items-center hover:bg-yellow-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/DHL_Logo.svg/2560px-DHL_Logo.svg.png"
              alt="DHL Logo"
              className="w-full h-16 sm:h-20 object-contain"
            />
            <p className="mt-4 text-sm font-semibold text-gray-500">Logistics Leader</p>
          </div>

          {/* FedEx */}
          <div className="logo-card bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center items-center hover:bg-purple-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/FedEx_Express.svg/2560px-FedEx_Express.svg.png"
              alt="FedEx Logo"
              className="w-full h-16 sm:h-20 object-contain"
            />
            <p className="mt-4 text-sm font-semibold text-gray-500">Global Air Freight</p>
          </div>

          {/* UPS */}
          <div className="logo-card bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center items-center hover:bg-yellow-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/UPS_Logo_Shield_2017.svg/2560px-UPS_Logo_Shield_2017.svg.png"
              alt="UPS Logo"
              className="w-full h-16 sm:h-20 object-contain"
            />
            <p className="mt-4 text-sm font-semibold text-gray-500">United Parcel Service</p>
          </div>

          {/* TNT */}
          <div className="logo-card bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center items-center hover:bg-orange-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/TNT_logo.svg/2560px-TNT_logo.svg.png"
              alt="TNT Logo"
              className="w-full h-16 sm:h-20 object-contain"
            />
            <p className="mt-4 text-sm font-semibold text-gray-500">Time-Critical Delivery</p>
          </div>

          {/* Aramex */}
          <div className="logo-card bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center items-center hover:bg-red-50">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Aramex_Logo.svg/2560px-Aramex_Logo.svg.png"
              alt="Aramex Logo"
              className="w-full h-16 sm:h-20 object-contain"
            />
            <p className="mt-4 text-sm font-semibold text-gray-500">Middle East Specialist</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            *The logos above are sourced from public Wikimedia repositories for design purposes.
          </p>
        </footer>
      </div>
    </main>
  )
}
