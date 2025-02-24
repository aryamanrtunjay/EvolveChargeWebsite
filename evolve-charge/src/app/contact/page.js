export default function Contact() {
  return (
    <div className="min-h-screen p-8">
      <h2 className="text-primary text-3xl font-bold mb-4">Contact Us</h2>
      <p className="mb-4 text-gray-700">Have questions or need support? Reach out to us!</p>
      <form className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
          <input type="text" id="name" className="w-full p-2 border rounded" placeholder="Your Name" />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
          <input type="email" id="email" className="w-full p-2 border rounded" placeholder="Your Email" />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="message">Message</label>
          <textarea id="message" className="w-full p-2 border rounded" rows="4" placeholder="Your Message"></textarea>
        </div>
        <button type="submit" className="bg-secondary text-neutral-white px-4 py-2 rounded hover:bg-primary">
          Send Message
        </button>
      </form>
    </div>
  );
}
