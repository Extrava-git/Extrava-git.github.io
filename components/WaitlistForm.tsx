'use client';

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Fetch current data
      const response = await fetch('https://api.npoint.io/6b50073ae454405f0275');
      let currentEmails = [];
      
      if (response.ok) {
        try {
          const data = await response.json();
          currentEmails = Array.isArray(data) ? data : [];
        } catch (e) {
          console.error('Error parsing waitlist JSON:', e);
          currentEmails = [];
        }
      }
      
      // 2. Add new email locally (check for duplicates)
      const normalizedEmail = email.trim().toLowerCase();
      if (currentEmails.map((e: string) => e.toLowerCase()).includes(normalizedEmail)) {
        setStatus('success');
        setMessage('You are already on the waitlist!');
        return;
      }

      const updatedEmails = [...currentEmails, normalizedEmail];

      // 3. Post updated list
      const postResponse = await fetch('https://api.npoint.io/6b50073ae454405f0275', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmails),
      });

      if (!postResponse.ok) throw new Error('Failed to update waitlist');

      setStatus('success');
      setMessage('Thank you for joining our waitlist!');
      setEmail('');
    } catch (error) {
      console.error('Waitlist error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-12 bg-signal-cyan/10 border border-signal-cyan/20 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-semibold text-signal-cyan mb-2">Success!</h2>
        <p className="text-ink-200">{message}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-ink-300 hover:text-white transition-colors"
        >
          Add another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 bg-ink-900/50 p-8 rounded-2xl space-y-5 text-left">
      <div>
        <label htmlFor="email" className="block text-sm text-ink-300 mb-2">Work email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="jane@hospital.org" 
          className="w-full bg-ink-950 p-3 rounded-lg border border-white/10 text-white focus:outline-none focus:border-signal-cyan/50 transition-colors" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={status === 'loading'}
        />
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm">{message}</p>
      )}
      <button 
        type="submit" 
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-ink-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Joining...
          </span>
        ) : 'Join waitlist'}
      </button>
    </form>
  );
}
