export default function Products() {
  return (
    <div className="min-h-screen p-8">
      <h2 className="text-primary text-3xl font-bold mb-4">Our Products</h2>
      <p className="mb-4 text-gray-700">
        Discover our range of innovative EV charging solutions designed for modern homes.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-white p-6 rounded-lg shadow">
          <h3 className="text-primary text-xl font-semibold mb-2">Smart Charger</h3>
          <p className="mb-4 text-gray-700">
            An intelligent charger that adapts to your energy usage and optimizes charging times.
          </p>
          <button className="bg-primary text-neutral-white px-4 py-2 rounded hover:bg-secondary">
            Buy Now
          </button>
        </div>
        <div className="bg-neutral-white p-6 rounded-lg shadow">
          <h3 className="text-primary text-xl font-semibold mb-2">Home Energy Monitor</h3>
          <p className="mb-4 text-gray-700">
            Monitor your energy consumption and manage charging with ease.
          </p>
          <button className="bg-primary text-neutral-white px-4 py-2 rounded hover:bg-secondary">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
