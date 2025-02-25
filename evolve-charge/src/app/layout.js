import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Evolve Charge</title>
      </head>
      <body className="bg-neutral-light text-gray-800 font-sans">
        <header className="bg-primary p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-white">Evolve Charge</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="text-neutral-white hover:text-secondary">Home</a>
                </li>
                <li>
                  <a href="/products" className="text-neutral-white hover:text-secondary">Products</a>
                </li>
                <li>
                  <a href="/about" className="text-neutral-white hover:text-secondary">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="text-neutral-white hover:text-secondary">Contact Us</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-primary p-4 mt-8">
          <div className="container mx-auto text-center text-neutral-white">
            © {new Date().getFullYear()} Evolve Charge. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
