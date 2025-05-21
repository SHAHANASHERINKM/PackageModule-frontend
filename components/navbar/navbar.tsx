'use client';
import './navbar.css';
import { useEffect, useState, useRef } from 'react';
import { FaHeart, FaShoppingCart, FaBell, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const CartDropdown = dynamic(() => import('./CartDropdown/cartDropdown'), { ssr: false });
const WishlistDropdown = dynamic(() => import('./wishListDropdown/wishListDropdown'), { ssr: false });

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [initial, setInitial] = useState<string | null>(null);
  
  const [name, setName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Refs for dropdowns to handle outside clicks
  const cartRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const updateUserInitial = () => {
    const stored = sessionStorage.getItem('user');
    if (!stored) return;

    try {
      const user = JSON.parse(stored);
      if (user?.name) {
        setInitial(user.name.charAt(0).toUpperCase());
        setUserId(user.user_id);
        
        setName(user.name || null);
      }
    } catch (err) {
      console.error('Failed to parse sessionStorage user:', err);
    }
  };

  useEffect(() => {
    updateUserInitial();
    window.addEventListener('user-updated', updateUserInitial);
    return () => window.removeEventListener('user-updated', updateUserInitial);
  }, []);

  // Close all dropdowns if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cartRef.current && !cartRef.current.contains(event.target as Node) &&
        wishlistRef.current && !wishlistRef.current.contains(event.target as Node) &&
        profileRef.current && !profileRef.current.contains(event.target as Node)
      ) {
        setShowCart(false);
        setShowWishlist(false);
        setShowProfileDropdown(false);
      }
    }

    if (showCart || showWishlist || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCart, showWishlist, showProfileDropdown]);

  // Toggle functions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setShowCart(prev => {
      if (!prev) setShowWishlist(false);
      setShowProfileDropdown(false);
      return !prev;
    });
  };

  const toggleWishlist = () => {
    setShowWishlist(prev => {
      if (!prev) setShowCart(false);
      setShowProfileDropdown(false);
      return !prev;
    });
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => {
      if (!prev) {
        setShowCart(false);
        setShowWishlist(false);
      }
      return !prev;
    });
  };

  return (
    <nav className="w-full bg-white shadow-xl px-4 py-7 flex items-center justify-between relative z-50">
      {/* Mobile Menu */}
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

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-xl ml-20 mr-auto flex-grow">
        <FaSearch className="text-gray-400 mr-2" size={27} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find Your Course"
          className="w-full p-3 border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-700"
        />
      </div>

      {/* Right-side Icons */}
      <div className="hidden md:flex items-center space-x-7 mr-8 text-gray-600 relative">

        {/* Wishlist Icon + Dropdown */}
        <div className="relative" ref={wishlistRef}>
          <button className="hover:text-red-500" onClick={toggleWishlist}>
            <FaHeart
              size={27}
              style={{ color: 'white', stroke: 'black', strokeWidth: '40px', opacity: 0.7 }}
            />
          </button>
          {showWishlist && userId && <WishlistDropdown userId={userId} />}
        </div>

        {/* Cart Icon + Dropdown */}
        <div className="relative" ref={cartRef}>
          <button className="hover:text-blue-500" onClick={toggleCart}>
            <FaShoppingCart
              size={27}
              style={{ color: 'white', opacity: 0.7, stroke: 'black', strokeWidth: '40px' }}
            />
          </button>
          {showCart && userId && <CartDropdown userId={userId} />}
        </div>

        {/* Profile Icon + Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="w-10 h-10 bg-green-900 text-white rounded-full flex items-center justify-center font-bold text-lg hover:opacity-90"
            onClick={toggleProfileDropdown}
          >
            {initial || <FaUser size={20} />}
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-70 bg-white rounded-md shadow-xl z-20 py-4 px-4 text-gray-700">
              <p className="font-semibold text-xl">{name || 'User Name'}</p>
              
              <hr className="border-gray-300 mb-3" />
              <a href="/your-learning" className="block px-2 py-2 hover:bg-gray-200 rounded-md">Your Learning</a>
               <Link href={`/cart/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">
      Cart
    </Link>
              <Link href={`/wishlist/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">
     Your Wishlist
    </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
