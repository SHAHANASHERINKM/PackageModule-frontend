"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router=useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/package/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
if(res.ok){
  const data = await res.json();
  sessionStorage.setItem('user', JSON.stringify({
    name: data.user.name,
    user_id: data.user.user_id
  }));
  window.dispatchEvent(new Event('user-updated'));
  console.log('sessionStorage', sessionStorage.getItem('user'));
    setMessage(data.message || 'Login response received');
     
  const user_id=data.user.user_id;
  router.push(`/main-page/${user_id}`)
  
}
else {
  alert('User not found');
}
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full border p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
