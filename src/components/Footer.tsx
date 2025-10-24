export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>Email: contact@model.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Location: Sofia, Bulgaria</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">Instagram</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">Facebook</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">LinkedIn</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/portfolio" className="hover:text-gray-300">Portfolio</a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-300">About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-300">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Model Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}