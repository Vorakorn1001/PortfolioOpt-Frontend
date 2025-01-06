import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-gray-800 text-white py-4">
    <div className="flex items-center justify-between max-w-screen-lg w-full mx-auto">
      {/* Portfolio Optimizer Logo/Title */}
      <div className="text-xl font-bold ml-0">Portfolio Optimizer</div>

      {/* Navigation Buttons */}
      <div className="flex space-x-6 mr-0">
        {/* Home Button */}
        <Link
          href="/"
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          Home
        </Link>

        {/* Portfolio Button */}
        <Link
          href="/portfolio"
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          Portfolio
        </Link>

        {/* Sign Up/Login Button */}
        <Link
          href="/auth"
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
        >
          Sign Up/Login
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
