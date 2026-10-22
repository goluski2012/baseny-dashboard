"use client"

import React, { useState } from 'react';
import { Search } from 'lucide-react';

// --- YOUR EXPLICIT HARDCODED POOL DATA ---
const INITIAL_POOL_DATA = [
  { id: 1, poolName: "POSiR Oddział Chwiałka", address: "ul. Spychalskiego 34, Poznań", distance: "13,8 km", freeLanes: 3, maxLanes: 6, untilTime: "16:00", day: "Thursday" },
  { id: 2, poolName: "Pływalnia Miejska Grunwald", address: "ul. Taborowa 4, Poznań", distance: "10,5 km", freeLanes: 0, maxLanes: 8, nextAvailable: "09:15 — 4 wolne tory", day: "Thursday" },
  { id: 3, poolName: "CityZen Poznań", address: "Droga Dębińska 10c, Poznań", distance: "13,1 km", freeLanes: 2, maxLanes: 6, untilTime: "14:30", day: "Thursday" },
  { id: 4, poolName: "Tarnowskie Termy", address: "ul. Nowa 54, Tarnowo Podgórne", distance: "19,2 km", freeLanes: 4, maxLanes: 10, untilTime: "22:00", day: "Thursday" }
];

export default function PoolAvailabilityDashboard() {
  // 1. State engines for selectors
  const [selectedPool, setSelectedPool] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Thursday');
  const [selectedTime, setSelectedTime] = useState('All');
  
  // 2. Holds the live results showing on screen
  const [displayedPools, setDisplayedPools] = useState(INITIAL_POOL_DATA);

  // 3. Filtering Engine executed on form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const matches = INITIAL_POOL_DATA.filter((pool) => {
      const matchPool = selectedPool === 'All' || pool.poolName.toLowerCase().includes(selectedPool.toLowerCase());
      const matchDay = selectedDay === 'All' || pool.day === selectedDay;
      // Note: Advanced filtering logic can be expanded here for specific dynamic timeslots if needed.
      return matchPool && matchDay;
    });

    setDisplayedPools(matches);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* APP TITLE / HEADER */}
        <div className="text-center md:text-left space-y-2 border-b border-slate-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pływalnie Poznań — Dostępność Torów
          </h1>
          <p className="text-sm text-slate-400">
            Sprawdź, ile torów jest wolnych do pływania indywidualnego — teraz i w dowolnym dniu tygodnia.
          </p>
        </div>

        {/* --- DYNAMIC INTERACTIVE SEARCH BAR (AT THE TOP) --- */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur shadow-lg">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Wybierz Basen</label>
            <select 
              value={selectedPool} 
              onChange={(e) => setSelectedPool(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Wszystkie Obiekty (All)</option>
              <option value="Chwiałka">POSiR Chwiałka</option>
              <option value="Grunwald">Miejska Grunwald</option>
              <option value="CityZen">CityZen Poznań</option>
              <option value="Tarnowskie">Tarnowskie Termy</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Dzień Tygodnia</label>
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Dowolny Dzień</option>
              <option value="Monday">Poniedziałek</option>
              <option value="Tuesday">Wtorek</option>
              <option value="Wednesday">Środa</option>
              <option value="Thursday">Czwartek</option>
              <option value="Friday">Piątek</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Godzina / Czas</label>
            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Teraz / Cały Dzień</option>
              <option value="morning">Rano (06:00 - 12:00)</option>
              <option value="afternoon">Popołudnie (12:00 - 17:00)</option>
              <option value="evening">Wieczór (17:00 - 22:00)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-[0.98]"
            >
              <Search size={16} />
              Szukaj Wolnych Torów
            </button>
          </div>
        </form>

        {/* POOL LISTING LAYOUT SECTION */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-200">Pływalnie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedPools.length > 0 ? (
              displayedPools.map((pool) => (
                <div key={pool.id} className="p-5 rounded-xl border border-slate-800 bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-slate-100">{pool.poolName}</h3>
                    </div>
                    <p className="text-xs text-slate-400">{pool.address}</p>
                    <span className="inline-block text-xs bg-slate-800 text-blue-400 px-2.5 py-0.5 rounded-md mt-1">
                      Odległość z Gołusek: {pool.distance}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs uppercase text-slate-400 block font-semibold tracking-wider">Teraz</span>
                      <span className={`text-xl font-extrabold ${pool.freeLanes > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pool.freeLanes} <span className="text-sm font-medium text-slate-300">wolne tory / {pool.maxLanes}</span>
                      </span>
                      {pool.untilTime && <p className="text-xs text-slate-500 mt-0.5">do {pool.untilTime}</p>}
                      {pool.nextAvailable && <p className="text-xs text-amber-400 mt-0.5">Następnie: {pool.nextAvailable}</p>}
                    </div>
                    
                    {/* Visual Lane Bars Indicator */}
                    <div className="flex gap-1 items-end h-8">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-t transition-all ${
                            pool.freeLanes > 0 ? 'h-6 bg-blue-500 animate-pulse' : 'h-2 bg-slate-800'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center p-12 border border-dashed border-slate-800 rounded-xl text-slate-400">
                Brak wolnych torów spełniających kryteria wyszukiwania.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
