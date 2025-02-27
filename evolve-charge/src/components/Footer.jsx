"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              EVolve Charge
            </h3>
            <p className="text-gray-300 mb-4">Revolutionizing EV charging with smart, automated technology that makes charging easier and more efficient.</p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href="#" className="text-gray-300 hover:text-teal-500 transition-colors">
                  <span className="sr-only">{social}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Technology', 'Pricing', 'FAQ', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-full text-gray-900 focus:outline-none flex-grow"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-r-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} EVolve Charge Inc. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#privacypolicy" className="hover:text-teal-500 transition-colors">Privacy Policy</a>
            <a href="#tos" className="hover:text-teal-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}