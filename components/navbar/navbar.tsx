'use client';
import './navbar.css';
import { useEffect, useState } from 'react';
import { FaHeart, FaShoppingCart, FaBell, FaUser, FaSearch, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [initial, setInitial] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to get and update the user initial
  const updateUserInitial = () => {
    const stored = sessionStorage.getItem('user');
    if (!stored) {
      console.warn('No user found in sessionStorage');
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user?.name) {
        const firstLetter = user.name.charAt(0).toUpperCase();
        setInitial(firstLetter);
      }
    } catch (err) {
      console.error('Failed to parse sessionStorage user:', err);
    }
  };

  useEffect(() => {
    console.log('Navbar mounted');
    updateUserInitial(); // Initial check on mount

    // Listen for changes in sessionStorage
    const handleUserUpdated = () => {
      console.log('User updated, re-fetching from sessionStorage...');
      updateUserInitial();
    };

    // Add event listener for user-updated event
    window.addEventListener('user-updated', handleUserUpdated);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-white shadow-xl px-4 py-7 flex items-center justify-between">
      {/* Menu Button (for small screens) */}
      <div className="md:hidden relative">
        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800 focus:outline-none">
          <FaBars size={24} />
        </button>
        {isMenuOpen && (
          <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cart</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          </div>
        )}
      </div>

      {/* Search Bar (slightly from left) */}
      <div className="flex items-center w-full max-w-xl ml-20 mr-auto flex-grow">
        <FaSearch className="text-gray-400 mr-2" size={27} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find Your Course"
          className="w-full p-3 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500  placeholder-gray-700"
        />
      </div>

      {/* Right-side Icons */}
      <div className="hidden md:flex items-center space-x-7 mr-8 text-gray-600">
        <button className="hover:text-red-500">
          <FaHeart size={27} style={{ color: 'white', stroke: 'black', strokeWidth: '40px', opacity: 0.7 }} />
        </button>
        <button className="hover:text-blue-500">
          <FaShoppingCart size={27} style={{ color: 'white', opacity: 0.7, stroke: 'black', strokeWidth: '40px' }} />
        </button>
        <button className="hover:text-yellow-500">
          <FaBell size={27} style={{ color: 'white', opacity: 0.7, stroke: 'black', strokeWidth: '40px' }} />
        </button>
        <button
          className="w-10 h-10 bg-green-900 text-white rounded-full flex items-center justify-center font-bold text-lg hover:opacity-90"
          onClick={() => console.log('Profile clicked')} // Replace with your own action
        >
          {initial || <FaUser size={20} />}
        </button>
      </div>
    </nav>
  );
}