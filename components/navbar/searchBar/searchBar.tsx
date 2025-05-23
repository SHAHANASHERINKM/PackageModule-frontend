'use client';

import { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface PackageSuggestion {
  package_id: number;
  courseLandingPage: {
    title: string;
  };
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  } as T;
}

export default function SearchBar() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<PackageSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/package/search-package?q=${encodeURIComponent(query)}`);
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Invalid JSON response");
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(debounce(fetchSuggestions, 400)).current;

  const handleInputChange = (value: string) => {
    setSearch(value);
    debouncedFetch(value);
  };

  const handleSelect = (item: PackageSuggestion) => {
    setSearch(item.courseLandingPage.title);
    setSuggestions([]);
    router.push(`/packageOverview/${item.package_id}`);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center bg-white border border-gray-500 rounded-full px-4 py-2">
        <FaSearch className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Find Your Course"
          className="w-full focus:outline-none placeholder-gray-600"
        />
      </div>

      {search && suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-black border border-gray-300 rounded-md mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.package_id}
              className="px-4 py-2 hover:bg-gray-800 text-white cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item.courseLandingPage.title}
            </li>
          ))}
        </ul>
      )}

      {search && suggestions.length === 0 && !loading && (
        <ul className="absolute left-0 w-full bg-black border border-gray-300 rounded-md mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
          <li className="px-4 py-2 text-gray-500 text-center">No matches found</li>
        </ul>
      )}

      {loading && (
        <div className="absolute top-full left-0 w-full bg-black border border-gray-300 rounded-md mt-1 shadow z-50 p-3 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}

    </div>
  );
}
