export default function Home() {
  return (
    <div className="bg-neutral-light min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-primary text-4xl font-bold mb-4">
        Welcome to Evolve Charge
      </h2>
      <p className="mb-8 text-gray-700">
        Automating your home EV charging experience with cutting-edge technology.
      </p>
      <a
        href="/products"
        className="bg-primary text-neutral-white px-6 py-3 rounded-full hover:bg-secondary"
      >
        Explore Our Products
      </a>
    </div>
  );
}
