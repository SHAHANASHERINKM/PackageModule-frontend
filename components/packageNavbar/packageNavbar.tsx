'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUser } from 'react-icons/fa';

export default function packageNavbar() {
  const [initial, setInitial] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.name) {
          setInitial(user.name.charAt(0).toUpperCase());
        }
      } catch (err) {
        console.error('Error parsing user from sessionStorage', err);
      }
    }
  }, []);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Back link */}
      <div className="flex items-center space-x-3">
        <FaArrowLeft className="text-gray-700" />
        <Link href="/packages">
          <span className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">Back to Packages</span>
        </Link>
      </div>

      {/* Right: Profile Icon */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:opacity-90">
          {initial || <FaUser size={20} />}
        </div>
      </div>
    </nav>
  );
}
