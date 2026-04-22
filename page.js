"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GamingHub() {
  const [uniqueId, setUniqueId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('user_unique_id');
    if (savedId) {
      setUniqueId(savedId);
      setIsActivated(true);
    }
  }, []);

  const generateID = () => {
    const newId = 'VLT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('user_unique_id', newId);
    setUniqueId(newId);
    setIsActivated(true);
  };

  const handleCreateGame = async () => {
    if (!prompt) return alert("Describe your game first!");
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.code) {
        const blob = new Blob([data.code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      alert("Error generating game. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const games = [
    { name: 'Subway', color: 'from-yellow-400 to-orange-500' },
    { name: 'Temple Run', color: 'from-green-500 to-emerald-800' },
    { name: 'Bubble Bash', color: 'from-pink-500 to-purple-600' },
    { name: 'Mario', color: 'from-red-500 to-red-800' },
    { name: 'Counter Strike 3D', color: 'from-gray-700 to-black' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500">
      <div className="fixed inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#000_100%)]" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">NEON-VAULT</h1>
        {isActivated ? (
          <div className="px-4 py-1 bg-green-500/10 border border-green-500/50 rounded-full text-green-400 text-xs font-mono">
            ID: {uniqueId} • LIFETIME ACTIVE
          </div>
        ) : (
          <button onClick={generateID} className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-cyan-400 transition-all">ACTIVATE ID</button>
        )}
      </header>

      <main className="relative z-10 p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
          {games.map((game) => (
            <motion.div whileHover={{ y: -10 }} key={game.name} className={`h-64 rounded-xl bg-gradient-to-br ${game.color} p-4 flex flex-col justify-end shadow-lg cursor-pointer`}>
              <h3 className="font-black text-lg uppercase">{game.name}</h3>
              <button className="mt-2 text-[10px] bg-black/50 backdrop-blur-md border border-white/20 w-fit px-3 py-1 rounded-full">LAUNCH GAME</button>
            </motion.div>
          ))}
        </div>

        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          <h3 className="text-xl font-bold mb-4 italic">AI GAME FORGE</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a game (e.g. 'A neon space shooter with powerups')..."
              className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all"
            />
            <button 
              onClick={handleCreateGame}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 px-10 py-4 rounded-xl font-black uppercase disabled:opacity-50"
            >
              {loading ? "Creating..." : "Generate & Play"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
