"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Footer() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartTeaching = () => {
    router.push('/teaching-page/start-page');
  };

  if (!mounted) return null;

  return (
    <footer className="w-full bg-[#383837] text-white py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-base sm:text-lg font-serif text-center sm:text-left">
          © 2025 Share your knowledge. Inspire the next generation.
        </p>
        <button
          onClick={handleStartTeaching}
          className="bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 w-full sm:w-auto text-base"
        >
          Start Teaching
        </button>
      </div>
    </footer>
  );
}

export default Footer;
