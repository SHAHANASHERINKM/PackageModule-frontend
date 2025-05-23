'use client';
import './navbar.css';
import { useEffect, useState, useRef } from 'react';
import { FaHeart, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import SearchBar from './searchBar/searchBar';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic imports
const CartDropdown = dynamic(() => import('./CartDropdown/cartDropdown'), { ssr: false });
const WishlistDropdown = dynamic(() => import('./wishListDropdown/wishListDropdown'), { ssr: false });
import YourLearning from './your-learnings/your-learnings';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const [initial, setInitial] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showYourLearning, setShowYourLearning] = useState(false);
const router = useRouter();
  const cartRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const learningRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        cartRef.current && !cartRef.current.contains(target) &&
        wishlistRef.current && !wishlistRef.current.contains(target) &&
        profileRef.current && !profileRef.current.contains(target) &&
        learningRef.current && !learningRef.current.contains(target)
      ) {
        setShowCart(false);
        setShowWishlist(false);
        setShowProfileDropdown(false);
        setShowYourLearning(false);
      }
    }

    if (showCart || showWishlist || showProfileDropdown || showYourLearning) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCart, showWishlist, showProfileDropdown, showYourLearning]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => {
    setShowCart(prev => {
      if (!prev) {
        setShowWishlist(false);
        setShowProfileDropdown(false);
        setShowYourLearning(false);
      }
      return !prev;
    });
  };
  const toggleWishlist = () => {
    setShowWishlist(prev => {
      if (!prev) {
        setShowCart(false);
        setShowProfileDropdown(false);
        setShowYourLearning(false);
      }
      return !prev;
    });
  };
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => {
      if (!prev) {
        setShowCart(false);
        setShowWishlist(false);
        setShowYourLearning(false);
      }
      return !prev;
    });
  };

  const handleYourLearningClick = () => {
    setShowYourLearning(prev => {
      if (!prev) {
        setShowCart(false);
        setShowWishlist(false);
        setShowProfileDropdown(false);
      }
      return !prev;
    });
  };

  return (
    <>
      <nav className="w-full bg-white shadow-xl px-4 py-7 flex flex-wrap items-center justify-between relative z-50">

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <FaBars size={24} />
          </button>
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-10">
             <button onClick={() => userId && router.push(`/wishlist/${userId}`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</button>
<button onClick={() => userId && router.push(`/cart/${userId}`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cart</button>
<button onClick={() => userId && router.push(`/your-courses/${userId}`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Courses</button>
<button onClick={() => userId && router.push(`/learnings/${userId}`)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Learnings</button>
 
    </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-xl ml-0 md:ml-20">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-7 mr-8 text-gray-600 relative">


 <div className="relative" >
  <button
    onClick={() =>  router.push(`/teaching-page/start-page`)}
    className="text-xl font-medium hover:underline hover:text-purple-600"
  >
    Start Teaching
  </button>
  
</div>


          <div className="relative" ref={learningRef}>
  <button
    onClick={handleYourLearningClick}
    className="text-xl font-medium hover:underline hover:text-purple-600"
  >
    Your Learnings
  </button>
  {showYourLearning && userId && <YourLearning userId={userId} />}
</div>


          <div className="relative" ref={wishlistRef}>
            <button className="hover:text-red-500" onClick={toggleWishlist}>
              <FaHeart
                size={27}
                style={{ color: 'white', stroke: 'black', strokeWidth: '40px', opacity: 0.7 }}
              />
            </button>
            {showWishlist && userId && <WishlistDropdown userId={userId} />}
          </div>

          <div className="relative" ref={cartRef}>
            <button className="hover:text-blue-500" onClick={toggleCart}>
              <FaShoppingCart
                size={27}
                style={{ color: 'white', opacity: 0.7, stroke: 'black', strokeWidth: '40px' }}
              />
            </button>
            {showCart && userId && <CartDropdown userId={userId} />}
          </div>

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
               <Link href={`/learnings/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">Your Learnings</Link>
                
                <Link href={`/cart/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">Cart</Link>
                <Link href={`/wishlist/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md"> Wishlist</Link>
                <Link href={`/your-courses/${userId}`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">Your Courses</Link>
                 <Link href={`/teaching-page/start-page`} className="block px-2 py-2 hover:bg-gray-200 rounded-md">Start Teaching</Link>
             
              </div>
            )}
          </div>
        </div>
      </nav>

      
    </>
  );
}
